import React from 'react';
import { Clip, ChromaKeySettings } from '../types';
import { Wand2, Sliders, CheckCircle2 } from 'lucide-react';

interface ChromaKeyPanelProps {
  selectedClip: Clip | null;
  onUpdateChromaKey: (settings: ChromaKeySettings) => void;
}

export const ChromaKeyPanel: React.FC<ChromaKeyPanelProps> = ({
  selectedClip,
  onUpdateChromaKey,
}) => {
  if (!selectedClip) {
    return (
      <div className="p-6 text-center text-zinc-500 text-xs">
        <Wand2 className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
        <p>Select a video clip on the timeline to configure Chroma Key green screen removal.</p>
      </div>
    );
  }

  const chroma = selectedClip.chromaKey || {
    enabled: false,
    color: '#00ff00',
    distance: 0.35,
    smoothness: 0.1,
    spill: 0.2,
  };

  const presetColors = [
    { name: 'Green Screen', hex: '#00ff00' },
    { name: 'Blue Screen', hex: '#0000ff' },
    { name: 'Bright Magenta', hex: '#ff00ff' },
  ];

  return (
    <div className="p-3 space-y-4 text-zinc-200">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white">Chroma Key Engine</h3>
            <p className="text-[10px] text-zinc-500">Real-time Green Screen Removal</p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={chroma.enabled}
            onChange={(e) => onUpdateChromaKey({ ...chroma, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>

      {chroma.enabled ? (
        <div className="space-y-3">
          {/* Preset Color Selection */}
          <div>
            <label className="text-[10px] font-bold uppercase text-zinc-500 mb-1.5 block">
              Key Target Color
            </label>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {presetColors.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => onUpdateChromaKey({ ...chroma, color: col.hex })}
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded border text-[10px] font-medium transition-all ${
                    chroma.color.toLowerCase() === col.hex
                      ? 'border-emerald-500 bg-emerald-900/30 text-emerald-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="truncate">{col.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded border border-zinc-800">
              <input
                type="color"
                value={chroma.color}
                onChange={(e) => onUpdateChromaKey({ ...chroma, color: e.target.value })}
                className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
              />
              <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase">
                {chroma.color}
              </span>
            </div>
          </div>

          {/* Tolerance Distance Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-zinc-300">Tolerance Threshold</span>
              <span className="text-emerald-400 font-mono">
                {Math.round(chroma.distance * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.01"
              value={chroma.distance}
              onChange={(e) =>
                onUpdateChromaKey({ ...chroma, distance: parseFloat(e.target.value) })
              }
              className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded cursor-pointer"
            />
          </div>

          {/* Edge Smoothness Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-zinc-300">Edge Softness</span>
              <span className="text-emerald-400 font-mono">
                {Math.round(chroma.smoothness * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={chroma.smoothness}
              onChange={(e) =>
                onUpdateChromaKey({ ...chroma, smoothness: parseFloat(e.target.value) })
              }
              className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded cursor-pointer"
            />
          </div>

          {/* Spill Removal Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-zinc-300">Spill Suppression</span>
              <span className="text-emerald-400 font-mono">
                {Math.round(chroma.spill * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={chroma.spill}
              onChange={(e) =>
                onUpdateChromaKey({ ...chroma, spill: parseFloat(e.target.value) })
              }
              className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-center text-xs text-zinc-500">
          Enable Chroma Key to composite green screen clips transparently.
        </div>
      )}
    </div>
  );
};
