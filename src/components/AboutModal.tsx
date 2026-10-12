import React from 'react';
import { X, Sparkles, Layers, Cpu, Globe2, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2 text-red-600">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              About DocuConvert
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            DocuConvert is designed to provide students, researchers, remote teams, and administrative workers with an intuitive, unified suite of document tools without the clutter, aggressive advertisements, or subscription walls of legacy file converters.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <Cpu className="h-4 w-4 text-red-600" />
                <span>WebAssembly & PDF-Lib</span>
              </div>
              <p className="text-slate-500 text-xs">
                Native document manipulation in the client runtime without sending files across external servers.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <Globe2 className="h-4 w-4 text-red-600" />
                <span>Cross-Device Compatibility</span>
              </div>
              <p className="text-slate-500 text-xs">
                Works identically on iOS Safari, Android Chrome, Windows, macOS, and Linux.
              </p>
            </div>
          </div>

          <p>
            Whether you need to combine ten research papers into a single thesis PDF, compress a slide deck for email attachment limits, or turn spreadsheets into printable tables, DocuConvert handles the heavy lifting in seconds.
          </p>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
