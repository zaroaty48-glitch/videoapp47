import React from 'react';
import { ProjectTemplate } from '../types';
import { PROJECT_TEMPLATES } from '../data/projectTemplates';
import { Layers, X, Sparkles, Check, Play } from 'lucide-react';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ProjectTemplate) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Template Gallery</h2>
              <p className="text-xs text-slate-400">1-Click Pre-Built Timeline Project Presets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
          {PROJECT_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="relative h-32 overflow-hidden bg-slate-900">
                  <img
                    src={tmpl.thumbnail}
                    alt={tmpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-indigo-300 uppercase">
                    {tmpl.aspectRatio}
                  </div>
                  <div className="absolute top-2 right-2 bg-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
                    {tmpl.category}
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <h3 className="font-bold text-sm text-white">{tmpl.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {tmpl.description}
                  </p>
                </div>
              </div>

              <div className="p-3 pt-0">
                <button
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onClose();
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
