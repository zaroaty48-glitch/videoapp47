import React from 'react';
import { Clip, KeyframeProperty, KeyframePoint } from '../types';
import { Diamond, Plus, Trash2, Sliders, Play } from 'lucide-react';

interface KeyframeEditorPanelProps {
  selectedClip: Clip | null;
  currentTime: number;
  onUpdateClipKeyframes: (
    property: KeyframeProperty,
    time: number,
    value: number
  ) => void;
  onDeleteKeyframe: (property: KeyframeProperty, keyframeId: string) => void;
  onJumpToTime: (t: number) => void;
}

export const KeyframeEditorPanel: React.FC<KeyframeEditorPanelProps> = ({
  selectedClip,
  currentTime,
  onUpdateClipKeyframes,
  onDeleteKeyframe,
  onJumpToTime,
}) => {
  if (!selectedClip) {
    return (
      <div className="p-6 text-center text-zinc-500 text-xs">
        <Diamond className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
        <p>Select a clip on the timeline to add keyframe animation markers.</p>
      </div>
    );
  }

  // Relative clip time in seconds
  const relativeClipTime = Math.max(
    0,
    (currentTime - selectedClip.startInTimeline) * selectedClip.speed
  );

  const properties: { name: string; key: KeyframeProperty; defaultVal: number; min: number; max: number; step: number }[] = [
    { name: 'Position X (%)', key: 'positionX', defaultVal: selectedClip.transform.x, min: -100, max: 100, step: 1 },
    { name: 'Position Y (%)', key: 'positionY', defaultVal: selectedClip.transform.y, min: -100, max: 100, step: 1 },
    { name: 'Scale Factor', key: 'scale', defaultVal: selectedClip.transform.scale, min: 0.1, max: 3.0, step: 0.05 },
    { name: 'Opacity', key: 'opacity', defaultVal: selectedClip.transform.opacity, min: 0, max: 1.0, step: 0.05 },
    { name: 'Rotation (deg)', key: 'rotation', defaultVal: selectedClip.transform.rotation, min: -180, max: 180, step: 1 },
    { name: 'Blur (px)', key: 'blur', defaultVal: 0, min: 0, max: 20, step: 1 },
  ];

  return (
    <div className="p-3 space-y-3 text-zinc-200">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded">
            <Diamond className="w-4 h-4 fill-blue-400/20" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white">Keyframe Motion</h3>
            <p className="text-[10px] font-mono text-zinc-500">
              Clip Time: {relativeClipTime.toFixed(2)}s
            </p>
          </div>
        </div>
      </div>

      {/* Property Keyframe Controls */}
      <div className="space-y-2">
        {properties.map((prop) => {
          const keyframesList = selectedClip.keyframes?.[prop.key] || [];
          const existingKf = keyframesList.find(
            (k) => Math.abs(k.time - relativeClipTime) < 0.1
          );

          return (
            <div key={prop.key} className="bg-zinc-950 p-2 rounded border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium">
                <span className="text-zinc-300">{prop.name}</span>
                <button
                  onClick={() =>
                    onUpdateClipKeyframes(
                      prop.key,
                      relativeClipTime,
                      existingKf ? existingKf.value : prop.defaultVal
                    )
                  }
                  className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                    existingKf
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-blue-300'
                  }`}
                >
                  <Diamond className="w-2.5 h-2.5 fill-current" />
                  <span>{existingKf ? 'Update' : '+ Keyframe'}</span>
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={prop.min}
                max={prop.max}
                step={prop.step}
                value={existingKf ? existingKf.value : prop.defaultVal}
                onChange={(e) =>
                  onUpdateClipKeyframes(
                    prop.key,
                    relativeClipTime,
                    parseFloat(e.target.value)
                  )
                }
                className="w-full accent-blue-500 bg-zinc-800 h-1 rounded cursor-pointer"
              />

              {/* Keyframe Points List */}
              {keyframesList.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {keyframesList.map((kf) => (
                    <div
                      key={kf.id}
                      className="flex items-center space-x-1 bg-zinc-800 px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-300 border border-zinc-700"
                    >
                      <button
                        onClick={() =>
                          onJumpToTime(selectedClip.startInTimeline + kf.time / selectedClip.speed)
                        }
                        className="hover:text-blue-300 font-bold"
                        title="Jump to keyframe timestamp"
                      >
                        {kf.time.toFixed(1)}s: {kf.value.toFixed(1)}
                      </button>
                      <button
                        onClick={() => onDeleteKeyframe(prop.key, kf.id)}
                        className="hover:text-rose-400 ml-1"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
