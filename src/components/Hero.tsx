import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  FileCheck, 
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Sheet,
  Lock
} from 'lucide-react';
import { ToolDefinition } from '../types';

interface HeroProps {
  onSelectTool: (tool: ToolDefinition, droppedFile?: File) => void;
  tools: ToolDefinition[];
  onExploreAll: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTool, tools, onExploreAll }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    // Smart tool detection
    let matchedTool: ToolDefinition | undefined;

    if (ext === 'pdf') {
      // If multiple PDFs were dropped, choose Merge
      if (files.length > 1) {
        matchedTool = tools.find(t => t.id === 'merge-pdf');
      } else {
        matchedTool = tools.find(t => t.id === 'compress-pdf') || tools.find(t => t.id === 'pdf-to-word');
      }
    } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      matchedTool = tools.find(t => t.id === 'jpg-to-pdf') || tools.find(t => t.id === 'image-compressor');
    } else if (['docx', 'doc'].includes(ext)) {
      matchedTool = tools.find(t => t.id === 'word-to-pdf');
    } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
      matchedTool = tools.find(t => t.id === 'excel-to-pdf');
    } else if (['pptx', 'ppt'].includes(ext)) {
      matchedTool = tools.find(t => t.id === 'ppt-to-pdf');
    } else if (ext === 'txt') {
      matchedTool = tools.find(t => t.id === 'txt-to-pdf');
    } else {
      matchedTool = tools.find(t => t.id === 'file-size-checker');
    }

    if (matchedTool) {
      onSelectTool(matchedTool, file);
    } else {
      onExploreAll();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/70 via-slate-50 to-white pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Private, In-Browser Processing</span>
          <span className="text-slate-300">•</span>
          <span className="text-red-600 font-medium">Free Access or Sign In for Cloud History</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-['Outfit',sans-serif] leading-tight">
          All Your File Tools <br className="hidden sm:block" />
          <span className="text-red-600">in One Place</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Convert, compress, merge, split, and edit documents and images in seconds.
          Fast, effortless, and designed for maximum privacy right from your browser.
        </p>

        {/* Universal Drag & Drop Upload Zone */}
        <div className="mt-8 sm:mt-10 mx-auto max-w-2xl">
          <div
            id="hero-file-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-12 transition-all duration-200 ${
              isDragging
                ? 'border-red-500 bg-red-50/70 shadow-lg scale-[1.01]'
                : 'border-slate-300 bg-white hover:border-red-400 hover:shadow-md'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />

            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs transition-transform duration-200 group-hover:scale-110">
                <UploadCloud className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>

              <h2 className="mt-5 text-lg sm:text-xl font-bold text-slate-900">
                Drop your files here
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                or <span className="font-semibold text-red-600 group-hover:underline">browse files</span> from your device
              </p>

              {/* Supported formats display */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">PDF</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">DOCX</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">XLSX</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">PPTX</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">JPG</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">PNG</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">WEBP</span>
              </div>
            </div>
          </div>

          {/* Privacy & Trust Badge */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Client-Side Privacy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Instant High-Speed Execution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-blue-600" />
              <span>No File Size Restrictions</span>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            id="hero-explore-all-btn"
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <span>View All 24+ Tools</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
