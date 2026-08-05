import { Track, Clip, AspectRatio, CaptionStyle, EffectType } from '../types';
import { getInterpolatedTransform, getInterpolatedProperty } from './keyframeUtils';
import { applyChromaKey } from './chromaKeyUtils';

export interface CanvasDimensions {
  width: number;
  height: number;
}

export function getDimensionsForAspectRatio(aspectRatio: AspectRatio, targetWidth = 1080): CanvasDimensions {
  switch (aspectRatio) {
    case '9:16':
      return { width: targetWidth, height: Math.round((targetWidth * 16) / 9) };
    case '1:1':
      return { width: targetWidth, height: targetWidth };
    case '16:9':
    default:
      return { width: targetWidth, height: Math.round((targetWidth * 9) / 16) };
  }
}

/**
 * Main Canvas Render function drawing the multi-layer composition at exact timeline timestamp.
 */
export function renderCanvasFrame(
  ctx: CanvasRenderingContext2D,
  offscreenCtx: CanvasRenderingContext2D | null,
  tracks: Track[],
  timelineTime: number,
  aspectRatio: AspectRatio,
  videoElementsMap: Map<string, HTMLVideoElement>,
  imageElementsMap: Map<string, HTMLImageElement>
): void {
  const { width, height } = getDimensionsForAspectRatio(aspectRatio, ctx.canvas.width || 1080);
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  // Clear canvas background
  ctx.fillStyle = '#08090c';
  ctx.fillRect(0, 0, width, height);

  // Collect all active clips at current time sorted by track priority & clip zIndex
  const activeClips: { track: Track; clip: Clip }[] = [];

  tracks.forEach((track) => {
    if (!track.visible) return;
    track.clips.forEach((clip) => {
      const isWithinTime =
        timelineTime >= clip.startInTimeline &&
        timelineTime < clip.startInTimeline + clip.duration;
      if (isWithinTime) {
        activeClips.push({ track, clip });
      }
    });
  });

  // Sort: main video -> overlays -> text -> effects
  activeClips.sort((a, b) => {
    const typeOrder = { video: 1, overlay: 2, image: 3, effect: 4, text: 5, audio: 0 };
    const orderA = typeOrder[a.clip.type as keyof typeof typeOrder] || 1;
    const orderB = typeOrder[b.clip.type as keyof typeof typeOrder] || 1;
    if (orderA !== orderB) return orderA - orderB;
    return (a.clip.transform.zIndex || 0) - (b.clip.transform.zIndex || 0);
  });

  // Render each clip
  activeClips.forEach(({ clip }) => {
    ctx.save();

    // Keyframe interpolated transforms
    const transform = getInterpolatedTransform(clip, timelineTime);
    const blurAmount = getInterpolatedProperty(clip, 'blur', timelineTime, 0);

    // Position math
    const centerX = width / 2 + (transform.x / 100) * width;
    const centerY = height / 2 + (transform.y / 100) * height;

    ctx.globalAlpha = Math.max(0, Math.min(1, transform.opacity));
    ctx.translate(centerX, centerY);
    if (transform.rotation !== 0) {
      ctx.rotate((transform.rotation * Math.PI) / 180);
    }
    ctx.scale(transform.scale, transform.scale);

    if (blurAmount > 0) {
      ctx.filter = `blur(${blurAmount}px)`;
    }

    if (clip.type === 'video') {
      renderVideoClip(
        ctx,
        offscreenCtx,
        clip,
        timelineTime,
        width,
        height,
        videoElementsMap
      );
    } else if (clip.type === 'text') {
      renderTextClip(ctx, clip, width, height);
    } else if (clip.type === 'image') {
      renderImageClip(ctx, clip, width, height, imageElementsMap);
    }

    ctx.restore();

    // Global Effect overlay if clip has effectType
    if (clip.effectType && clip.effectType !== 'none') {
      applyEffectFilter(ctx, clip.effectType, clip.effectIntensity || 0.8, width, height, timelineTime);
    }
  });
}

function renderVideoClip(
  ctx: CanvasRenderingContext2D,
  offscreenCtx: CanvasRenderingContext2D | null,
  clip: Clip,
  timelineTime: number,
  canvasWidth: number,
  canvasHeight: number,
  videoElementsMap: Map<string, HTMLVideoElement>
) {
  const video = videoElementsMap.get(clip.id);
  if (!video || video.readyState < 2) {
    // Fallback placeholder rendering when video loading
    ctx.fillStyle = '#1e2230';
    ctx.fillRect(-canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight);
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Loading: ${clip.name}`, 0, 0);
    return;
  }

  // Sync video time smoothly
  const targetSourceTime = clip.sourceStart + (timelineTime - clip.startInTimeline) * clip.speed;
  if (Math.abs(video.currentTime - targetSourceTime) > 0.15) {
    video.currentTime = targetSourceTime;
  }

  const vWidth = video.videoWidth || canvasWidth;
  const vHeight = video.videoHeight || canvasHeight;

  // Aspect fit/fill math
  const scale = Math.max(canvasWidth / vWidth, canvasHeight / vHeight);
  const drawWidth = vWidth * scale;
  const drawHeight = vHeight * scale;

  if (clip.chromaKey?.enabled && offscreenCtx) {
    // Render to offscreen buffer for green screen processing
    const offCanvas = offscreenCtx.canvas;
    offCanvas.width = canvasWidth;
    offCanvas.height = canvasHeight;

    offscreenCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    offscreenCtx.drawImage(
      video,
      (canvasWidth - drawWidth) / 2,
      (canvasHeight - drawHeight) / 2,
      drawWidth,
      drawHeight
    );

    const imgData = offscreenCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    applyChromaKey(imgData, clip.chromaKey);
    offscreenCtx.putImageData(imgData, 0, 0);

    ctx.drawImage(offCanvas, -canvasWidth / 2, -canvasHeight / 2);
  } else {
    ctx.drawImage(video, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  }
}

function renderTextClip(
  ctx: CanvasRenderingContext2D,
  clip: Clip,
  canvasWidth: number,
  canvasHeight: number
) {
  const text = clip.text || '';
  if (!text) return;

  const style: CaptionStyle = clip.captionStyle || {
    fontFamily: 'Inter, sans-serif',
    fontSize: 32,
    color: '#ffffff',
    bgColor: 'rgba(0,0,0,0.7)',
    strokeColor: '#000000',
    strokeWidth: 2,
    preset: 'viral',
    positionY: 70,
  };

  ctx.font = `bold ${style.fontSize * (canvasWidth / 800)}px ${style.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const paddingH = 24;
  const paddingV = 12;
  const rectHeight = style.fontSize * 1.4;

  // Render Background box if preset requires
  if (style.preset === 'boxed' || style.preset === 'viral' || style.preset === 'minimal') {
    ctx.fillStyle = style.bgColor;
    ctx.beginPath();
    ctx.roundRect(
      -textWidth / 2 - paddingH,
      -rectHeight / 2,
      textWidth + paddingH * 2,
      rectHeight,
      12
    );
    ctx.fill();
  }

  // Text Stroke
  if (style.strokeWidth > 0) {
    ctx.strokeStyle = style.strokeColor;
    ctx.lineWidth = style.strokeWidth * 2;
    ctx.strokeText(text, 0, 0);
  }

  // Glow if Neon
  if (style.preset === 'neon') {
    ctx.shadowColor = style.color;
    ctx.shadowBlur = 15;
  }

  // Text Fill
  ctx.fillStyle = style.color;
  ctx.fillText(text, 0, 0);

  ctx.shadowBlur = 0; // Reset
}

function renderImageClip(
  ctx: CanvasRenderingContext2D,
  clip: Clip,
  canvasWidth: number,
  canvasHeight: number,
  imageElementsMap: Map<string, HTMLImageElement>
) {
  const img = imageElementsMap.get(clip.id);
  if (!img || !img.complete) return;

  const aspect = img.width / img.height;
  const drawWidth = canvasWidth * 0.4;
  const drawHeight = drawWidth / aspect;

  ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
}

function applyEffectFilter(
  ctx: CanvasRenderingContext2D,
  type: EffectType,
  intensity: number,
  width: number,
  height: number,
  time: number
) {
  ctx.save();

  if (type === 'vhs' || type === 'glitch') {
    // VHS & Glitch RGB Split with scanlines
    ctx.globalCompositeOperation = 'screen';
    const offset = Math.sin(time * 12) * (6 * intensity);
    ctx.fillStyle = `rgba(255, 0, 100, ${0.12 * intensity})`;
    ctx.fillRect(offset, 0, width, height);

    ctx.fillStyle = `rgba(0, 255, 255, ${0.12 * intensity})`;
    ctx.fillRect(-offset, 0, width, height);

    // CRT Scanlines
    ctx.fillStyle = `rgba(0, 0, 0, ${0.08 * intensity})`;
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1.5);
    }
  } else if (type === 'film_grain') {
    // Film Grain noise
    ctx.fillStyle = `rgba(255, 255, 255, ${0.06 * intensity})`;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillRect(x, y, 2, 2);
    }
  } else if (type === 'cyberpunk') {
    ctx.globalCompositeOperation = 'color-burn';
    ctx.fillStyle = `rgba(0, 255, 200, ${0.2 * intensity})`;
    ctx.fillRect(0, 0, width, height);
  } else if (type === 'noir') {
    ctx.globalCompositeOperation = 'color';
    ctx.fillStyle = `rgba(128, 128, 128, ${0.9 * intensity})`;
    ctx.fillRect(0, 0, width, height);
  } else if (type === 'vignette') {
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.25,
      width / 2,
      height / 2,
      width * 0.75
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, `rgba(0,0,0,${0.9 * intensity})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (type === 'teal_orange') {
    ctx.globalCompositeOperation = 'overlay';
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, `rgba(0, 180, 216, ${0.25 * intensity})`);
    grad.addColorStop(1, `rgba(247, 127, 0, ${0.3 * intensity})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (type === 'light_leak') {
    ctx.globalCompositeOperation = 'screen';
    const grad = ctx.createRadialGradient(
      width * 0.9,
      height * 0.1,
      0,
      width * 0.9,
      height * 0.1,
      width * 0.6
    );
    grad.addColorStop(0, `rgba(255, 180, 80, ${0.45 * intensity})`);
    grad.addColorStop(1, 'rgba(255, 180, 80, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (type === 'bokeh') {
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(255, 255, 255, ${0.12 * intensity})`;
    const circles = [
      { x: 0.2, y: 0.3, r: 40 },
      { x: 0.7, y: 0.2, r: 65 },
      { x: 0.85, y: 0.75, r: 50 },
      { x: 0.35, y: 0.8, r: 80 },
    ];
    circles.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x * width, c.y * height, c.r * intensity, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.restore();
}
