import React, { useEffect, useRef } from 'react';
import { Track, AspectRatio } from '../types';
import { renderCanvasFrame, getDimensionsForAspectRatio } from '../utils/canvasRenderer';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface VideoCanvasPreviewProps {
  tracks: Track[];
  currentTime: number;
  setCurrentTime: (t: number) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  totalDuration: number;
  aspectRatio: AspectRatio;
  videoElementsMap: Map<string, HTMLVideoElement>;
  imageElementsMap: Map<string, HTMLImageElement>;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
}

export const VideoCanvasPreview: React.FC<VideoCanvasPreviewProps> = ({
  tracks,
  currentTime,
  setCurrentTime,
  isPlaying,
  setIsPlaying,
  totalDuration,
  aspectRatio,
  videoElementsMap,
  imageElementsMap,
  isMuted,
  setIsMuted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Offscreen Canvas
  useEffect(() => {
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
  }, []);

  // Frame Render Trigger on Time or Track changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const offscreenCtx = offscreenCanvasRef.current
      ? offscreenCanvasRef.current.getContext('2d', { willReadFrequently: true })
      : null;

    renderCanvasFrame(
      ctx,
      offscreenCtx,
      tracks,
      currentTime,
      aspectRatio,
      videoElementsMap,
      imageElementsMap
    );
  }, [tracks, currentTime, aspectRatio, videoElementsMap, imageElementsMap]);

  // Sync Audio / Video elements volume & playing state
  useEffect(() => {
    videoElementsMap.forEach((video, clipId) => {
      let clipVol = 1.0;
      tracks.forEach((t) => {
        const c = t.clips.find((clip) => clip.id === clipId);
        if (c) {
          clipVol = c.muted || t.muted || isMuted ? 0 : c.volume;
        }
      });

      video.volume = Math.max(0, Math.min(1, clipVol));

      if (isPlaying) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [isPlaying, isMuted, tracks, videoElementsMap]);

  // NLE Timecode Formatter (HH:MM:SS:FF)
  const formatTimecode = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames
      .toString()
      .padStart(2, '0')}`;
  };

  const toggleFullScreen = () => {
    if (canvasRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        canvasRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="flex-1 bg-black relative flex flex-col items-center justify-center border-b border-zinc-800 select-none overflow-hidden">
      {/* Viewport Box */}
      <div className="w-[85%] max-w-[800px] aspect-video bg-zinc-900 border border-zinc-700 shadow-2xl relative group rounded overflow-hidden flex items-center justify-center my-auto">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain cursor-crosshair"
        />

        {/* Play Overlay Button if Paused */}
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors"
          >
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
            </div>
          </button>
        )}

        {/* Floating Timecode Badge */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 items-center px-3 py-1 bg-black/70 backdrop-blur rounded-full text-white text-[10px] font-mono tracking-wider border border-zinc-700">
          <span className="text-blue-400">{formatTimecode(currentTime)}</span>
          <span className="text-zinc-500">/</span>
          <span className="text-zinc-400">{formatTimecode(totalDuration)}</span>
        </div>

        {/* Canvas Resolution Indicator */}
        <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono text-zinc-400 uppercase border border-zinc-800">
          {aspectRatio}
        </div>
      </div>
    </div>
  );
};
