import React, { useState } from 'react';
import { CaptionPreset, CaptionStyle, Clip, Track } from '../types';
import { Sparkles, Wand2, X, Check, Loader2, Type } from 'lucide-react';

interface AutoCaptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalDuration: number;
  onApplyCaptionsToTimeline: (captionsClips: Clip[]) => void;
}

export const AutoCaptionsModal: React.FC<AutoCaptionsModalProps> = ({
  isOpen,
  onClose,
  totalDuration,
  onApplyCaptionsToTimeline,
}) => {
  const [topic, setTopic] = useState('');
  const [transcript, setTranscript] = useState('');
  const [preset, setPreset] = useState<CaptionPreset>('viral');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const presetsList: { id: CaptionPreset; title: string; desc: string; sample: string }[] = [
    { id: 'viral', title: 'Viral Hormozi', desc: 'Punchy yellow/white bold text with stroke', sample: 'MUST WATCH VIDEO! 🔥' },
    { id: 'neon', title: 'Neon Cyber', desc: 'Glowing cyan subtitle badges', sample: 'NEON SUBTITLES ⚡' },
    { id: 'boxed', title: 'Boxed Badge', desc: 'High contrast solid background', sample: 'LATEST UPDATE 🚀' },
    { id: 'minimal', title: 'Minimalist', desc: 'Clean translucent bottom bar', sample: 'Subtitles caption' },
  ];

  const handleGenerateCaptions = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/gemini/auto-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTopic: topic || 'High engagement video',
          transcript,
          duration: totalDuration || 10,
          preset,
        }),
      });

      const data = await res.json();
      const captionsData = data.captions || data.fallbackCaptions || [];

      // Convert generated timestamped captions to Clip objects
      const captionClips: Clip[] = captionsData.map((item: any, idx: number) => {
        const capStyle: CaptionStyle = {
          fontFamily: preset === 'viral' ? 'Impact, sans-serif' : 'Arial Black, sans-serif',
          fontSize: preset === 'viral' ? 30 : 26,
          color: item.isHighlighted ? '#FFE600' : '#FFFFFF',
          bgColor: preset === 'boxed' ? 'rgba(255,0,85,0.85)' : 'rgba(0,0,0,0.75)',
          strokeColor: '#000000',
          strokeWidth: 3,
          preset,
          positionY: 70,
        };

        return {
          id: `ai-cap-${Date.now()}-${idx}`,
          trackId: 'track-text-auto',
          name: `Cap: ${item.text.slice(0, 15)}...`,
          type: 'text',
          startInTimeline: item.start,
          duration: Math.max(1, item.end - item.start),
          sourceStart: 0,
          sourceDuration: item.end - item.start,
          text: item.text,
          volume: 1,
          speed: 1,
          transform: { x: 0, y: 35, scale: 1, rotation: 0, opacity: 1, zIndex: 10 },
          chromaKey: { enabled: false, color: '#00ff00', distance: 0.3, smoothness: 0.1, spill: 0.2 },
          keyframes: {},
          effectType: 'none',
          effectIntensity: 0,
          captionStyle: capStyle,
        };
      });

      onApplyCaptionsToTimeline(captionClips);
      onClose();
    } catch (err: any) {
      setErrorMsg('Failed to generate AI captions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">AI Auto Captions Studio</h2>
              <p className="text-xs text-slate-400">Powered by Gemini 3.6 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Video Topic / Theme
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How to grow on social media in 2026"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Custom Transcript / Script (Optional)
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Leave empty to auto-generate script captions based on topic..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-purple-500 h-20 resize-none"
            />
          </div>

          {/* Presets Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Caption Style Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetsList.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    preset === p.id
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-white mb-0.5">{p.title}</div>
                  <div className="text-[10px] text-slate-400 mb-1.5">{p.desc}</div>
                  <div className="text-[10px] font-extrabold text-amber-300 bg-black/60 px-1.5 py-0.5 rounded inline-block">
                    {p.sample}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMsg && <div className="text-xs text-rose-400 bg-rose-950/60 p-2.5 rounded-lg border border-rose-800">{errorMsg}</div>}

        {/* Submit */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerateCaptions}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Captions...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-yellow-300" />
                <span>Generate & Add to Timeline</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
