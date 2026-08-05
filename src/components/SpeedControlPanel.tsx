import React from 'react';
import { Clip } from '../types';
import { Zap, Gauge, Play } from 'lucide-react';

interface SpeedControlPanelProps {
  selectedClip: Clip | null;
  onUpdateSpeed: (speed: number) => void;
}

export const SpeedControlPanel: React.FC<SpeedControlPanelProps> = ({
  selectedClip,
  onUpdateSpeed,
}) => {
  if (!selectedClip) {
    return (
      <div className="p-6 text-center text-slate-400 text-sm">
        <Gauge className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-50" />
        <p>Select a clip on the timeline to adjust speed or apply speed ramping.</p>
      </div>
    );
  }

  const speedMultipliers = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0];

  return (
    <div className="p-4 space-y-5 text-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Speed Control</h3>
            <p className="text-[11px] text-slate-400">
              Current Speed: {selectedClip.speed}x
            </p>
          </div>
        </div>
      </div>

      {/* Speed Multipliers Grid */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 block">
          Playback Speed Multiplier
        </label>
        <div className="grid grid-cols-3 gap-2">
          {speedMultipliers.map((spd) => (
            <button
              key={spd}
              onClick={() => onUpdateSpeed(spd)}
              className={`py-2 px-3 rounded-lg border font-mono font-bold text-xs transition-all ${
                selectedClip.speed === spd
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Speed Slider */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">Custom Speed Slider</span>
          <span className="text-cyan-400 font-mono">{selectedClip.speed.toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min="0.25"
          max="4.0"
          step="0.05"
          value={selectedClip.speed}
          onChange={(e) => onUpdateSpeed(parseFloat(e.target.value))}
          className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
        />
      </div>

      {/* Speed Ramping Presets */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-400 block">
          Speed Ramping Presets
        </label>
        <div className="space-y-2">
          <button
            onClick={() => onUpdateSpeed(0.5)}
            className="w-full p-2.5 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 text-left flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-white">Cinematic Slow-Mo</div>
              <div className="text-[10px] text-slate-400">0.5x pitch-preserved smooth slow motion</div>
            </div>
            <Zap className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={() => onUpdateSpeed(2.0)}
            className="w-full p-2.5 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 text-left flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-white">Hyper Fast Forward</div>
              <div className="text-[10px] text-slate-400">2.0x energetic timelapse speed</div>
            </div>
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
