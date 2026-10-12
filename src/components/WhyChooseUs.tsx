import React from 'react';
import { ShieldCheck, Zap, Smartphone, CheckCircle, Lock, HardDrive } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      title: '100% Privacy Focused',
      description: 'Your sensitive contracts, tax records, and personal documents never leave your browser memory. No third-party data tracking or permanent cloud storage.',
      icon: ShieldCheck,
      highlight: 'Zero storage risk',
    },
    {
      title: 'Blazing Fast Processing',
      description: 'Powered by modern WebAssembly and client-side processing pipelines, your conversions finish in split seconds without queue times or server bottlenecks.',
      icon: Zap,
      highlight: 'Sub-second speeds',
    },
    {
      title: 'Fully Mobile Responsive',
      description: 'Designed from the ground up to operate smoothly on smartphones, iPads, laptops, and ultra-wide desktops. No awkward pinching or sideways scrolling.',
      icon: Smartphone,
      highlight: 'Touch optimized',
    },
    {
      title: 'Crystal Clear Quality',
      description: 'Lossless PDF vector rendering, standard Helvetica and TrueType embedding, and high-fidelity image compressors ensure professional print-ready files.',
      icon: CheckCircle,
      highlight: 'Lossless fidelity',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Built for Modern Workflows
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Why Choose DocuConvert?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            A privacy-conscious alternative to heavy corporate document suites. No hidden subscriptions or forced account sign-ups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {benefits.map(b => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="flex items-start gap-4 p-6 sm:p-7 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-red-400 hover:shadow-sm transition duration-200"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {b.title}
                    </h3>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                      {b.highlight}
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
