export type ToolCategory = 'pdf' | 'image' | 'document' | 'utility';

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  shortDesc: string;
  icon: string;
  badge?: string;
  isPopular?: boolean;
  acceptedFileTypes: string[]; // e.g. ['.pdf'], ['.jpg', '.png']
  acceptedMimeTypes: string[];
  maxFiles: number; // 1 for single file tools, >1 for merge/batch
  maxSizeMB: number;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  pageCount?: number;
}

export interface ConversionResult {
  blob: Blob;
  fileName: string;
  fileSize: number;
  originalSize?: number;
  mimeType: string;
  downloadUrl: string;
  previewUrl?: string;
  pageCount?: number;
  isZip?: boolean;
}

export type ConversionStatus = 'idle' | 'reading' | 'processing' | 'completed' | 'error';

export interface ConversionProgress {
  status: ConversionStatus;
  progress: number; // 0 - 100
  message: string;
  error?: string;
}

// Tool Specific Options
export interface MergeOptions {
  filesOrder: string[]; // IDs
}

export interface SplitOptions {
  mode: 'all' | 'range' | 'extract';
  pageRanges: string; // e.g. "1-3, 5"
}

export interface CompressOptions {
  level: 'low' | 'medium' | 'high'; // high = max compression
}

export interface ImageToPdfOptions {
  orientation: 'portrait' | 'landscape' | 'auto';
  pageSize: 'a4' | 'letter' | 'fit';
  margin: 'none' | 'small' | 'large';
}

export interface PageNumberOptions {
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
  format: 'page-x-of-y' | 'x-of-y' | 'only-x';
  startFrom: number;
  fontSize: number;
}

export interface PasswordProtectOptions {
  userPassword: string;
  ownerPassword?: string;
}

export interface UnlockPdfOptions {
  password?: string;
}

export interface MetadataOptions {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
}

export interface ImageResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  format: 'jpg' | 'png' | 'webp';
  quality: number; // 10 to 100
}

export interface ImageCompressOptions {
  quality: number; // 10 to 100
  format: 'original' | 'jpg' | 'webp';
}

export interface QrCodeOptions {
  text: string;
  format: 'png' | 'svg' | 'pdf';
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  size: number;
  darkColor: string;
  lightColor: string;
}
