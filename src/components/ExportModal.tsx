import React, { useState, useEffect } from 'react';
import {
  Download,
  CheckCircle2,
  Sparkles,
  Zap,
  Film,
  HardDrive,
  Cpu,
  Smartphone,
  AlertTriangle,
  X,
} from 'lucide-react';
import {
  ExportSettings,
  ExportResolution,
  ExportFps,
  BitrateMode,
  DeviceCapabilities,
  Language,
} from '../types';
import { getTranslation } from '../utils/translations';

interface ExportModalProps {
  language: Language;
  onClose: () => void;
  deviceCapabilities: DeviceCapabilities;
  onStartExport: (settings: ExportSettings) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  language,
  onClose,
  deviceCapabilities,
  onStartExport,
}) => {
  const t = getTranslation(language);
  const isRtl = language === 'ar';

  const [resolution, setResolution] = useState<ExportResolution>('4K');
  const [fps, setFps] = useState<ExportFps>(60);
  const [bitrateMode, setBitrateMode] = useState<BitrateMode>('high');
  const [customBitrate, setCustomBitrate] = useState<number>(45);
  const [useHardwareAccel, setUseHardwareAccel] = useState<boolean>(true);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderFrame, setRenderFrame] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Dynamic calculation of estimated file size
  const calculateEstimatedMb = () => {
    let mbps = 25;
    if (bitrateMode === 'low') mbps = 12;
    if (bitrateMode === 'medium') mbps = 25;
    if (bitrateMode === 'high') mbps = 50;
    if (bitrateMode === 'custom') mbps = customBitrate;
    // 15 seconds video estimate
    const totalMbits = mbps * 15;
    return (totalMbits / 8).toFixed(1);
  };

  // Check if resolution / fps requires dynamic hardware fallback
  const isFallbackRequired =
    (resolution === '8K' && !deviceCapabilities.supportsSuperResolution8K) ||
    (fps === 120 && !deviceCapabilities.supportsFrameInterpolation120fps);

  const handleStartRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setRenderFrame(0);

    const totalFrames = fps * 15;
    let current = 0;

    const interval = setInterval(() => {
      current += 6;
      const progress = Math.min(100, Math.floor((current / totalFrames) * 100));
      setRenderFrame(current);
      setRenderProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsRendering(false);
        setIsFinished(true);
        onStartExport({
          format: 'mp4',
          resolution,
          fps,
          bitrateMode,
          customBitrateMbps: bitrateMode === 'custom' ? customBitrate : 50,
          useHardwareAcceleration: useHardwareAccel,
          aspectRatio: '9:16',
          enhanceBeforeExport: true,
        });
      }
    }, 80);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl p-6 space-y-5 text-zinc-200 shadow-2xl ${
          isRtl ? 'rtl' : 'ltr'
        }`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/30">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t.exportTitle}</h3>
              <p className="text-[11px] text-zinc-400">
                {language === 'ar' ? 'تنسيق MP4 مع تسريع عتاد الأندرويد' : 'MP4 H.265 Android Hardware Render'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isRendering && !isFinished ? (
          <div className="space-y-4">
            {/* Resolution Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-zinc-400 block">
                {t.resolution}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['1080p', '2K', '4K', '8K'] as ExportResolution[]).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                      resolution === res
                        ? 'border-blue-500 bg-blue-600/20 text-blue-300 shadow-md'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Rate (FPS) Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-zinc-400 block">
                {t.fps}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([30, 60, 120] as ExportFps[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFps(f)}
                    className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                      fps === f
                        ? 'border-purple-500 bg-purple-600/20 text-purple-300 shadow-md'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {f} FPS
                  </button>
                ))}
              </div>
            </div>

            {/* Bitrate Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-zinc-400 block">
                {t.bitrate}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { id: 'low', name: 'Low (12M)' },
                    { id: 'medium', name: 'Med (25M)' },
                    { id: 'high', name: 'High (50M)' },
                    { id: 'custom', name: 'Custom' },
                  ] as { id: BitrateMode; name: string }[]
                ).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBitrateMode(b.id)}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all truncate ${
                      bitrateMode === b.id
                        ? 'border-emerald-500 bg-emerald-600/20 text-emerald-300 shadow-md'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Bitrate Slider */}
            {bitrateMode === 'custom' && (
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Custom Bitrate</span>
                  <span className="text-emerald-400 font-bold">{customBitrate} Mbps</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  value={customBitrate}
                  onChange={(e) => setCustomBitrate(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded cursor-pointer"
                />
              </div>
            )}

            {/* Hardware Fallback Notice if active */}
            {isFallbackRequired && (
              <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl flex items-start space-x-2 rtl:space-x-reverse text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-snug">{t.fallbackNotice}</p>
              </div>
            )}

            {/* Hardware Accel & Est Size Info */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={useHardwareAccel}
                  onChange={(e) => setUseHardwareAccel(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span className="text-zinc-300 font-sans font-medium">{t.hardwareAccel}</span>
              </label>

              <div>
                {t.estimatedSize}: <span className="text-white font-bold">{calculateEstimatedMb()} MB</span>
              </div>
            </div>

            {/* Action Render Button */}
            <button
              onClick={handleStartRender}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{language === 'ar' ? 'بدء المعالجة والتصدير' : 'Start Rendering Video'}</span>
            </button>
          </div>
        ) : isRendering ? (
          /* Render Progress View */
          <div className="py-8 space-y-6 text-center">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-zinc-800"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-blue-500 transition-all duration-200"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * renderProgress) / 100}
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-mono font-extrabold text-lg text-white">
                {renderProgress}%
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{t.renderProgress}</h4>
              <p className="text-xs text-zinc-400 font-mono">
                Frame {renderFrame} / {fps * 15} • Hardware Engine: MediaCodec H.265
              </p>
            </div>
          </div>
        ) : (
          /* Completion State */
          <div className="py-6 space-y-5 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">{t.renderComplete}</h4>
              <p className="text-xs text-zinc-400">
                Saved to Movies/ClipCraft/ ({resolution} @ {fps} FPS)
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
