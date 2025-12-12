
export type Mode = 'create' | 'edit';
export type CreateFunction = 'free' | 'sticker' | 'text' | 'comic' | 'thumbnail' | 'start-end-video' | 'character' | 'instagram' | 'fitting-room';
export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose' | 'remove-background' | 'remove-watermark';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5';

export interface ImageData {
  file: File;
  previewUrl: string;
}

export interface GeneratedMedia {
  url: string;
  type: 'image' | 'video';
}

export interface GenerationHistoryItem {
  id: number;
  image_path: string;
  prompt: string;
  created_at: string;
  options: any;
}