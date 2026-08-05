import React, { useState } from 'react';
import {
  SavedProject,
  ExportHistoryRecord,
  DeviceCapabilities,
  Language,
  Track,
  Clip,
  VideoEnhancements,
  ExportSettings,
  AspectRatio,
  EffectType,
  TransitionType,
} from './types';
import { HomeScreen } from './components/HomeScreen';
import { HeaderBar } from './components/HeaderBar';
import { VideoCanvasPreview } from './components/VideoCanvasPreview';
import { Timeline } from './components/Timeline';
import { Sidebar } from './components/Sidebar';
import { EnhancementPanel } from './components/EnhancementPanel';
import { ChromaKeyPanel } from './components/ChromaKeyPanel';
import { AutoCaptionsModal } from './components/AutoCaptionsModal';
import { ExportModal } from './components/ExportModal';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { CapCutMobileToolbar } from './components/CapCutMobileToolbar';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'editor'>('home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<string>('edit');
  const [showCodeViewer, setShowCodeViewer] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showAutoCaptions, setShowAutoCaptions] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);

  const [deviceCapabilities] = useState<DeviceCapabilities>({
    gpuName: 'Adreno (TM) 750 (Vulkan 1.3)',
    supportsHardwareAccel: true,
    maxSupportedResolution: '8K',
    maxSupportedFps: 120,
    supportsFrameInterpolation120fps: true,
    supportsSuperResolution8K: true,
    ramGB: 16,
  });

  const [projectTitle, setProjectTitle] = useState<string>('مشروع فيديو كليب');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip-v1');

  const [enhancements, setEnhancements] = useState<VideoEnhancements>({
    sharpness: 40,
    smoothing: 30,
    noiseReduction: 20,
    clarity: 50,
    superResolution: true,
    flickerReduction: true,
    frameInterpolation: true,
    targetFps: 120,
    filterPreset: 'cinematic',
    filterIntensity: 80,
  });

  // مسار آمن يبدأ فارغاً لتفادي الشاشة البيضاء على الجوال
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 'track-v1',
      name: 'فيديو رئيسي (Video)',
      type: 'video',
      locked: false,
      muted: false,
      visible: true,
      clips: [
        {
          id: 'clip-v1',
          trackId: 'track-v1',
          name: 'فيديو فارغ',
          type: 'video',
          startInTimeline: 0,
          duration: 10,
          sourceStart: 0,
          sourceDuration: 10,
          sourceUrl: '',
          volume: 1.0,
          speed: 1.0,
          transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1, zIndex: 1 },
          chromaKey: { enabled: false, color: '#00ff00', distance: 0.3, smoothness: 0.1, spill: 0.1 },
          keyframes: {},
          effectType: 'none',
          effectIntensity: 0,
        },
      ],
    },
    {
      id: 'track-ov1',
      name: 'تأثيرات وتغطيات (Overlay)',
      type: 'overlay',
      locked: false,
      muted: false,
      visible: true,
      clips: [],
    },
    {
      id: 'track-a1',
      name: 'الصوت والموسيقى (Audio)',
      type: 'audio',
      locked: false,
      muted: false,
      visible: true,
      clips: [],
    },
  ]);

  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistoryRecord[]>([]);

  const totalDuration = Math.max(
    15,
    ...tracks.flatMap((t) => t.clips.map((c) => c.startInTimeline + c.duration))
  );

  const canUndo = true;
  const canRedo = false;

  const handleCreateNewProject = () => {
    setProjectTitle('مشروع جديد ' + (savedProjects.length + 1));
    setCurrentScreen('editor');
  };

  const handleImportVideo = (file: File) => {
    const url = URL.createObjectURL(file);
    const newClip: Clip = {
      id: 'clip-' + Date.now(),
      trackId: 'track-v1',
      name: file.name,
      type: 'video',
      startInTimeline: 0,
      duration: 10,
      sourceStart: 0,
      sourceDuration: 10,
      sourceUrl: url,
      volume: 1.0,
      speed: 1.0,
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1, zIndex: 1 },
      chromaKey: { enabled: false, color: '#00ff00', distance: 0.3, smoothness: 0.1, spill: 0.1 },
      keyframes: {},
      effectType: 'none',
      effectIntensity: 0,
    };

    setTracks((prev) =>
      prev.map((t) => (t.id === 'track-v1' ? { ...t, clips: [...t.clips, newClip] } : t))
    );
    setCurrentScreen('editor');
  };

  const handleRazorCut = () => {
    if (!selectedClipId) return;
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        const clip = track.clips.find((c) => c.id === selectedClipId);
        if (!clip) return track;

        const clipEnd = clip.startInTimeline + clip.duration;
        if (currentTime <= clip.startInTimeline || currentTime >= clipEnd) return track;

        const firstDuration = currentTime - clip.startInTimeline;
        const secondDuration = clip.duration - firstDuration;

        const firstClip: Clip = { ...clip, duration: firstDuration };
        const secondClip: Clip = {
          ...clip,
          id: 'clip-' + Date.now(),
          startInTimeline: currentTime,
          duration: secondDuration,
          sourceStart: clip.sourceStart + firstDuration,
        };

        return {
          ...track,
          clips: track.clips.flatMap((c) => (c.id === selectedClipId ? [firstClip, secondClip] : [c])),
        };
      })
    );
  };

  const selectedClip = tracks.flatMap((t) => t.clips).find((c) => c.id === selectedClipId) || null;

  const handleUpdateChromaKey = (newChroma: any) => {
    if (!selectedClipId) return;
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) => (c.id === selectedClipId ? { ...c, chromaKey: newChroma } : c)),
      }))
    );
  };

  const handleUpdateEffect = (type: EffectType, intensity: number) => {
    if (!selectedClipId) return;
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) =>
          c.id === selectedClipId ? { ...c, effectType: type, effectIntensity: intensity } : c
        ),
      }))
    );
  };

  const handleUpdateTransition = (type: TransitionType) => {
    if (!selectedClipId) return;
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) => (c.id === selectedClipId ? { ...c, transitionIn: type } : c)),
      }))
    );
  };

  const handleUpdateSpeed = (speed: number) => {
    if (!selectedClipId) return;
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) => (c.id === selectedClipId ? { ...c, speed } : c)),
      }))
    );
  };

  const handleUpdateClipKeyframes = (prop: string, time: number, val: number) => {
    if (!selectedClipId) return;
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) => {
          if (c.id !== selectedClipId) return c;
          const currentPropKF = (c.keyframes as any)[prop] || [];
          const existingIdx = currentPropKF.findIndex((k: any) => Math.abs(k.time - time) < 0.05);
          let updatedPropKF;
          if (existingIdx >= 0) {
            updatedPropKF = currentPropKF.map((k: any, i: number) =>
              i === existingIdx ? { ...k, value: val } : k
            );
          } else {
            updatedPropKF = [...currentPropKF, { id: 'kf-' + Date.now(), time, value: val }];
          }
          return {
            ...c,
            keyframes: { ...c.keyframes, [prop]: updatedPropKF },
          };
        }),
      }))
    );
  };

  const handleDeleteKeyframe = (prop: string, id: string) => {
    if (!selectedClipId) return;
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) => {
          if (c.id !== selectedClipId) return c;
          const currentPropKF = (c.keyframes as any)[prop] || [];
          return {
            ...c,
            keyframes: {
              ...c.keyframes,
              [prop]: currentPropKF.filter((k: any) => k.id !== id),
            },
          };
        }),
      }))
    );
  };

  const handleCustomFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const isAudio = file.type.startsWith('audio');
    const isImage = file.type.startsWith('image');
    const clipType = isAudio ? 'audio' : isImage ? 'image' : 'video';
    const trackId = isAudio ? 'track-a1' : 'track-v1';

    const newClip: Clip = {
      id: 'clip-' + Date.now(),
      trackId,
      name: file.name,
      type: clipType,
      startInTimeline: currentTime,
      duration: 10,
      sourceStart: 0,
      sourceDuration: 10,
      sourceUrl: url,
      volume: 1.0,
      speed: 1.0,
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1, zIndex: 1 },
      chromaKey: { enabled: false, color: '#00ff00', distance: 0.3, smoothness: 0.1, spill: 0.1 },
      keyframes: {},
      effectType: 'none',
      effectIntensity: 0,
    };

    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, clips: [...t.clips, newClip] } : t))
    );
  };

  const handleExportFinished = (settings: ExportSettings) => {
    const newRecord: ExportHistoryRecord = {
      id: 'exp-' + Date.now(),
      projectTitle,
      date: new Date().toLocaleString(),
      durationSeconds: totalDuration,
      resolution: settings.resolution,
      fps: settings.fps,
      bitrateMbps: settings.customBitrateMbps || 50,
      fileSizeBytes: 85000000,
      thumbnailUrl: '',
    };
    setExportHistory((prev) => [newRecord, ...prev]);
  };

  const isRtl = language === 'ar';

  return (
    <div
      className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none overflow-x-hidden ${
        isRtl ? 'rtl' : 'ltr'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {currentScreen === 'home' ? (
        <HomeScreen
          language={language}
          onToggleLanguage={() => setLanguage((l) => (l === 'ar' ? 'en' : 'ar'))}
          savedProjects={savedProjects}
          exportHistory={exportHistory}
          deviceCapabilities={deviceCapabilities}
          onSelectProject={(p) => {
            setProjectTitle(p.title);
            setCurrentScreen('editor');
          }}
          onCreateNewProject={handleCreateNewProject}
          onImportVideo={handleImportVideo}
          onDuplicateProject={(id) => {
            const p = savedProjects.find((x) => x.id === id);
            if (p) {
              setSavedProjects((prev) => [
                ...prev,
                { ...p, id: 'proj-' + Date.now(), title: p.title + ' (نسخة)' },
              ]);
            }
          }}
          onDeleteProject={(id) => {
            setSavedProjects((prev) => prev.filter((x) => x.id !== id));
          }}
          onOpenCodeViewer={() => setShowCodeViewer(true)}
        />
      ) : (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <HeaderBar
            projectTitle={projectTitle}
            setProjectTitle={setProjectTitle}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={() => {}}
            onRedo={() => {}}
            onRazorCut={handleRazorCut}
            onOpenAutoCaptions={() => setShowAutoCaptions(true)}
            onOpenTemplates={() => setShowTemplates(true)}
            onOpenExport={() => setShowExportModal(true)}
            activeNavTab="Edit"
          />

          <div className="h-8 bg-zinc-950 border-b border-zinc-800 px-4 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setCurrentScreen('home')}
                className="hover:text-white font-bold flex items-center gap-1"
              >
                ← {language === 'ar' ? 'الرئيسية' : 'Home'}
              </button>
              <span>•</span>
              <span className="text-zinc-200">{projectTitle}</span>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setIsMobileFrame(!isMobileFrame)}
                className={`flex items-center space-x-1 px-2 py-0.5 rounded border transition-colors ${
                  isMobileFrame
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {isMobileFrame ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                <span>{isMobileFrame ? 'Mobile Frame' : 'Fullscreen'}</span>
              </button>

              <button
                onClick={() => setShowCodeViewer(true)}
                className="px-2 py-0.5 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded font-bold hover:bg-purple-600/30 transition-colors"
              >
                {language === 'ar' ? 'كود أندرويد' : 'Kotlin Code'}
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden relative">
            <Sidebar
              selectedClip={selectedClip}
              currentTime={currentTime}
              onJumpToTime={setCurrentTime}
              onUpdateEffect={handleUpdateEffect}
              onUpdateTransition={handleUpdateTransition}
              onUpdateSpeed={handleUpdateSpeed}
              onUpdateChromaKey={handleUpdateChromaKey}
              onUpdateClipKeyframes={handleUpdateClipKeyframes}
              onDeleteKeyframe={handleDeleteKeyframe}
              onCustomFileUpload={handleCustomFileUpload}
              onAddStockAssetToTimeline={() => {}}
              onOpenAutoCaptions={() => setShowAutoCaptions(true)}
              onOpenTemplates={() => setShowTemplates(true)}
            />

            <div
              className={`flex-1 flex flex-col bg-black relative overflow-hidden items-center justify-center ${
                isMobileFrame ? 'p-6' : ''
              }`}
            >
              {isMobileFrame ? (
                <div className="w-[320px] h-[580px] bg-zinc-900 border-4 border-zinc-700 rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col items-center">
                  <div className="w-24 h-4 bg-zinc-800 rounded-b-xl mb-1 z-20" />
                  <VideoCanvasPreview
                    aspectRatio="9:16"
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                    totalDuration={totalDuration}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                    tracks={tracks}
                  />
                </div>
              ) : (
                <VideoCanvasPreview
                  aspectRatio={aspectRatio}
                  currentTime={currentTime}
                  setCurrentTime={setCurrentTime}
                  totalDuration={totalDuration}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  tracks={tracks}
                />
              )}
            </div>

            <div className="w-72 border-l border-zinc-800 bg-zinc-900 overflow-y-auto shrink-0">
              {activeTool === 'enhancement' ? (
                <EnhancementPanel
                  language={language}
                  enhancements={enhancements}
                  onUpdateEnhancements={setEnhancements}
                />
              ) : activeTool === 'chroma' ? (
                <ChromaKeyPanel
                  selectedClip={selectedClip}
                  onUpdateChromaKey={handleUpdateChromaKey}
                />
              ) : (
                <EnhancementPanel
                  language={language}
                  enhancements={enhancements}
                  onUpdateEnhancements={setEnhancements}
                />
              )}
            </div>
          </div>

          <CapCutMobileToolbar
            language={language}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            onRazorCut={handleRazorCut}
          />

          <Timeline
            tracks={tracks}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            totalDuration={totalDuration}
            selectedClipId={selectedClipId}
            onSelectClip={setSelectedClipId}
            onUpdateClipPosition={(clipId, newStart, newTrackId) => {
              setTracks((prev) =>
                prev.map((t) => ({
                  ...t,
                  clips: t.clips.map((c) =>
                    c.id === clipId
                      ? { ...c, startInTimeline: Math.max(0, newStart), trackId: newTrackId }
                      : c
                  ),
                }))
              );
            }}
            onToggleTrackVisibility={(trackId) => {
              setTracks((prev) =>
                prev.map((t) => (t.id === trackId ? { ...t, visible: !t.visible } : t))
              );
            }}
            onToggleTrackMute={(trackId) => {
              setTracks((prev) =>
                prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
              );
            }}
            onToggleTrackLock={(trackId) => {
              setTracks((prev) =>
                prev.map((t) => (t.id === trackId ? { ...t, locked: !t.locked } : t))
              );
            }}
            onRazorCut={handleRazorCut}
            onDuplicateClip={(clipId) => {
              setTracks((prev) =>
                prev.map((t) => {
                  const clip = t.clips.find((c) => c.id === clipId);
                  if (!clip) return t;
                  const newClip: Clip = {
                    ...clip,
                    id: 'clip-' + Date.now(),
                    startInTimeline: clip.startInTimeline + clip.duration + 0.5,
                  };
                  return { ...t, clips: [...t.clips, newClip] };
                })
              );
            }}
            onDeleteClip={(clipId) => {
              setTracks((prev) =>
                prev.map((t) => ({ ...t, clips: t.clips.filter((c) => c.id !== clipId) }))
              );
              setSelectedClipId(null);
            }}
          />
        </div>
      )}

      {showCodeViewer && (
        <AndroidCodeModal language={language} onClose={() => setShowCodeViewer(false)} />
      )}

      {showExportModal && (
        <ExportModal
          language={language}
          onClose={() => setShowExportModal(false)}
          deviceCapabilities={deviceCapabilities}
          onStartExport={handleExportFinished}
        />
      )}

      {showAutoCaptions && (
        <AutoCaptionsModal
          onClose={() => setShowAutoCaptions(false)}
          onApplyCaptions={() => {
            setShowAutoCaptions(false);
          }}
        />
      )}

      {showTemplates && (
        <TemplateGalleryModal
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={(template) => {
            setTracks(template.tracks);
            setAspectRatio(template.aspectRatio);
            setShowTemplates(false);
          }}
        />
      )}
    </div>
  );
}
