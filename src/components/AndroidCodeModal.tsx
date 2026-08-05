import React, { useState } from 'react';
import { Cpu, Copy, Check, FileCode, Code, X, ShieldCheck } from 'lucide-react';
import { generateKotlinComposeCode } from '../utils/kotlinCodeGenerator';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface AndroidCodeModalProps {
  language: Language;
  onClose: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ language, onClose }) => {
  const t = getTranslation(language);
  const codeFiles = generateKotlinComposeCode();
  const fileKeys = Object.keys(codeFiles);
  const [selectedFile, setSelectedFile] = useState<string>(fileKeys[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = codeFiles[selectedFile];
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="h-14 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t.codeViewerTitle}</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800 font-mono">
                  Kotlin 2.0 • Jetpack Compose
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">{t.codeViewerDesc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs & Copy Action */}
        <div className="h-10 border-b border-zinc-800 bg-zinc-900 px-4 flex items-center justify-between shrink-0">
          <div className="flex space-x-1 rtl:space-x-reverse overflow-x-auto">
            {fileKeys.map((file) => (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium flex items-center space-x-1.5 rtl:space-x-reverse transition-colors ${
                  selectedFile === file
                    ? 'bg-zinc-800 text-purple-300 font-bold border border-purple-500/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.codeCopied : t.copyCode}</span>
          </button>
        </div>

        {/* Code Content Display */}
        <div className="flex-1 bg-zinc-950 p-4 overflow-y-auto font-mono text-xs text-purple-200 leading-relaxed">
          <pre>{codeFiles[selectedFile]}</pre>
        </div>

        {/* Footer info */}
        <div className="h-10 border-t border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clean Architecture • Modular Android MediaCodec Pipeline</span>
          </span>
          <span>Target SDK 36 • Android 14+ Compatible</span>
        </div>
      </div>
    </div>
  );
};
