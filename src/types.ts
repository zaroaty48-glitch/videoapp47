export type Language = 'ar' | 'en';

export type ClipType = 'video' | 'audio' | 'text' | 'effect' | 'image';
export type TrackType = 'video' | 'overlay' | 'text' | 'audio' | 'effect';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type SidebarTab = 'media' | 'templates' | 'captions' | 'effects' | 'chroma' | 'keyframes' | 'speed';

export type KeyframeProperty =
  | 'positionX'
  | 'positionY'
  | 'scale'
  | 'opacity'
  | 'rotation'
  | 'blur'
  | 'volume';

export interface KeyframePoint {
  id: string;
  time: number; // time in seconds relative to clip start
  value: number;
}

export type KeyframeMap = {
  [K in KeyframeProperty]?: KeyframePoint[];
};

export interface ChromaKeySettings {
  enabled: boolean;
  color: string; // hex string e.g. '#00ff00'
  distance: number; // 0.05 to 0.8
  smoothness: number; // 0 to 0.5
  spill: number; // 0 to 1
}

export interface ClipTransform {
  x: number; // percentage offset -50 to 50
  y: number; // percentage offset -50 to 50
  scale: number; // 0.1 to 3.0
  rotation: number; // degrees -180 to 180
  opacity: number; // 0 to 1
  zIndex: number;
}

export type CaptionPreset = 'viral' | 'minimal' | 'neon' | 'karaoke' | 'boxed' | 'cinematic';

export interface CaptionStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  bgColor: string;
  strokeColor: string;
  strokeWidth: number;
  preset: CaptionPreset;
  positionY: number; // 0-100 percentage from top
  highlightColor?: string;
}

export type EffectType =
  | 'none'
  | 'vhs'
  | 'glitch'
  | 'film_grain'
  | 'cyberpunk'
  | 'vignette'
  | 'noir'
  | 'teal_orange'
  | 'bokeh'
  | 'light_leak'
  | 'blur';

export type TransitionType =
  | 'none'
  | 'fade'
  | 'cross_dissolve'
  | 'wipe_left'
  | 'zoom_punch'
  | 'glitch_flash';

export interface VideoEnhancements {
  sharpness: number; // 0 to 100
  smoothing: number; // 0 to 100 (skin & edge blur)
  noiseReduction: number; // 0 to 100
  clarity: number; // 0 to 100
  superResolution: boolean; // 2x/4x AI upscaling
  flickerReduction: boolean; // Anti-blink & strobe fix
  frameInterpolation: boolean; // 60 -> 120 fps Optical Flow
  targetFps: 30 | 60 | 120;
  filterPreset: 'none' | 'cinematic' | 'vibrant' | 'warm_golden' | 'portrait_glow' | 'vintage_film' | 'cyber_neon' | 'monochrome';
  filterIntensity: number; // 0 to 100
}

export interface Clip {
  id: string;
  trackId: string;
  name: string;
  type: ClipType;
  startInTimeline: number; // Start time in seconds on timeline
  duration: number; // Effective duration on timeline in seconds
  sourceStart: number; // Start offset within original media source in seconds
  sourceDuration: number; // Full length of source media in seconds
  sourceUrl?: string; // Video/audio/image URL
  
  // Audio properties
  volume: number; // 0 to 1
  muted?: boolean;
  
  // Speed control
  speed: number; // 0.25 to 10.0
  
  // Visual properties
  transform: ClipTransform;
  chromaKey: ChromaKeySettings;
  keyframes: KeyframeMap;
  effectType: EffectType;
  effectIntensity: number; // 0 to 1
  
  // Transitions
  transitionIn?: TransitionType;
  transitionOut?: TransitionType;
  transitionDuration?: number;
  
  // Text & Captions specific
  text?: string;
  captionStyle?: CaptionStyle;
  wordTimestamps?: { word: string; start: number; end: number }[];
  
  // Color adjustment
  brightness?: number; // -100 to 100
  contrast?: number; // -100 to 100
  saturation?: number; // -100 to 100
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  locked: boolean;
  muted: boolean;
  visible: boolean;
  clips: Clip[];
}

export interface ProjectTemplate {
  id: string;
  title: string;
  category: 'Viral Short' | 'Cinematic' | 'Product Demo' | 'Gaming' | 'Podcast';
  description: string;
  duration: number;
  aspectRatio: AspectRatio;
  thumbnail: string;
  tracks: Track[];
}

export interface StockAsset {
  id: string;
  title: string;
  type: ClipType;
  category: 'Sample Video' | 'Green Screen' | 'Background' | 'Music' | 'SFX' | 'Overlay' | 'Sticker';
  url: string;
  duration: number;
  thumbnail?: string;
  description?: string;
}

export type ExportResolution = '1080p' | '2K' | '4K' | '8K';
export type ExportFps = 30 | 60 | 120;
export type BitrateMode = 'low' | 'medium' | 'high' | 'custom';

export interface ExportSettings {
  format: 'mp4' | 'mov' | 'webm';
  resolution: ExportResolution;
  fps: ExportFps;
  bitrateMode: BitrateMode;
  customBitrateMbps: number; // e.g. 50 Mbps
  useHardwareAcceleration: boolean;
  aspectRatio: AspectRatio;
  enhanceBeforeExport: boolean;
}

export interface ExportHistoryRecord {
  id: string;
  projectTitle: string;
  date: string;
  durationSeconds: number;
  resolution: ExportResolution;
  fps: ExportFps;
  bitrateMbps: number;
  fileSizeBytes: number;
  thumbnailUrl: string;
  downloadUrl?: string;
}

export interface SavedProject {
  id: string;
  title: string;
  lastEdited: string;
  durationSeconds: number;
  clipCount: number;
  thumbnailUrl: string;
  tracks: Track[];
  aspectRatio: AspectRatio;
  enhancements: VideoEnhancements;
}

export interface DeviceCapabilities {
  gpuName: string;
  supportsHardwareAccel: boolean;
  maxSupportedResolution: ExportResolution;
  maxSupportedFps: ExportFps;
  supportsFrameInterpolation120fps: boolean;
  supportsSuperResolution8K: boolean;
  ramGB: number;
}

