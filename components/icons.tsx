
import React from 'react';

// Fix: Add explicit type for defaultProps to ensure compatibility with SVGProps.
const defaultProps: React.SVGProps<SVGSVGElement> = {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "w-6 h-6"
};

export const PromptIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="M4 19h16M6 3h12v14H6z"/><path d="M8 7h8M8 11h8"/>
  </svg>
);

export const StickerIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="M7 3h7l7 7v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z"/>
    <path d="M14 3v5a2 2 0 0 0 2 2h5"/>
  </svg>
);

export const LogoIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="M4 6h16M10 6v12M14 6v12M6 18h12"/>
  </svg>
);

export const ComicIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="M3 5h12v10H3z"/><path d="M15 7l6-2v10l-6 2z"/><path d="M5 9h8M5 12h6"/>
  </svg>
);

export const ThumbnailIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} className={className || defaultProps.className}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M10 10l6 4-6 4V10z" fill="currentColor" />
    </svg>
);

export const InstagramIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} className={className || defaultProps.className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

export const HangerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} className={className || defaultProps.className}>
        <path d="M12 2a4 4 0 0 0-4 4H4v3s2 2 4 4v7h16v-7c2-2 4-4 4-4V6h-4a4 4 0 0 0-4-4Z"/>
        <path d="M12 2v10" strokeWidth="1.5"/>
    </svg>
);

export const VideoIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="m22 8-6 4 6 4V8Z"/>
    <rect x="2" y="6" width="14" height="12" rx="2" ry="2"/>
  </svg>
);

export const AddRemoveIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

export const RetouchIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="M2 22l6-6"/><path d="M3 16l5 5"/><path d="M14.5 2.5l7 7-9.5 9.5H5v-7z"/>
  </svg>
);

export const StyleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a7 7 0 1 1-10.8-8.4"/>
  </svg>
);

export const ComposeIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <rect x="3" y="7" width="10" height="10" rx="1"/><rect x="11" y="3" width="10" height="10" rx="1"/>
  </svg>
);

export const RemoveBgIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} className={className || defaultProps.className}>
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>
        <path d="m14 7 3 3"/>
        <path d="M5 6v4"/>
        <path d="M19 14v4"/>
        <path d="M10 2v2"/>
        <path d="M7 8H3"/>
        <path d="M21 16h-4"/>
        <path d="M11 3H9"/>
    </svg>
);

export const WatermarkIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7z" />
    <path d="m3 3 18 18" />
  </svg>
);

export const MagicWandIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} className={className || defaultProps.className}>
        <path d="M2 21h6" />
        <path d="M5 18v3" />
        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L7 21l-4-4 15.5-15.5z" />
    </svg>
);

export const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} strokeWidth="1.5" className={className || 'w-8 h-8 text-gray-500'}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

export const ImageIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} strokeWidth="1.5" className={className || 'w-16 h-16'}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

export const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} strokeWidth="2" className={className || 'w-5 h-5'}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export const ErrorIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} strokeWidth="1.5" className={className || 'w-16 h-16'}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export const AspectRatioSquareIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} strokeWidth="2" className={className || 'w-6 h-6'}>
      <rect x="4" y="4" width="16" height="16" rx="1"/>
    </svg>
);

export const AspectRatioLandscapeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} strokeWidth="2" className={className || 'w-6 h-6'}>
      <rect x="3" y="6" width="18" height="12" rx="1"/>
    </svg>
);

export const AspectRatioPortraitIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} strokeWidth="2" className={className || 'w-6 h-6'}>
      <rect x="6" y="3" width="12" height="18" rx="1"/>
    </svg>
);

export const ViewIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const CompareSliderIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} strokeWidth="2" className={className || "w-6 h-6"}>
        <path d="m9 17-5-5 5-5" />
        <path d="m15 17 5-5-5-5" />
    </svg>
);

export const BrushIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
  </svg>
);

export const UndoIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

export const CheckIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...defaultProps} className={className || defaultProps.className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const CharacterIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...defaultProps} className={className || defaultProps.className}>
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 14a7.5 7.5 0 0 0 13 0" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
    </svg>
);