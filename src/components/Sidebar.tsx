import React, { useState } from 'react';
import { Clip, StockAsset } from '../types';
import { STOCK_ASSETS } from '../data/stockAssets';
import {
  FolderOpen,
  Layers,
  MessageSquareText,
  Sparkles,
  Wand2,
  Diamond,
  Gauge,
  Plus,
  Upload,
  Play,
  Music,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { ChromaKeyPanel } from './ChromaKeyPanel';
import { KeyframeEditorPanel } from './KeyframeEditorPanel';
import { SpeedControlPanel } from './SpeedControlPanel';
import { EffectsPacksPanel } from './EffectsPacksPanel';

export type SidebarTab =
  | 'media'
  | 'templates'
  | 'captions'
  | 'effects'
  | 'chroma'
  | 'keyframes'
  | 'speed';

interface SidebarProps {
  activeTab?: SidebarTab;
  setActiveTab?: (tab: SidebarTab) => void;
  selectedClip?: Clip | null;
  onAddStockAssetToTimeline?: (asset: StockAsset) => void;
  onOpenAutoCaptions?: () => void;
  onOpenTemplates?: () => void;
  onUpdateChromaKey?: (settings: any) => void;
  onUpdateClipKeyframes?: (prop: any, time: number, val: number) => void;
  onDeleteKeyframe?: (prop: any, id: string) => void;
  onUpdateSpeed?: (spd: number) => void;
  onUpdateEffect?: (type: any, intensity: number) => void;
  onUpdateTransition?: (type: any) => void;
  currentTime?: number;
  onJumpToTime?: (t: number) => void;
  onCustomFileUpload?: (file: File) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedClip = null,
  onAddStockAssetToTimeline = (_asset?: any) => {},
  onOpenAutoCaptions = () => {},
  onOpenTemplates = () => {},
  onUpdateChromaKey = (_settings?: any) => {},
  onUpdateClipKeyframes = (_prop?: any, _time?: number, _val?: number) => {},
  onDeleteKeyframe = (_prop?: any, _id?: string) => {},
  onUpdateSpeed = (_spd?: number) => {},
  onUpdateEffect = (_type?: any, _intensity?: number) => {},
  onUpdateTransition = (_type?: any) => {},
  currentTime = 0,
  onJumpToTime = (_t?: number) => {},
  onCustomFileUpload = (_file?: File) => {},
}) => {
  const [internalTab, setInternalTab] = useState<SidebarTab>('media');
  const currentTab = activeTab || internalTab;

  const handleTabChange = (tab: SidebarTab) => {
    if (setActiveTab) setActiveTab(tab);
    setInternalTab(tab);
  };

  const [assetCategory, setAssetCategory] = useState<string>('All');

  const navItems = [
    { id: 'media' as SidebarTab, label: 'Media', icon: FolderOpen },
    { id: 'templates' as SidebarTab, label: 'Templates', icon: Layers },
    { id: 'captions' as SidebarTab, label: 'Captions', icon: MessageSquareText },
    { id: 'effects' as SidebarTab, label: 'Effects', icon: Sparkles },
    { id: 'chroma' as SidebarTab, label: 'Chroma Key', icon: Wand2 },
    { id: 'keyframes' as SidebarTab, label: 'Keyframes', icon: Diamond },
    { id: 'speed' as SidebarTab, label: 'Speed', icon: Gauge },
  ];

  const filteredAssets =
    assetCategory === 'All'
      ? STOCK_ASSETS
      : STOCK_ASSETS.filter((a) => a.category === assetCategory);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCustomFileUpload(e.target.files[0]);
    }
  };

  return (
    <aside className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-900 select-none shrink-0 z-20">
      {/* Tab Selector Bar */}
      <div className="flex items-center overflow-x-auto bg-zinc-950 border-b border-zinc-800 p-1 space-x-1 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex-1 min-w-[55px] py-1.5 px-1 flex flex-col items-center justify-center space-y-1 text-[10px] font-medium transition-all rounded ${
                isActive
                  ? 'bg-zinc-800 text-white border-b-2 border-blue-500 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Drawer Content */}
      <div className="flex-1 overflow-y-auto">
        {/* TAB 1: Media Library */}
        {currentTab === 'media' && (
          <div className="p-3 space-y-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Media Library
              </span>

              {/* Upload */}
              <label className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2 py-0.5 rounded cursor-pointer transition-colors border border-zinc-700 flex items-center space-x-1">
                <Upload className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] font-medium">Import</span>
                <input
                  type="file"
                  accept="video/*,audio/*,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar text-[10px] font-medium">
              {['All', 'Sample Video', 'Green Screen', 'Background', 'Music', 'SFX'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setAssetCategory(cat)}
                    className={`px-2 py-0.5 rounded transition-colors shrink-0 ${
                      assetCategory === cat
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Media Assets Grid */}
            <div className="grid grid-cols-2 gap-2">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => onAddStockAssetToTimeline(asset)}
                  className="group relative aspect-video bg-zinc-800 rounded overflow-hidden border border-zinc-700 cursor-pointer hover:border-blue-500 transition-colors shadow-sm"
                >
                  {asset.thumbnail ? (
                    <img
                      src={asset.thumbnail}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                      {asset.type === 'audio' ? (
                        <Music className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Video className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white p-0.5 rounded shadow">
                    <Plus className="w-3 h-3" />
                  </div>

                  <div className="absolute bottom-1 left-1 right-1 flex justify-between items-end">
                    <span className="text-[9px] font-medium text-white truncate drop-shadow-sm pr-1">
                      {asset.title}
                    </span>
                    <span className="bg-black/70 text-zinc-300 px-1 rounded text-[8px] font-mono shrink-0">
                      {asset.duration}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Templates */}
        {currentTab === 'templates' && (
          <div className="p-3 space-y-3 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block text-left">
              Project Presets
            </span>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
              <Layers className="w-8 h-8 text-blue-400 mx-auto" />
              <div className="text-xs font-bold text-white">Multi-Layer Templates</div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Load full multi-track timelines with synced overlays and effects.
              </p>
              <button
                onClick={onOpenTemplates}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded transition-colors"
              >
                Open Gallery
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Captions */}
        {currentTab === 'captions' && (
          <div className="p-3 space-y-3 text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block text-left">
              AI Subtitles
            </span>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
              <MessageSquareText className="w-8 h-8 text-purple-400 mx-auto" />
              <div className="text-xs font-bold text-white">Auto Subtitle Generator</div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Timestamped AI subtitles with viral styling presets.
              </p>
              <button
                onClick={onOpenAutoCaptions}
                className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded transition-colors"
              >
                Generate Captions
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Effects */}
        {currentTab === 'effects' && (
          <EffectsPacksPanel
            selectedClip={selectedClip}
            onUpdateEffect={onUpdateEffect}
            onUpdateTransition={onUpdateTransition}
            onUpdateSpeed={onUpdateSpeed}
            language="ar"
          />
        )}

        {/* TAB 5: Chroma Key */}
        {currentTab === 'chroma' && (
          <ChromaKeyPanel
            selectedClip={selectedClip}
            onUpdateChromaKey={onUpdateChromaKey}
          />
        )}

        {/* TAB 6: Keyframes */}
        {currentTab === 'keyframes' && (
          <KeyframeEditorPanel
            selectedClip={selectedClip}
            currentTime={currentTime}
            onUpdateClipKeyframes={onUpdateClipKeyframes}
            onDeleteKeyframe={onDeleteKeyframe}
            onJumpToTime={onJumpToTime}
          />
        )}

        {/* TAB 7: Speed */}
        {currentTab === 'speed' && (
          <SpeedControlPanel
            selectedClip={selectedClip}
            onUpdateSpeed={onUpdateSpeed}
          />
        )}
      </div>
    </aside>
  );
};
