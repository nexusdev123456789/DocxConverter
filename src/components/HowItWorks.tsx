import React from 'react';
import { UploadCloud, SlidersHorizontal, Cpu, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload your file',
      description: 'Drag & drop your document or image, or browse from your desktop or phone storage.',
      icon: UploadCloud,
    },
    {
      step: '02',
      title: 'Select settings',
      description: 'Choose your preferred conversion format, compression level, page range, or styling.',
      icon: SlidersHorizontal,
    },
    {
      step: '03',
      title: 'Fast processing',
      description: 'Our engine processes files in your browser with high-fidelity algorithms.',
      icon: Cpu,
    },
    {
      step: '04',
      title: 'Download result',
      description: 'Instantly download your converted, merged, or compressed document with zero delay.',
      icon: Download,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            How It Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Converting documents shouldn't be tedious. Experience a streamlined workflow designed for speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-red-400 transition"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-5">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-xs font-mono font-bold text-red-600 mb-1">
                  STEP {item.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
