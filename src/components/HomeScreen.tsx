import React, { useState } from 'react';
import {
  Plus,
  Video,
  History,
  Smartphone,
  Sparkles,
  Trash2,
  Copy,
  Play,
  Globe,
  Cpu,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Film,
  Download,
} from 'lucide-react';
import { SavedProject, ExportHistoryRecord, DeviceCapabilities, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface HomeScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  savedProjects: SavedProject[];
  exportHistory: ExportHistoryRecord[];
  deviceCapabilities: DeviceCapabilities;
  onSelectProject: (project: SavedProject) => void;
  onCreateNewProject: () => void;
  onImportVideo: (file: File) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onOpenCodeViewer: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onToggleLanguage,
  savedProjects,
  exportHistory,
  deviceCapabilities,
  onSelectProject,
  onCreateNewProject,
  onImportVideo,
  onDuplicateProject,
  onDeleteProject,
  onOpenCodeViewer,
}) => {
  const t = getTranslation(language);
  const [showExportHistoryModal, setShowExportHistoryModal] = useState(false);
  const isRtl = language === 'ar';

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportVideo(e.target.files[0]);
    }
  };

  return (
    <div
      className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none ${
        isRtl ? 'rtl' : 'ltr'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top App Bar */}
      <header className="h-14 border-b border-zinc-800/80 bg-zinc-900/90 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>{t.appName}</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 font-mono px-2 py-0.5 rounded-full border border-blue-500/30">
                v2.4 Android Pro
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400">{t.appTagline}</p>
          </div>
        </div>

        {/* Quick Language & Kotlin Code Buttons */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={onOpenCodeViewer}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-purple-300 rounded-lg text-xs font-semibold border border-purple-500/30 transition-all shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.androidCode}</span>
          </button>

          <button
            onClick={onToggleLanguage}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold border border-zinc-700 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Banner Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* New Project Callout Button */}
          <button
            onClick={onCreateNewProject}
            className="group relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 rounded-2xl border border-blue-400/30 text-right rtl:text-right ltr:text-left flex flex-col justify-between h-40 shadow-xl shadow-blue-900/20 hover:scale-[1.01] transition-transform overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="flex justify-between items-start z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white shadow-inner">
                <Plus className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded text-white">
                CapCut Mode
              </span>
            </div>

            <div className="z-10 mt-4">
              <h2 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors">
                {t.newProject}
              </h2>
              <p className="text-xs text-blue-100/80 leading-snug">
                {language === 'ar'
                  ? 'إنشاء فيديو جديد وتطبيق تأثيرات الذكاء الاصطناعي والتنعيم'
                  : 'Start new project with timeline multi-layer editing and AI enhancements'}
              </p>
            </div>
          </button>

          {/* Import Video Card */}
          <label className="group bg-zinc-900 hover:bg-zinc-850 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 cursor-pointer flex flex-col justify-between h-40 transition-all shadow-lg">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t.importVideo}</h2>
              <p className="text-xs text-zinc-400">
                {language === 'ar'
                  ? 'استيراد فيديو من الاستوديو لبدء التعديل الفوري'
                  : 'Select video from device media gallery'}
              </p>
            </div>
          </label>

          {/* Export History Card */}
          <button
            onClick={() => setShowExportHistoryModal(true)}
            className="group bg-zinc-900 hover:bg-zinc-850 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 text-right rtl:text-right ltr:text-left flex flex-col justify-between h-40 transition-all shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <History className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {exportHistory.length}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t.exportHistory}</h2>
              <p className="text-xs text-zinc-400">
                {language === 'ar'
                  ? 'عرض الفيديوهات المصدّرة سابقاً ومواصفات الدقة 4K/8K'
                  : 'View past rendered outputs and metadata log'}
              </p>
            </div>
          </button>
        </div>

        {/* Android Device Capabilities Banner */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <span>{t.deviceCapabilitiesTitle}</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                  Snapdragon 8 Gen 3
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                {t.gpuDetected}: <span className="text-zinc-200 font-mono">{deviceCapabilities.gpuName}</span> • RAM: {deviceCapabilities.ramGB}GB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono font-medium">
            <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300">
              {t.maxResSupported}: <span className="text-blue-400 font-bold">{deviceCapabilities.maxSupportedResolution}</span>
            </div>
            <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300">
              {t.maxFpsSupported}: <span className="text-purple-400 font-bold">{deviceCapabilities.maxSupportedFps} FPS</span>
            </div>
          </div>
        </div>

        {/* Recent Projects Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>{t.recentProjects}</span>
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              {savedProjects.length} {t.clips}
            </span>
          </div>

          {savedProjects.length === 0 ? (
            <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 space-y-3">
              <Film className="w-12 h-12 mx-auto text-zinc-700" />
              <p className="text-sm">{t.noProjectsYet}</p>
              <button
                onClick={onCreateNewProject}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                {t.newProject}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-zinc-900 rounded-xl border border-zinc-800 hover:border-blue-500/50 transition-all overflow-hidden flex flex-col justify-between shadow-md"
                >
                  {/* Thumbnail Preview Area */}
                  <div
                    onClick={() => onSelectProject(project)}
                    className="aspect-video bg-zinc-950 relative cursor-pointer overflow-hidden group"
                  >
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-700">
                      {project.aspectRatio}
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                      <span className="text-[10px] text-zinc-300 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.durationSeconds}s
                      </span>
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                        {project.clipCount} {t.clips}
                      </span>
                    </div>

                    {/* Play Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-blue-600/90 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div className="p-3 bg-zinc-900 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <h3
                        onClick={() => onSelectProject(project)}
                        className="text-xs font-bold text-white hover:text-blue-400 cursor-pointer truncate max-w-[160px]"
                      >
                        {project.title}
                      </h3>
                      <p className="text-[10px] text-zinc-400">
                        {t.lastEdited}: {project.lastEdited}
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={() => onDuplicateProject(project.id)}
                        className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-blue-400 transition-colors"
                        title={t.duplicateProject}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-rose-400 transition-colors"
                        title={t.deleteProject}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Export History Modal */}
      {showExportHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                <span>{t.exportHistory}</span>
              </h3>
              <button
                onClick={() => setShowExportHistoryModal(false)}
                className="text-zinc-400 hover:text-white text-sm font-bold px-2 py-1 bg-zinc-800 rounded"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {exportHistory.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  {language === 'ar' ? 'لم يتم تصدير أي فيديو حتى الآن' : 'No videos exported yet.'}
                </div>
              ) : (
                exportHistory.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <img
                        src={rec.thumbnailUrl}
                        alt={rec.projectTitle}
                        className="w-16 h-10 object-cover rounded bg-zinc-900 border border-zinc-800"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{rec.projectTitle}</h4>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-2 font-mono">
                          <span className="text-emerald-400 font-bold">{rec.resolution}</span>
                          <span>•</span>
                          <span>{rec.fps} FPS</span>
                          <span>•</span>
                          <span>{rec.bitrateMbps} Mbps</span>
                          <span>•</span>
                          <span>{rec.date}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={rec.downloadUrl || '#'}
                      download={`${rec.projectTitle}.mp4`}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-bold border border-emerald-500/30 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'حفظ' : 'Save'}</span>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
