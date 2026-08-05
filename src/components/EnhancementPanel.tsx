import React from 'react';
import {
  Sparkles,
  Sliders,
  Zap,
  Eye,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { VideoEnhancements, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface EnhancementPanelProps {
  language: Language;
  enhancements: VideoEnhancements;
  onUpdateEnhancements: (updated: VideoEnhancements) => void;
}

export const EnhancementPanel: React.FC<EnhancementPanelProps> = ({
  language,
  enhancements,
  onUpdateEnhancements,
}) => {
  const t = getTranslation(language);
  const isRtl = language === 'ar';

  const filterPresets: { id: VideoEnhancements['filterPreset']; name: string; color: string }[] = [
    { id: 'none', name: t.filters.none, color: '#52525b' },
    { id: 'cinematic', name: t.filters.cinematic, color: '#3b82f6' },
    { id: 'vibrant', name: t.filters.vibrant, color: '#ec4899' },
    { id: 'warm_golden', name: t.filters.warm_golden, color: '#f59e0b' },
    { id: 'portrait_glow', name: t.filters.portrait_glow, color: '#10b981' },
    { id: 'vintage_film', name: t.filters.vintage_film, color: '#8b5cf6' },
    { id: 'cyber_neon', name: t.filters.cyber_neon, color: '#06b6d4' },
    { id: 'monochrome', name: t.filters.monochrome, color: '#71717a' },
  ];

  return (
    <div
      className={`p-4 space-y-5 text-zinc-200 select-none ${isRtl ? 'rtl' : 'ltr'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header Badge */}
      <div className="flex items-center space-x-2.5 rtl:space-x-reverse pb-3 border-b border-zinc-800">
        <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-600 text-white rounded-xl shadow-md">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">{t.aiEnhancementsTitle}</h3>
          <p className="text-[11px] text-purple-300">
            {language === 'ar'
              ? 'معالجة الإطارات بالذكاء الاصطناعي وتنعيم الحركة 120 FPS'
              : 'AI Frame Processing & 120 FPS Motion Interpolation'}
          </p>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="space-y-4">
        {/* 1. Sharpness Control */}
        <div className="space-y-1.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.sharpness}</span>
            </span>
            <span className="font-mono text-blue-400 font-bold">{enhancements.sharpness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={enhancements.sharpness}
            onChange={(e) =>
              onUpdateEnhancements({ ...enhancements, sharpness: parseInt(e.target.value) })
            }
            className="w-full accent-blue-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* 2. Skin & Edge Smoothing */}
        <div className="space-y-1.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.smoothing}</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">{enhancements.smoothing}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={enhancements.smoothing}
            onChange={(e) =>
              onUpdateEnhancements({ ...enhancements, smoothing: parseInt(e.target.value) })
            }
            className="w-full accent-emerald-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* 3. Noise Reduction */}
        <div className="space-y-1.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.noiseReduction}</span>
            </span>
            <span className="font-mono text-purple-400 font-bold">{enhancements.noiseReduction}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={enhancements.noiseReduction}
            onChange={(e) =>
              onUpdateEnhancements({ ...enhancements, noiseReduction: parseInt(e.target.value) })
            }
            className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* 4. Clarity Enhancement */}
        <div className="space-y-1.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.clarity}</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">{enhancements.clarity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={enhancements.clarity}
            onChange={(e) =>
              onUpdateEnhancements({ ...enhancements, clarity: parseInt(e.target.value) })
            }
            className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Toggle Switches for Super Res, Flicker, Frame Interpolation */}
        <div className="space-y-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
          {/* Super Resolution AI (4K/8K) */}
          <div className="flex items-center justify-between py-1 border-b border-zinc-900">
            <div>
              <div className="text-xs font-bold text-white">{t.superResolution}</div>
              <div className="text-[10px] text-zinc-400">
                {language === 'ar' ? 'رفع الدقة ذكياً بالذكاء الاصطناعي' : 'AI Upscaling 2x/4x'}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enhancements.superResolution}
                onChange={(e) =>
                  onUpdateEnhancements({ ...enhancements, superResolution: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Flicker Reduction */}
          <div className="flex items-center justify-between py-1 border-b border-zinc-900">
            <div>
              <div className="text-xs font-bold text-white">{t.flickerReduction}</div>
              <div className="text-[10px] text-zinc-400">
                {language === 'ar' ? 'معالجة إضاءة الإطارات والطرف' : 'Anti-Strobe frame balancing'}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enhancements.flickerReduction}
                onChange={(e) =>
                  onUpdateEnhancements({ ...enhancements, flickerReduction: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Frame Interpolation (60->120 FPS) */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{t.frameInterpolation}</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 rounded border border-emerald-800 font-mono">
                  120 FPS
                </span>
              </div>
              <div className="text-[10px] text-zinc-400">
                {language === 'ar'
                  ? 'توليد إطارات وهمية لتنعم حركة الفيديو'
                  : 'Optical Flow Motion Smoothing'}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enhancements.frameInterpolation}
                onChange={(e) =>
                  onUpdateEnhancements({
                    ...enhancements,
                    frameInterpolation: e.target.checked,
                    targetFps: e.target.checked ? 120 : 60,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Filter Presets Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-zinc-400 block">
            {t.filterPresets}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {filterPresets.map((filt) => (
              <button
                key={filt.id}
                onClick={() =>
                  onUpdateEnhancements({ ...enhancements, filterPreset: filt.id })
                }
                className={`px-2.5 py-2 rounded-lg border text-xs font-semibold flex items-center space-x-2 rtl:space-x-reverse transition-all ${
                  enhancements.filterPreset === filt.id
                    ? 'border-blue-500 bg-blue-900/30 text-white shadow-sm'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: filt.color }}
                />
                <span className="truncate">{filt.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
