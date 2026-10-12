import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  File,
  X,
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertCircle,
  Settings2,
  RefreshCw,
  Eye,
  Lock,
  FileText,
  Sliders,
  Sparkles,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import {
  ToolDefinition,
  UploadedFile,
  ConversionResult,
  ConversionProgress,
  SplitOptions,
  CompressOptions,
  ImageToPdfOptions,
  PageNumberOptions,
  MetadataOptions,
  ImageResizeOptions,
  ImageCompressOptions,
  QrCodeOptions
} from '../types';
import { ToolIcon } from './ToolIcon';
import { useAuth } from '../context/AuthContext';
import { logUserConversion } from '../services/historyService';
import {
  mergePdfs,
  splitPdf,
  compressPdf,
  imagesToPdf,
  pdfToImages,
  wordToPdf,
  pdfToWord,
  excelToPdf,
  pdfToExcel,
  pptToPdf,
  pdfToPpt,
  txtToPdf,
  processImage,
  addPdfPageNumbers,
  protectPdf,
  getPdfMetadata,
  editPdfMetadata,
  generateQrCode,
  analyzeFile,
  FileDiagnostic,
  formatBytes
} from '../services/conversionEngine';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  initialFile?: File;
  onBack: () => void;
  onSelectOtherTool: (toolId: string) => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  tool,
  initialFile,
  onBack,
  onSelectOtherTool,
}) => {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Conversion state
  const [progress, setProgress] = useState<ConversionProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [diagnostic, setDiagnostic] = useState<FileDiagnostic | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  // Tool Specific Options
  const [splitOptions, setSplitOptions] = useState<SplitOptions>({
    mode: 'all',
    pageRanges: '1-3',
  });
  const [compressOptions, setCompressOptions] = useState<CompressOptions>({
    level: 'medium',
  });
  const [imageToPdfOptions, setImageToPdfOptions] = useState<ImageToPdfOptions>({
    orientation: 'auto',
    pageSize: 'a4',
    margin: 'small',
  });
  const [pageNumberOptions, setPageNumberOptions] = useState<PageNumberOptions>({
    position: 'bottom-center',
    format: 'page-x-of-y',
    startFrom: 1,
    fontSize: 10,
  });
  const [password, setPassword] = useState('');
  const [metadata, setMetadata] = useState<MetadataOptions>({
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
  });
  const [imageResizeOptions, setImageResizeOptions] = useState<ImageResizeOptions>({
    width: 1200,
    height: 800,
    maintainAspectRatio: true,
    format: 'jpg',
    quality: 85,
  });
  const [imageCompressQuality, setImageCompressQuality] = useState(75);
  const [qrOptions, setQrOptions] = useState<QrCodeOptions>({
    text: 'https://example.com',
    format: 'png',
    errorCorrectionLevel: 'M',
    size: 400,
    darkColor: '#1e293b',
    lightColor: '#ffffff',
  });

  // Handle initialFile if passed from hero dropzone
  useEffect(() => {
    if (initialFile) {
      addFiles([initialFile]);
    }
  }, [initialFile]);

  // Load existing metadata if PDF Metadata tool
  useEffect(() => {
    if (tool.id === 'pdf-metadata' && uploadedFiles.length > 0) {
      getPdfMetadata(uploadedFiles[0].file)
        .then(meta => setMetadata(meta))
        .catch(console.error);
    }
    if (tool.id === 'file-size-checker' && uploadedFiles.length > 0) {
      analyzeFile(uploadedFiles[0].file)
        .then(diag => setDiagnostic(diag))
        .catch(console.error);
    }
  }, [tool.id, uploadedFiles]);

  const addFiles = (files: File[]) => {
    setErrorMessage(null);
    const validFiles: UploadedFile[] = [];

    for (const file of files) {
      // Size check
      if (tool.maxSizeMB > 0 && file.size > tool.maxSizeMB * 1024 * 1024) {
        setErrorMessage(`File "${file.name}" exceeds the maximum limit of ${tool.maxSizeMB}MB.`);
        return;
      }

      // Type check (unless wild card '*')
      if (
        tool.acceptedFileTypes.length > 0 &&
        !tool.acceptedFileTypes.includes('*')
      ) {
        const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
        const isMatch = tool.acceptedFileTypes.some(
          t => t.toLowerCase() === ext || file.type.toLowerCase().includes(t.replace('.', ''))
        );
        if (!isMatch) {
          setErrorMessage(
            `Unsupported format for "${file.name}". Please upload ${tool.acceptedFileTypes.join(', ')}.`
          );
          return;
        }
      }

      validFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    if (tool.maxFiles === 1) {
      setUploadedFiles(validFiles.slice(0, 1));
    } else {
      setUploadedFiles(prev => [...prev, ...validFiles].slice(0, tool.maxFiles));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    setResult(null);
    setDiagnostic(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= uploadedFiles.length) return;
    const newFiles = [...uploadedFiles];
    const [moved] = newFiles.splice(index, 1);
    newFiles.splice(targetIndex, 0, moved);
    setUploadedFiles(newFiles);
  };

  // EXECUTE CONVERSION
  const handleStartConversion = async () => {
    if (tool.id !== 'qr-code-generator' && uploadedFiles.length === 0) {
      setErrorMessage('Please select a file to process.');
      return;
    }

    setErrorMessage(null);
    setProgress({ status: 'reading', progress: 5, message: 'Initializing process...' });

    try {
      let res: ConversionResult | null = null;
      const file = uploadedFiles[0]?.file;
      const allRawFiles = uploadedFiles.map(f => f.file);

      switch (tool.id) {
        case 'merge-pdf':
          res = await mergePdfs(allRawFiles, undefined, setProgress);
          break;

        case 'split-pdf':
          res = await splitPdf(file, splitOptions, setProgress);
          break;

        case 'compress-pdf':
          res = await compressPdf(file, compressOptions, setProgress);
          break;

        case 'jpg-to-pdf':
        case 'image-to-pdf':
          res = await imagesToPdf(allRawFiles, imageToPdfOptions, setProgress);
          break;

        case 'pdf-to-jpg':
          res = await pdfToImages(file, 'jpg', setProgress);
          break;

        case 'pdf-to-png':
          res = await pdfToImages(file, 'png', setProgress);
          break;

        case 'word-to-pdf':
          res = await wordToPdf(file, setProgress);
          break;

        case 'pdf-to-word':
          res = await pdfToWord(file, setProgress);
          break;

        case 'excel-to-pdf':
          res = await excelToPdf(file, setProgress);
          break;

        case 'pdf-to-excel':
          res = await pdfToExcel(file, setProgress);
          break;

        case 'ppt-to-pdf':
          res = await pptToPdf(file, setProgress);
          break;

        case 'pdf-to-ppt':
          res = await pdfToPpt(file, setProgress);
          break;

        case 'txt-to-pdf':
          res = await txtToPdf(file, setProgress);
          break;

        case 'jpg-to-png':
          res = await processImage(file, { targetFormat: 'png' }, setProgress);
          break;

        case 'png-to-jpg':
          res = await processImage(file, { targetFormat: 'jpg', fillColor: '#ffffff' }, setProgress);
          break;

        case 'image-compressor':
          res = await processImage(
            file,
            { quality: imageCompressQuality / 100 },
            setProgress
          );
          break;

        case 'image-resizer':
          res = await processImage(
            file,
            {
              width: imageResizeOptions.width,
              height: imageResizeOptions.height,
              maintainAspectRatio: imageResizeOptions.maintainAspectRatio,
              targetFormat: imageResizeOptions.format,
              quality: imageResizeOptions.quality / 100,
            },
            setProgress
          );
          break;

        case 'image-converter':
          res = await processImage(
            file,
            { targetFormat: imageResizeOptions.format },
            setProgress
          );
          break;

        case 'qr-code-generator':
          res = await generateQrCode(qrOptions, setProgress);
          break;

        case 'pdf-page-numbering':
          res = await addPdfPageNumbers(file, pageNumberOptions, setProgress);
          break;

        case 'password-protect-pdf':
          res = await protectPdf(file, password || 'protected', setProgress);
          break;

        case 'unlock-pdf':
          res = await protectPdf(file, '', setProgress);
          break;

        case 'pdf-metadata':
          res = await editPdfMetadata(file, metadata, setProgress);
          break;

        case 'file-size-checker':
          const diag = await analyzeFile(file);
          setDiagnostic(diag);
          setProgress({ status: 'completed', progress: 100, message: 'Analysis complete!' });
          return;

        default:
          throw new Error('This tool feature is in development.');
      }

      if (res) {
        setResult(res);
        if (user && user.uid) {
          logUserConversion({
            userId: user.uid,
            toolId: tool.id,
            toolName: tool.name,
            fileName: file ? file.name : (tool.id === 'qr-code-generator' ? 'qr-code.png' : 'document'),
            fileSize: file ? file.size : res.fileSize,
            outputName: res.fileName,
            category: tool.category,
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setProgress({
        status: 'error',
        progress: 0,
        message: 'Conversion failed',
        error: err?.message || 'An unexpected error occurred during conversion.',
      });
      setErrorMessage(err?.message || 'Failed to process file. Please try another file.');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.downloadUrl;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetAll = () => {
    setUploadedFiles([]);
    setResult(null);
    setDiagnostic(null);
    setProgress({ status: 'idle', progress: 0, message: '' });
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            id="workspace-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tools</span>
          </button>

          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            {tool.category} Tool
          </span>
        </div>

        {/* Tool Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-6 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xs">
            <ToolIcon name={tool.icon} className="h-8 w-8" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                {tool.name}
              </h1>
              {tool.badge && (
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              {tool.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Private & In-Browser</span>
              </div>
              {tool.maxSizeMB > 0 && (
                <span>• Max size: {tool.maxSizeMB}MB</span>
              )}
              {tool.maxFiles > 1 && (
                <span>• Up to {tool.maxFiles} files</span>
              )}
            </div>
          </div>
        </div>

        {/* ERROR BANNER */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Notice</p>
              <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 font-bold text-xs p-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* MAIN INTERACTION CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          
          {/* STEP 1: UPLOAD AREA (If not QR generator and no file chosen or can add more) */}
          {tool.id !== 'qr-code-generator' && (
            <div>
              {uploadedFiles.length === 0 ? (
                <div
                  id="workspace-file-dropzone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-14 text-center transition-all ${
                    isDragging
                      ? 'border-red-500 bg-red-50/60'
                      : 'border-slate-300 hover:border-red-400 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple={tool.maxFiles > 1}
                    className="hidden"
                    onChange={e => {
                      if (e.target.files) addFiles(Array.from(e.target.files));
                    }}
                  />
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800">
                    Drop your {tool.name.includes('PDF') ? 'PDF' : 'file'} here
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    or <span className="font-semibold text-red-600">Choose File</span> from device
                  </p>
                  <p className="mt-3 text-[11px] text-slate-400">
                    Supported: {tool.acceptedFileTypes.join(', ')}
                  </p>
                </div>
              ) : (
                /* FILE LIST & DETAILS */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">
                      Selected Files ({uploadedFiles.length}{tool.maxFiles > 1 ? ` / ${tool.maxFiles}` : ''})
                    </h3>
                    {tool.maxFiles > 1 && uploadedFiles.length < tool.maxFiles && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        + Add More Files
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple={tool.maxFiles > 1}
                      className="hidden"
                      onChange={e => {
                        if (e.target.files) addFiles(Array.from(e.target.files));
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    {uploadedFiles.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100/80 text-red-600 font-bold text-xs">
                            {idx + 1}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {formatBytes(item.size)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {tool.id === 'merge-pdf' && uploadedFiles.length > 1 && (
                            <>
                              <button
                                onClick={() => moveFile(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                title="Move up"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => moveFile(idx, 'down')}
                                disabled={idx === uploadedFiles.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                title="Move down"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => removeFile(item.id)}
                            className="rounded p-1 text-slate-400 hover:text-red-600 transition"
                            title="Remove file"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: TOOL SPECIFIC SETTINGS */}
          {(uploadedFiles.length > 0 || tool.id === 'qr-code-generator') && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Settings2 className="h-4 w-4" />
                <span>Conversion Settings</span>
              </div>

              {/* SPLIT SETTINGS */}
              {tool.id === 'split-pdf' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Split Mode
                    </label>
                    <select
                      value={splitOptions.mode}
                      onChange={e => setSplitOptions({ ...splitOptions, mode: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    >
                      <option value="all">Extract all pages into separate PDFs (ZIP)</option>
                      <option value="range">Extract specific page range</option>
                    </select>
                  </div>
                  {splitOptions.mode === 'range' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Page Range (e.g. 1-3, 5)
                      </label>
                      <input
                        type="text"
                        value={splitOptions.pageRanges}
                        onChange={e => setSplitOptions({ ...splitOptions, pageRanges: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                        placeholder="1-3, 5"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* COMPRESS PDF SETTINGS */}
              {tool.id === 'compress-pdf' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Compression Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'low', label: 'Basic Compression', desc: 'Slight reduction, highest fidelity' },
                      { id: 'medium', label: 'Recommended', desc: 'Good compression, sharp quality' },
                      { id: 'high', label: 'Extreme', desc: 'Maximum file size reduction' },
                    ].map(lvl => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setCompressOptions({ level: lvl.id as any })}
                        className={`rounded-xl border p-3 text-left transition ${
                          compressOptions.level === lvl.id
                            ? 'border-red-600 bg-red-50/50 ring-1 ring-red-600'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">{lvl.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{lvl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* IMAGE TO PDF SETTINGS */}
              {(tool.id === 'jpg-to-pdf' || tool.id === 'image-to-pdf') && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Orientation
                    </label>
                    <select
                      value={imageToPdfOptions.orientation}
                      onChange={e => setImageToPdfOptions({ ...imageToPdfOptions, orientation: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    >
                      <option value="auto">Auto (Match image)</option>
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Size
                    </label>
                    <select
                      value={imageToPdfOptions.pageSize}
                      onChange={e => setImageToPdfOptions({ ...imageToPdfOptions, pageSize: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    >
                      <option value="a4">Standard A4</option>
                      <option value="letter">US Letter</option>
                      <option value="fit">Fit to Image Size</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Margin
                    </label>
                    <select
                      value={imageToPdfOptions.margin}
                      onChange={e => setImageToPdfOptions({ ...imageToPdfOptions, margin: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    >
                      <option value="none">No Margin</option>
                      <option value="small">Small Margin</option>
                      <option value="large">Big Margin</option>
                    </select>
                  </div>
                </div>
              )}

              {/* IMAGE COMPRESSOR SETTINGS */}
              {tool.id === 'image-compressor' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Target Quality</span>
                    <span className="font-bold text-red-600">{imageCompressQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={imageCompressQuality}
                    onChange={e => setImageCompressQuality(parseInt(e.target.value, 10))}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Smaller file (~70% reduction)</span>
                    <span>Balanced</span>
                    <span>High quality (~20% reduction)</span>
                  </div>
                </div>
              )}

              {/* IMAGE RESIZER SETTINGS */}
              {tool.id === 'image-resizer' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={imageResizeOptions.width}
                      onChange={e => setImageResizeOptions({ ...imageResizeOptions, width: parseInt(e.target.value, 10) || 0 })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={imageResizeOptions.height}
                      onChange={e => setImageResizeOptions({ ...imageResizeOptions, height: parseInt(e.target.value, 10) || 0 })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Format
                    </label>
                    <select
                      value={imageResizeOptions.format}
                      onChange={e => setImageResizeOptions({ ...imageResizeOptions, format: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800"
                    >
                      <option value="jpg">JPG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>
                </div>
              )}

              {/* QR CODE GENERATOR SETTINGS */}
              {tool.id === 'qr-code-generator' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      QR Content (URL, Text, or WiFi)
                    </label>
                    <input
                      type="text"
                      value={qrOptions.text}
                      onChange={e => setQrOptions({ ...qrOptions, text: e.target.value })}
                      placeholder="https://example.com or your message"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Export Format
                      </label>
                      <select
                        value={qrOptions.format}
                        onChange={e => setQrOptions({ ...qrOptions, format: e.target.value as any })}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800"
                      >
                        <option value="png">Crisp PNG</option>
                        <option value="svg">Vector SVG</option>
                        <option value="pdf">Printable PDF</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        QR Color
                      </label>
                      <input
                        type="color"
                        value={qrOptions.darkColor}
                        onChange={e => setQrOptions({ ...qrOptions, darkColor: e.target.value })}
                        className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer p-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Error Correction
                      </label>
                      <select
                        value={qrOptions.errorCorrectionLevel}
                        onChange={e => setQrOptions({ ...qrOptions, errorCorrectionLevel: e.target.value as any })}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800"
                      >
                        <option value="L">Low (7%)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF PAGE NUMBERING */}
              {tool.id === 'pdf-page-numbering' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Position
                    </label>
                    <select
                      value={pageNumberOptions.position}
                      onChange={e => setPageNumberOptions({ ...pageNumberOptions, position: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    >
                      <option value="bottom-center">Bottom Center</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-center">Top Center</option>
                      <option value="top-right">Top Right</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Format Style
                    </label>
                    <select
                      value={pageNumberOptions.format}
                      onChange={e => setPageNumberOptions({ ...pageNumberOptions, format: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                    >
                      <option value="page-x-of-y">Page 1 of N</option>
                      <option value="x-of-y">1 / N</option>
                      <option value="only-x">1 (Single number)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* PASSWORD PROTECT */}
              {(tool.id === 'password-protect-pdf' || tool.id === 'unlock-pdf') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {tool.id === 'password-protect-pdf' ? 'Set Password' : 'PDF Password'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                  />
                </div>
              )}

              {/* PDF METADATA */}
              {tool.id === 'pdf-metadata' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Title</label>
                    <input
                      type="text"
                      value={metadata.title}
                      onChange={e => setMetadata({ ...metadata, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Author</label>
                    <input
                      type="text"
                      value={metadata.author}
                      onChange={e => setMetadata({ ...metadata, author: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Subject</label>
                    <input
                      type="text"
                      value={metadata.subject}
                      onChange={e => setMetadata({ ...metadata, subject: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Keywords</label>
                    <input
                      type="text"
                      value={metadata.keywords}
                      onChange={e => setMetadata({ ...metadata, keywords: e.target.value })}
                      placeholder="comma separated"
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: ACTION BUTTON */}
          {(uploadedFiles.length > 0 || tool.id === 'qr-code-generator') && progress.status !== 'processing' && !result && (
            <div className="mt-8 pt-4">
              <button
                id="workspace-convert-action-btn"
                onClick={handleStartConversion}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 py-3.5 px-6 text-sm font-bold text-white shadow-md transition-all active:scale-98"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {tool.id === 'qr-code-generator' ? 'Generate QR Code' : `Start ${tool.name}`}
                </span>
              </button>
            </div>
          )}

          {/* STEP 4: PROCESSING STATUS & PROGRESS BAR */}
          {progress.status === 'processing' || progress.status === 'reading' ? (
            <div className="mt-8 pt-4 text-center">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>{progress.message || 'Processing your document...'}</span>
                <span className="text-red-600 font-bold">{progress.progress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-red-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Processing locally in your browser memory. No data is stored.
              </p>
            </div>
          ) : null}

          {/* STEP 5: RESULTS & DOWNLOAD */}
          {result && (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Conversion Complete!
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 truncate max-w-xs sm:max-w-md">
                      {result.fileName} • <span className="font-semibold">{formatBytes(result.fileSize)}</span>
                      {result.originalSize && result.originalSize > result.fileSize && (
                        <span className="ml-1 text-emerald-700 font-bold">
                          (-{Math.round(((result.originalSize - result.fileSize) / result.originalSize) * 100)}% smaller)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto">
                  <button
                    id="workspace-download-btn"
                    onClick={handleDownload}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download File</span>
                  </button>

                  {result.mimeType === 'application/pdf' && (
                    <button
                      onClick={() => setPreviewModalUrl(result.downloadUrl)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                  )}

                  <button
                    onClick={resetAll}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Convert Another</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DIAGNOSTIC RESULT (File Size Checker) */}
          {diagnostic && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-600" />
                <span>File Diagnostics & Analysis</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Exact Size</span>
                  <span className="font-bold text-slate-900">{diagnostic.sizeFormatted}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Format / Ext</span>
                  <span className="font-bold text-slate-900">{diagnostic.extension}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Est. Reduction</span>
                  <span className="font-bold text-emerald-600">{diagnostic.potentialReduction}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">MIME Type</span>
                  <span className="font-mono text-[10px] text-slate-700 truncate block">{diagnostic.mimeType}</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-800">Recommendation: </span>
                <span className="text-slate-600">{diagnostic.recommendation}</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* PDF PREVIEW MODAL */}
      {previewModalUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div 
            className="w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-900">Document Preview</span>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 w-full bg-slate-100">
              <iframe
                src={previewModalUrl}
                className="w-full h-full border-none"
                title="PDF Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
