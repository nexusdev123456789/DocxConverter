import React from 'react';
import {
  FileText,
  Combine,
  Scissors,
  FileDown,
  FileType2,
  Images,
  Image,
  ImageDown,
  Sheet,
  Table,
  Presentation,
  Layers,
  Shrink,
  Scaling,
  RefreshCw,
  FileOutput,
  FileImage,
  ArrowLeftRight,
  AlignLeft,
  QrCode,
  Binary,
  Lock,
  Unlock,
  FileCode2,
  Gauge,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Combine,
  Scissors,
  FileDown,
  FileText,
  FileType2,
  Images,
  Image,
  ImageDown,
  Sheet,
  Table,
  Presentation,
  Layers,
  Shrink,
  Scaling,
  RefreshCw,
  FileOutput,
  FileImage,
  ArrowLeftRight,
  AlignLeft,
  QrCode,
  Binary,
  Lock,
  Unlock,
  FileCode2,
  Gauge,
};

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent className={className} />;
};
