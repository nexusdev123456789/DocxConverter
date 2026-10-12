import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are my uploaded documents secure and private?',
      a: 'Yes, absolutely. DocuConvert processes files directly inside your browser using client-side JavaScript and WebAssembly libraries. Your files are never uploaded to remote data centers, analyzed by advertisers, or permanently stored. When you close the tab, all file memory is cleared immediately.',
    },
    {
      q: 'What is the maximum file size I can convert?',
      a: 'Most tools comfortably handle files up to 50MB per document. Since conversions run in your local browser sandbox, files load and convert without server bandwidth limits or queue delays.',
    },
    {
      q: 'Can I use this on mobile phones and tablets?',
      a: 'Yes. The interface is optimized for iOS Safari, Android Chrome, and all modern mobile browsers. You can pick photos directly from your camera roll or documents from your Files app and download converted PDFs directly.',
    },
    {
      q: 'Can I merge or extract multiple PDFs at once?',
      a: 'Yes! The Merge PDF tool allows you to upload up to 20 PDF files simultaneously, drag or click to adjust their order, and compile them into a single consolidated PDF. The Split PDF tool can extract every page into a neat ZIP archive or pull specific custom page ranges.',
    },
    {
      q: 'How does the PDF compressor maintain high quality?',
      a: 'The compression algorithm optimizes internal object streams, strips redundant embedded font duplicates, and eliminates unused metadata while preserving vector lines, selectable text, and high-resolution visuals.',
    },
    {
      q: 'Do I need an account or subscription?',
      a: 'No account, credit card, or email address is needed. All 24+ tools are freely accessible to students, professionals, and teams anytime.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/70">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-1.5 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="h-4 w-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Everything you need to know about DocuConvert security, tools, and processing.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 hover:text-red-600 transition focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
