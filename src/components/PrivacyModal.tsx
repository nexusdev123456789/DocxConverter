import React from 'react';
import { X, ShieldCheck, Zap, Lock, HardDrive, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
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
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Privacy & Security Architecture
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
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <p className="font-semibold text-emerald-900 mb-1">
              Zero-Upload Client Processing
            </p>
            <p className="text-emerald-800">
              Unlike traditional conversion services that transmit confidential contracts and financial statements over the internet to remote servers, DocuConvert converts files directly within your device's browser memory sandbox.
            </p>
          </div>

          <h3 className="font-bold text-slate-900 text-sm mt-4">Key Privacy Principles</h3>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No File Retention:</strong> We do not store or persist your files. Once you download your result or close your browser tab, all memory allocated for conversion is destroyed.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Data Harvesting:</strong> We do not inspect, parse, index, or sell the content of your documents, spreadsheets, or images.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Password Protection Safety:</strong> When using the PDF Password Protect tool, the encryption key is applied directly through cryptographic algorithms without saving passwords anywhere.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No User Tracking:</strong> No tracking cookies, advertising pixels, or telemetry agents are embedded into converted files.</span>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
