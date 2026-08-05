import React from 'react';
import { AspectRatio } from '../types';
import {
  Film,
  Sparkles,
  Download,
  RotateCcw,
  RotateCw,
  Scissors,
  Layers,
  Tv,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface HeaderBarProps {
  projectTitle: string;
  setProjectTitle: (t: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  onOpenAutoCaptions: () => void;
  onOpenTemplates: () => void;
  onOpenExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRazorCut: () => void;
  activeNavTab?: string;
  setActiveNavTab?: (tab: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  projectTitle,
  setProjectTitle,
  aspectRatio,
  setAspectRatio,
  onOpenAutoCaptions,
  onOpenTemplates,
  onOpenExport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRazorCut,
  activeNavTab = 'Edit',
  setActiveNavTab,
}) => {
  const navTabs = ['Edit', 'Color', 'Audio', 'Export'];

  return (
    <nav className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/90 text-zinc-300 select-none z-30 shrink-0">
      {/* Brand Logo & Mode Tabs */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[11px] font-extrabold shadow-sm shadow-blue-500/30">
            V
          </div>
          <span className="font-bold text-white text-sm tracking-tight font-mono">
            VELOCITY PRO
          </span>
        </div>

        {/* Workspace Mode Tabs */}
        <div className="hidden sm:flex space-x-4 text-xs font-medium">
          {navTabs.map((tab) => {
            const isActive = activeNavTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  if (setActiveNavTab) setActiveNavTab(tab);
                  if (tab === 'Export') onOpenExport();
                }}
                className={`pb-3 mt-3 transition-colors ${
                  isActive
                    ? 'text-white border-b-2 border-blue-500 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Project Name Input */}
        <div className="hidden md:flex items-center bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5">
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="bg-transparent text-xs font-medium text-zinc-200 outline-none w-40 lg:w-56 focus:text-white"
            placeholder="Untitled Project"
          />
        </div>
      </div>

      {/* Editing Quick Controls */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-zinc-950 p-1 rounded border border-zinc-800 space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1 hover:bg-zinc-800 disabled:opacity-30 rounded text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1 hover:bg-zinc-800 disabled:opacity-30 rounded text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <div className="h-3 w-px bg-zinc-800 mx-0.5" />

          <button
            onClick={onRazorCut}
            title="Split Clip at Playhead (S)"
            className="flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded transition-colors"
          >
            <Scissors className="w-3 h-3" />
            <span className="hidden lg:inline text-[11px]">Split</span>
          </button>
        </div>

        {/* Aspect Ratio Picker */}
        <div className="flex items-center bg-zinc-950 rounded border border-zinc-800 px-2 py-1">
          <Tv className="w-3 h-3 mr-1 text-zinc-500" />
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
            className="bg-transparent text-[11px] font-semibold text-zinc-200 outline-none cursor-pointer"
          >
            <option value="16:9" className="bg-zinc-900 text-zinc-200">
              16:9
            </option>
            <option value="9:16" className="bg-zinc-900 text-zinc-200">
              9:16 Reel
            </option>
            <option value="1:1" className="bg-zinc-900 text-zinc-200">
              1:1 Square
            </option>
          </select>
        </div>

        {/* AI Auto Captions */}
        <button
          onClick={onOpenAutoCaptions}
          className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Auto Captions</span>
        </button>

        {/* Templates */}
        <button
          onClick={onOpenTemplates}
          className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Templates</span>
        </button>

        {/* Main Action: Render Project / Export */}
        <button
          onClick={onOpenExport}
          className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-500 transition-colors shadow-sm flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Render Project</span>
        </button>
      </div>
    </nav>
  );
};

