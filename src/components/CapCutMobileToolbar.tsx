import React from 'react';
import {
  Scissors,
  Music,
  Type,
  Sticker,
  Sparkles,
  Sliders,
  Wand2,
  Layers,
  Smile,
  Zap,
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface CapCutMobileToolbarProps {
  language: Language;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  onRazorCut: () => void;
}

export const CapCutMobileToolbar: React.FC<CapCutMobileToolbarProps> = ({
  language,
  activeTool,
  setActiveTool,
  onRazorCut,
}) => {
  const t = getTranslation(language);
  const isRtl = language === 'ar';

  const toolsList = [
    { id: 'edit', label: t.tools.edit, icon: Scissors, action: onRazorCut },
    { id: 'enhancement', label: t.tools.enhancement, icon: Sparkles },
    { id: 'audio', label: t.tools.audio, icon: Music },
    { id: 'text', label: t.tools.text, icon: Type },
    { id: 'stickers', label: t.tools.stickers, icon: Smile },
    { id: 'effects', label: t.tools.effects, icon: Zap },
    { id: 'filters', label: t.tools.filters, icon: Sliders },
    { id: 'chroma', label: t.tools.chroma, icon: Wand2 },
  ];

  return (
    <div
      className={`h-14 bg-zinc-950 border-t border-zinc-800 flex items-center px-2 overflow-x-auto divide-x divide-zinc-900 no-scrollbar select-none shrink-0 ${
        isRtl ? 'rtl' : 'ltr'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {toolsList.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id);
              if (tool.action) tool.action();
            }}
            className={`flex-1 min-w-[64px] h-full flex flex-col items-center justify-center space-y-1 text-[10px] font-medium transition-all ${
              isActive
                ? 'text-blue-400 bg-blue-500/10 font-bold border-t-2 border-blue-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-400'}`} />
            <span className="truncate">{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
};
