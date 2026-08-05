import React, { useState, useEffect } from 'react';
import { Clip, EffectType, TransitionType } from '../types';
import { EFFECTS_LIBRARY, VisualEffect } from '../data/effectsLibrary';
import {
  Sparkles,
  Search,
  Star,
  Film,
  Eye,
  Sliders,
  Check,
  Zap,
  Layers,
  Gauge,
  Info,
} from 'lucide-react';

interface EffectsPacksPanelProps {
  selectedClip: Clip | null;
  onUpdateEffect: (type: EffectType, intensity: number) => void;
  onUpdateTransition: (type: TransitionType) => void;
  onUpdateSpeed?: (speed: number) => void;
  language?: 'ar' | 'en';
}

export const EffectsPacksPanel: React.FC<EffectsPacksPanelProps> = ({
  selectedClip,
  onUpdateEffect,
  onUpdateTransition,
  onUpdateSpeed,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const [selectedPack, setSelectedPack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('clipcraft_effect_favorites');
      return saved ? JSON.parse(saved) : ['teal_orange_grade', 'vhs_glitch_crt', 'portrait_glow'];
    } catch {
      return ['teal_orange_grade', 'vhs_glitch_crt', 'portrait_glow'];
    }
  });

  const [previewFx, setPreviewFx] = useState<VisualEffect | null>(null);
  const [intensity, setIntensity] = useState<number>(0.8);

  // Sync intensity with selected clip
  useEffect(() => {
    if (selectedClip) {
      setIntensity(selectedClip.effectIntensity ?? 0.8);
      const matched = EFFECTS_LIBRARY.find((e) => e.id === selectedClip.effectType);
      if (matched) setPreviewFx(matched);
    }
  }, [selectedClip]);

  const toggleFavorite = (effectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(effectId)
      ? favorites.filter((id) => id !== effectId)
      : [...favorites, effectId];
    setFavorites(updated);
    try {
      localStorage.setItem('clipcraft_effect_favorites', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Effects
  const filteredEffects = EFFECTS_LIBRARY.filter((fx) => {
    const matchesCategory =
      selectedPack === 'all'
        ? true
        : selectedPack === 'favorites'
        ? favorites.includes(fx.id)
        : fx.category === selectedPack;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      fx.nameAr.toLowerCase().includes(query) ||
      fx.nameEn.toLowerCase().includes(query) ||
      fx.descriptionAr.toLowerCase().includes(query) ||
      fx.descriptionEn.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleApplyEffect = (fx: VisualEffect) => {
    setPreviewFx(fx);

    // Map Effect Library ID to EffectType
    let targetType: EffectType = 'none';
    if (fx.id.includes('vhs') || fx.id.includes('glitch') || fx.id.includes('laser')) {
      targetType = 'glitch';
    } else if (fx.id.includes('teal_orange')) {
      targetType = 'teal_orange';
    } else if (fx.id.includes('cyber')) {
      targetType = 'cyberpunk';
    } else if (fx.id.includes('noir')) {
      targetType = 'noir';
    } else if (fx.id.includes('vignette')) {
      targetType = 'vignette';
    } else if (fx.id.includes('vintage') || fx.id.includes('35mm')) {
      targetType = 'film_grain';
    } else if (fx.id.includes('glow') || fx.id.includes('portrait')) {
      targetType = 'bokeh';
    } else if (fx.id.includes('blur') || fx.id.includes('smooth')) {
      targetType = 'blur';
    }

    onUpdateEffect(targetType, intensity);

    // Handle Slow Mo parameter
    if (fx.parameters.speedMultiplier && onUpdateSpeed) {
      onUpdateSpeed(fx.parameters.speedMultiplier);
    }

    // Handle Transition parameter
    if (fx.parameters.transitionType) {
      onUpdateTransition(fx.parameters.transitionType as TransitionType);
    }
  };

  if (!selectedClip) {
    return (
      <div className="p-6 text-center text-zinc-500 text-xs space-y-3">
        <Sparkles className="w-8 h-8 text-blue-500 mx-auto opacity-60" />
        <p>
          {isAr
            ? 'يرجى تحديد مقطع فيديو من الخط الزمني لتطبيق التأثيرات البصرية والحزم الجاهزة.'
            : 'Select a video clip on the timeline to apply visual effects packs or transitions.'}
        </p>
      </div>
    );
  }

  const packs = [
    { id: 'all', label: isAr ? 'جميع الحزم' : 'All Packs' },
    { id: 'favorites', label: isAr ? 'المفضلة ⭐' : 'Favorites ⭐' },
    { id: 'cinematic', label: isAr ? 'سينمائي' : 'Cinematic' },
    { id: 'social_media', label: isAr ? 'تواصل اجتماعي' : 'Social Media' },
    { id: 'neon', label: isAr ? 'نيون وجلتش' : 'Neon & Cyber' },
    { id: 'clean_enhancement', label: isAr ? 'تحسين نقي' : 'Clean Enhancement' },
    { id: 'slow_motion', label: isAr ? 'حركة بطيئة' : 'Slow Mo' },
    { id: 'transitions', label: isAr ? 'انتقالات' : 'Transitions' },
  ];

  return (
    <div className="p-3 space-y-3 text-zinc-200 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white">
              {isAr ? 'حزم التأثيرات البصرية' : 'Visual Effects Packs'}
            </h3>
            <p className="text-[10px] text-zinc-400">
              {isAr ? 'فلاتر، حركة بطيئة وانتقالات سينمائية' : 'Filters, Slow Motion & Transitions'}
            </p>
          </div>
        </div>
      </div>

      {/* Live Interactive Preview Box */}
      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-blue-400" />
            {isAr ? 'معاينة التأثير المحدد' : 'Live Effect Preview'}
          </span>
          {previewFx && (
            <span className="text-blue-400 font-mono">
              {isAr ? previewFx.nameAr : previewFx.nameEn}
            </span>
          )}
        </div>

        {/* Live Canvas / Gradient Thumbnail Preview */}
        <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center group shadow-inner">
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: previewFx
                ? previewFx.previewBg
                : 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
              filter: `contrast(${100 + (previewFx?.parameters.contrast || 0)}%) brightness(${
                100 + (previewFx?.parameters.brightness || 0)
              }%)`,
              opacity: intensity,
            }}
          />

          {/* Vignette Overlay Simulation */}
          {previewFx?.parameters.vignette && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${
                  (previewFx.parameters.vignette / 100) * intensity
                }) 100%)`,
              }}
            />
          )}

          <div className="relative z-10 text-center space-y-1 p-2 bg-black/50 backdrop-blur rounded-lg border border-white/10">
            <span className="text-2xl">{previewFx ? previewFx.icon : '✨'}</span>
            <div className="text-xs font-bold text-white">
              {previewFx ? (isAr ? previewFx.nameAr : previewFx.nameEn) : isAr ? 'اختر تأثيراً' : 'Select Effect'}
            </div>
            <div className="text-[9px] text-zinc-300 max-w-[200px] truncate">
              {previewFx ? (isAr ? previewFx.descriptionAr : previewFx.descriptionEn) : ''}
            </div>
          </div>
        </div>

        {/* Intensity Adjustment Slider */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400">{isAr ? 'قوة التأثير (Intensity)' : 'Filter Intensity'}</span>
            <span className="font-mono text-blue-400 font-bold">{Math.round(intensity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={intensity}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setIntensity(val);
              if (previewFx) handleApplyEffect(previewFx);
            }}
            className="w-full accent-blue-500 bg-zinc-800 h-1 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Category Pack Tabs */}
      <div className="flex space-x-1.5 rtl:space-x-reverse overflow-x-auto pb-1 scrollbar-none">
        {packs.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPack(p.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
              selectedPack === p.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? 'بحث في قائمة التأثيرات...' : 'Search effects library...'}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 rtl:pl-2 rtl:pr-8 pr-2 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Effects Grid List */}
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {filteredEffects.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-xs">
            {isAr ? 'لا توجد تأثيرات مطابقة للبحث' : 'No effects found matching criteria.'}
          </div>
        ) : (
          filteredEffects.map((fx) => {
            const isFav = favorites.includes(fx.id);
            const isSelected = previewFx?.id === fx.id;

            return (
              <div
                key={fx.id}
                onClick={() => handleApplyEffect(fx)}
                className={`p-2 rounded-lg border text-left rtl:text-right transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center text-base shrink-0 shadow-sm border border-white/10"
                    style={{ background: fx.previewBg }}
                  >
                    {fx.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {isAr ? fx.nameAr : fx.nameEn}
                    </div>
                    <div className="text-[9px] text-zinc-400 truncate">
                      {isAr ? fx.descriptionAr : fx.descriptionEn}
                    </div>
                  </div>
                </div>

                {/* Favorite Toggle Star */}
                <button
                  onClick={(e) => toggleFavorite(fx.id, e)}
                  className={`p-1.5 rounded hover:bg-zinc-800 transition-colors ${
                    isFav ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'
                  }`}
                  title={isAr ? 'إضافة للمفضلة' : 'Favorite'}
                >
                  <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Transition Selector Quick Dock */}
      <div className="pt-2 border-t border-zinc-800 space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-zinc-400 block">
          {isAr ? 'انتقال بداية المقطع (Transition In)' : 'Transition In Effect'}
        </label>
        <select
          value={selectedClip.transitionIn || 'none'}
          onChange={(e) => onUpdateTransition(e.target.value as TransitionType)}
          className="w-full bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 p-2 rounded-lg outline-none cursor-pointer focus:border-blue-500"
        >
          <option value="none">{isAr ? 'بدون (Cut)' : 'None (Cut)'}</option>
          <option value="fade">{isAr ? 'تلاشي (Fade In)' : 'Fade In'}</option>
          <option value="cross_dissolve">{isAr ? 'تداخل تدريجي (Cross Dissolve)' : 'Cross Dissolve'}</option>
          <option value="zoom_punch">{isAr ? 'زوم حماسي (Zoom Punch)' : 'Zoom Punch'}</option>
          <option value="glitch_flash">{isAr ? 'وميض جلتش (Glitch Flash)' : 'Glitch Flash'}</option>
        </select>
      </div>
    </div>
  );
};
