import React, { useRef, useState } from 'react';
import { Track, Clip } from '../types';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Copy,
  Scissors,
  ZoomIn,
  ZoomOut,
  Diamond,
  Zap,
} from 'lucide-react';

interface TimelineProps {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  currentTime: number;
  setCurrentTime: (t: number) => void;
  totalDuration: number;
  selectedClipId: string | null;
  setSelectedClipId: (id: string | null) => void;
  onRazorCut: () => void;
  onDuplicateClip: (clipId: string) => void;
  onDeleteClip: (clipId: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  tracks,
  setTracks,
  currentTime,
  setCurrentTime,
  totalDuration,
  selectedClipId,
  setSelectedClipId,
  onRazorCut,
  onDuplicateClip,
  onDeleteClip,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(35); // pixels per second
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  // Time ruler tick marks array
  const ticksCount = Math.ceil(totalDuration);
  const tickArray = Array.from({ length: ticksCount + 1 }, (_, i) => i);

  // Handle timeline ruler scrub click/drag
  const handleTimelineScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const calculatedTime = Math.max(0, Math.min(totalDuration, clickX / zoomLevel));
    setCurrentTime(calculatedTime);
  };

  const handleMouseDownScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    handleTimelineScrub(e);
  };

  const handleMouseMoveScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isScrubbing) {
      handleTimelineScrub(e);
    }
  };

  const handleMouseUpScrub = () => {
    setIsScrubbing(false);
  };

  // Toggle Track Locks / Mutes / Visibility
  const toggleTrackMute = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
    );
  };

  const toggleTrackVisibility = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, visible: !t.visible } : t))
    );
  };

  const toggleTrackLock = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, locked: !t.locked } : t))
    );
  };

  // Dragging clips along timeline
  const [draggingClip, setDraggingClip] = useState<{
    clipId: string;
    trackId: string;
    startX: number;
    initialStartInTimeline: number;
  } | null>(null);

  const handleClipMouseDown = (
    e: React.MouseEvent,
    clip: Clip,
    track: Track
  ) => {
    if (track.locked) return;
    e.stopPropagation();
    setSelectedClipId(clip.id);
    setDraggingClip({
      clipId: clip.id,
      trackId: track.id,
      startX: e.clientX,
      initialStartInTimeline: clip.startInTimeline,
    });
  };

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (draggingClip) {
      const deltaX = e.clientX - draggingClip.startX;
      const deltaTime = deltaX / zoomLevel;
      const newStart = Math.max(0, draggingClip.initialStartInTimeline + deltaTime);

      setTracks((prev) =>
        prev.map((t) => {
          if (t.id !== draggingClip.trackId) return t;
          return {
            ...t,
            clips: t.clips.map((c) =>
              c.id === draggingClip.clipId
                ? { ...c, startInTimeline: Math.round(newStart * 100) / 100 }
                : c
            ),
          };
        })
      );
    }
  };

  const handleGlobalMouseUp = () => {
    setDraggingClip(null);
  };

  // Track Clip Color Styling
  const getClipStyle = (type: string, isSelected: boolean) => {
    switch (type) {
      case 'video':
        return isSelected
          ? 'bg-blue-600/90 border-blue-400 text-white ring-2 ring-blue-400'
          : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-zinc-500';
      case 'overlay':
        return isSelected
          ? 'bg-purple-600/90 border-purple-400 text-white ring-2 ring-purple-400'
          : 'bg-purple-600/40 border-purple-500/50 text-purple-200 italic hover:border-purple-400';
      case 'text':
        return isSelected
          ? 'bg-blue-600/90 border-blue-400 text-white ring-2 ring-blue-400'
          : 'bg-blue-900/30 border-blue-500/40 text-blue-300 hover:border-blue-400';
      case 'audio':
        return isSelected
          ? 'bg-emerald-600/90 border-emerald-400 text-white ring-2 ring-emerald-400'
          : 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300 hover:border-emerald-400';
      default:
        return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    }
  };

  return (
    <div
      className="h-56 bg-zinc-900 flex flex-col select-none relative z-10 shrink-0 border-t border-zinc-800"
      onMouseMove={(e) => {
        handleMouseMoveScrub(e);
        handleGlobalMouseMove(e);
      }}
      onMouseUp={() => {
        handleMouseUpScrub();
        handleGlobalMouseUp();
      }}
    >
      {/* Timeline Controls Transport Bar */}
      <div className="h-8 border-b border-zinc-800 flex items-center px-4 space-x-4 bg-zinc-900/90 text-xs shrink-0 justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentTime(0)}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              title="First Frame"
            >
              ⏪
            </button>
            <button
              onClick={onRazorCut}
              className="px-2 py-0.5 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded border border-zinc-700 flex items-center space-x-1"
            >
              <Scissors className="w-3 h-3" />
              <span>Split (S)</span>
            </button>
            <button
              onClick={() => setCurrentTime(totalDuration)}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              title="End Frame"
            >
              ⏩
            </button>
          </div>

          {selectedClipId && (
            <div className="flex items-center space-x-1 border-l border-zinc-800 pl-3">
              <button
                onClick={() => onDuplicateClip(selectedClipId)}
                className="px-2 py-0.5 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-blue-400 rounded border border-zinc-700 flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => onDeleteClip(selectedClipId)}
                className="px-2 py-0.5 text-[10px] bg-rose-950/80 hover:bg-rose-900 text-rose-400 rounded border border-rose-800/60 flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center space-x-2 text-[10px] text-zinc-400">
          <ZoomOut className="w-3 h-3" />
          <input
            type="range"
            min="10"
            max="100"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-20 accent-blue-500 cursor-pointer h-1 bg-zinc-800 rounded"
          />
          <ZoomIn className="w-3 h-3" />
          <span className="font-mono text-zinc-300">{zoomLevel}px/s</span>
        </div>
      </div>

      {/* Track Lanes & Scroll Container */}
      <div className="flex-1 flex overflow-hidden relative bg-zinc-950">
        {/* Left Track Headers */}
        <div className="w-28 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 text-[9px] font-bold text-zinc-500 uppercase tracking-wider divide-y divide-zinc-800/80">
          <div className="h-6 bg-zinc-950 px-2 flex items-center">Track List</div>
          {tracks.map((track) => (
            <div
              key={track.id}
              className="h-10 px-2 flex items-center justify-between text-zinc-400 bg-zinc-900/60"
            >
              <span className="truncate pr-1 font-mono text-[9px] font-bold">
                {track.name}
              </span>
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => toggleTrackVisibility(track.id)}
                  className={`hover:text-white ${
                    track.visible ? 'text-zinc-500' : 'text-rose-400'
                  }`}
                >
                  {track.visible ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={() => toggleTrackMute(track.id)}
                  className={`hover:text-white ${
                    track.muted ? 'text-rose-400' : 'text-zinc-500'
                  }`}
                >
                  {track.muted ? (
                    <VolumeX className="w-3 h-3" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Ruler & Timeline Clips */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden relative bg-zinc-950 flex flex-col">
          {/* Time Ruler */}
          <div
            ref={timelineRef}
            onMouseDown={handleMouseDownScrub}
            className="h-6 bg-zinc-950 border-b border-zinc-800 relative cursor-pointer select-none shrink-0"
            style={{ width: `${Math.max(800, totalDuration * zoomLevel)}px` }}
          >
            {tickArray.map((sec) => (
              <div
                key={sec}
                className="absolute top-0 bottom-0 border-l border-zinc-800 flex flex-col justify-between pl-1 text-[8px] font-mono text-zinc-500 pointer-events-none"
                style={{ left: `${sec * zoomLevel}px` }}
              >
                <span>{sec}s</span>
              </div>
            ))}

            {/* Glowing Blue Playhead Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-30 pointer-events-none shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              style={{ left: `${currentTime * zoomLevel}px` }}
            >
              <div className="w-2.5 h-2.5 bg-blue-500 -ml-1 rotate-45 transform -translate-y-1 shadow-md" />
            </div>
          </div>

          {/* Track Lanes */}
          <div
            className="flex-1 relative overflow-y-auto"
            style={{ width: `${Math.max(800, totalDuration * zoomLevel)}px` }}
          >
            {/* Global Playhead Scrub Line in Clips Area */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20 pointer-events-none shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              style={{ left: `${currentTime * zoomLevel}px` }}
            />

            {tracks.map((track) => (
              <div
                key={track.id}
                className="h-10 border-b border-zinc-900/90 relative bg-zinc-950/60"
              >
                {track.clips.map((clip) => {
                  const isSelected = selectedClipId === clip.id;
                  const clipWidth = Math.max(20, clip.duration * zoomLevel);
                  const clipLeft = clip.startInTimeline * zoomLevel;

                  return (
                    <div
                      key={clip.id}
                      onMouseDown={(e) => handleClipMouseDown(e, clip, track)}
                      className={`absolute top-1 bottom-1 rounded border px-2 flex items-center justify-between text-[10px] font-medium cursor-grab active:cursor-grabbing overflow-hidden shadow-sm transition-all ${getClipStyle(
                        clip.type,
                        isSelected
                      )}`}
                      style={{
                        left: `${clipLeft}px`,
                        width: `${clipWidth}px`,
                      }}
                    >
                      <span className="truncate font-sans font-semibold drop-shadow-sm">
                        {clip.name}
                      </span>

                      {/* Speed badge */}
                      {clip.speed !== 1 && (
                        <span className="text-[8px] font-mono font-bold bg-black/60 text-orange-400 px-1 rounded ml-1">
                          {clip.speed}x
                        </span>
                      )}

                      {/* Keyframe Badge */}
                      {clip.keyframes && Object.keys(clip.keyframes).length > 0 && (
                        <Diamond className="w-2.5 h-2.5 text-blue-400 fill-current ml-1 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
