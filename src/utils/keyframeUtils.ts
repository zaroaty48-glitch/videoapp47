import { KeyframeMap, KeyframeProperty, ClipTransform, Clip } from '../types';

/**
 * Calculates interpolated property value for a clip at relative time `clipTime` (seconds).
 */
export function interpolateKeyframeValue(
  keyframes: KeyframeMap | undefined,
  property: KeyframeProperty,
  clipTime: number,
  defaultValue: number
): number {
  if (!keyframes || !keyframes[property] || keyframes[property]!.length === 0) {
    return defaultValue;
  }

  const points = [...keyframes[property]!].sort((a, b) => a.time - b.time);

  // If time is before first keyframe
  if (clipTime <= points[0].time) {
    return points[0].value;
  }

  // If time is after last keyframe
  if (clipTime >= points[points.length - 1].time) {
    return points[points.length - 1].value;
  }

  // Find surrounding keyframe interval
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    if (clipTime >= p1.time && clipTime <= p2.time) {
      const progress = (clipTime - p1.time) / (p2.time - p1.time);
      // Smooth cubic step interpolation
      const smoothProgress = progress * progress * (3 - 2 * progress);
      return p1.value + (p2.value - p1.value) * smoothProgress;
    }
  }

  return defaultValue;
}

/**
 * Computes active transform values for a clip at given timeline timestamp `t`.
 */
export function getInterpolatedTransform(clip: Clip, timelineTime: number): ClipTransform {
  const clipTime = Math.max(0, (timelineTime - clip.startInTimeline) * clip.speed);
  const base = clip.transform;
  const kf = clip.keyframes;

  return {
    x: interpolateKeyframeValue(kf, 'positionX', clipTime, base.x),
    y: interpolateKeyframeValue(kf, 'positionY', clipTime, base.y),
    scale: interpolateKeyframeValue(kf, 'scale', clipTime, base.scale),
    rotation: interpolateKeyframeValue(kf, 'rotation', clipTime, base.rotation),
    opacity: interpolateKeyframeValue(kf, 'opacity', clipTime, base.opacity),
    zIndex: base.zIndex,
  };
}

/**
 * Computes interpolated blur or volume.
 */
export function getInterpolatedProperty(
  clip: Clip,
  property: 'blur' | 'volume',
  timelineTime: number,
  defaultValue: number
): number {
  const clipTime = Math.max(0, (timelineTime - clip.startInTimeline) * clip.speed);
  return interpolateKeyframeValue(clip.keyframes, property, clipTime, defaultValue);
}
