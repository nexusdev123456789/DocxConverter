import React from 'react';
import { FileText, ShieldCheck, Heart, Github, Twitter } from 'lucide-react';
import { ToolDefinition } from '../types';

interface FooterProps {
  tools: ToolDefinition[];
  onSelectTool: (tool: ToolDefinition) => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onNavigateCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  tools,
  onSelectTool,
  onOpenAbout,
  onOpenPrivacy,
  onNavigateCategory,
}) => {
  const pdfTools = tools.filter(t => t.category === 'pdf').slice(0, 6);
  const imageTools = tools.filter(t => t.category === 'image').slice(0, 6);
  const utilityTools = tools.filter(t => t.category === 'utility' || t.category === 'document').slice(0, 6);

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                Docu<span className="text-red-600">Convert</span>
              </span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              Fast, secure, and modern all-in-one PDF and file conversion platform.
              All documents are processed in-memory in your browser with 100% privacy protection.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-emerald-700 font-medium bg-emerald-50 w-fit px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Zero-storage client privacy guarantee</span>
            </div>
          </div>

          {/* Col 1: PDF Tools */}
          <div>
            <h4 
              onClick={() => onNavigateCategory('pdf')}
              className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 cursor-pointer hover:text-red-600"
            >
              PDF Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              {pdfTools.map(t => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-red-600 transition"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Image Tools */}
          <div>
            <h4 
              onClick={() => onNavigateCategory('image')}
              className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 cursor-pointer hover:text-red-600"
            >
              Image Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              {imageTools.map(t => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-red-600 transition"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company & Utilities */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button onClick={onOpenAbout} className="hover:text-red-600 transition">
                  About DocuConvert
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-red-600 transition">
                  Privacy Policy & Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('utility')} className="hover:text-red-600 transition">
                  Utility Tools
                </button>
              </li>
              <li>
                <span className="text-slate-400">Status: All Services Online</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} DocuConvert. Built for speed and student & workplace productivity.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacy} className="hover:text-slate-600">Privacy Guarantee</button>
            <span>•</span>
            <button onClick={onOpenAbout} className="hover:text-slate-600">Security Architecture</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
