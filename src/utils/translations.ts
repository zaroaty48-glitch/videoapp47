import { Language } from '../types';

export const translations = {
  ar: {
    appName: 'كليب كرافت',
    appTagline: 'محرر الفيديو الاحترافي للأندرويد',
    home: 'الرئيسية',
    newProject: 'مشروع جديد',
    importVideo: 'إستيراد فيديو',
    exportHistory: 'سجل التصدير',
    recentProjects: 'المشاريع الأخيرة',
    noProjectsYet: 'لا توجد مشاريع سابقة، ابدأ بإنشاء مشروع جديد!',
    clips: 'مقاطع',
    seconds: 'ثانية',
    lastEdited: 'آخر تعديل',
    openProject: 'فتح المشروع',
    duplicateProject: 'نسخ المشروع',
    deleteProject: 'حذف المشروع',
    
    // Editor Header & Controls
    editMode: 'محرر',
    enhancements: 'تحسين الفيديو الذكي',
    export: 'تصدير',
    androidCode: 'كود Kotlin',
    undo: 'تراجع',
    redo: 'إعادة',
    split: 'قص / تقسيم',
    delete: 'حذف',
    duplicate: 'تكرار',
    play: 'تشغيل',
    pause: 'إيقاف',
    speed: 'السرعة',
    volume: 'الصوت',
    
    // CapCut Tools Menu
    tools: {
      edit: 'تعديل',
      audio: 'الصوت',
      text: 'النصوص',
      stickers: 'ملصقات',
      effects: 'تأثيرات',
      transitions: 'انتقالات',
      enhancement: 'تحسين AI',
      filters: 'فلاتر',
      chroma: 'كروما',
    },
    
    // Enhancement Suite Labels
    aiEnhancementsTitle: 'محرك تحسين الفيديو الذكي (AI Enhancer)',
    sharpness: 'حدّة الفيديو (Sharpness)',
    smoothing: 'تنعيم البشرة والحواف (Smoothing)',
    noiseReduction: 'إزالة الضوضاء (Noise Reduction)',
    clarity: 'وضوح التفاصيل (Clarity)',
    superResolution: 'الدقة الفائقة الذكية (Super Resolution 4K/8K)',
    flickerReduction: 'تقليل الوميض والطرف (Anti-Flicker)',
    frameInterpolation: 'تنعيم الحركة (Frame Interpolation 60➔120fps)',
    filterPresets: 'فلاتر الألوان الاحترافية',
    
    // Filter Names
    filters: {
      none: 'بدون',
      cinematic: 'سينمائي عريض',
      vibrant: 'مشرق وزاهي',
      warm_golden: 'ذهبي دافئ',
      portrait_glow: 'توهج البورتريه',
      vintage_film: 'فيلم كلاسيكي',
      cyber_neon: 'نيون مستقبلي',
      monochrome: 'أبيض وأسود درامي',
    },
    
    // Export Modal
    exportTitle: 'تصدير الفيديو (Export Settings)',
    resolution: 'دقة الفيديو (Resolution)',
    fps: 'معدل الإطارات (FPS)',
    bitrate: 'معدل البت (Bitrate)',
    hardwareAccel: 'تسريع العتاد (Hardware Acceleration)',
    renderProgress: 'جاري معالجة وتصدير الفيديو...',
    renderComplete: 'تم التصدير بنجاح وحفظ الفيديو في المعرض!',
    saveToGallery: 'حفظ في معرض الصور (Gallery)',
    estimatedSize: 'الحجم التقديري',
    estimatedTime: 'الوقت المتبقي',
    
    // Device Stats
    deviceCapabilitiesTitle: 'مواصفات جهاز الأندرويد',
    gpuDetected: 'معالج الرسومات',
    maxResSupported: 'أعلى دقة مدعومة',
    maxFpsSupported: 'أعلى معدل إطارات',
    hwStatus: 'تسريع العتاد متوفر',
    fallbackNotice: 'إذا كانت دقة 8K أو 120 FPS غير مدعومة على جهازك، فسيتم التحويل التلقائي لأعلى دقة مدعومة.',
    
    // Android Compose Code Viewer
    codeViewerTitle: 'كود أندرويد بلغة Kotlin و Jetpack Compose',
    codeViewerDesc: 'معمارية نصرة جاهزة للاستخدام في Android Studio مع دوال التعتيم والتنعيم والتصدير الهاردويري.',
    copyCode: 'نسخ الكود',
    codeCopied: 'تم نسخ الكود!',
  },
  en: {
    appName: 'ClipCraft',
    appTagline: 'Professional Android Video Editor',
    home: 'Home',
    newProject: 'New Project',
    importVideo: 'Import Video',
    exportHistory: 'Export History',
    recentProjects: 'Recent Projects',
    noProjectsYet: 'No recent projects. Start by creating a new one!',
    clips: 'clips',
    seconds: 'sec',
    lastEdited: 'Last edited',
    openProject: 'Open Project',
    duplicateProject: 'Duplicate Project',
    deleteProject: 'Delete Project',
    
    // Editor Header & Controls
    editMode: 'Editor',
    enhancements: 'AI Enhancement',
    export: 'Export',
    androidCode: 'Kotlin Code',
    undo: 'Undo',
    redo: 'Redo',
    split: 'Split',
    delete: 'Delete',
    duplicate: 'Duplicate',
    play: 'Play',
    pause: 'Pause',
    speed: 'Speed',
    volume: 'Volume',
    
    // CapCut Tools Menu
    tools: {
      edit: 'Edit',
      audio: 'Audio',
      text: 'Text',
      stickers: 'Stickers',
      effects: 'Effects',
      transitions: 'Transitions',
      enhancement: 'AI Enhancer',
      filters: 'Filters',
      chroma: 'Chroma',
    },
    
    // Enhancement Suite Labels
    aiEnhancementsTitle: 'AI Video Enhancement Engine',
    sharpness: 'Video Sharpness',
    smoothing: 'Skin & Edge Smoothing',
    noiseReduction: 'Noise Reduction',
    clarity: 'Clarity Enhancement',
    superResolution: 'Super Resolution (4K/8K AI)',
    flickerReduction: 'Flicker & Strobe Reduction',
    frameInterpolation: 'Motion Interpolation (60➔120 FPS)',
    filterPresets: 'Professional Color Filters',
    
    // Filter Names
    filters: {
      none: 'None',
      cinematic: 'Cinematic Anamorphic',
      vibrant: 'Vibrant Colors',
      warm_golden: 'Warm Golden Hour',
      portrait_glow: 'Portrait Soft Glow',
      vintage_film: 'Vintage 35mm Film',
      cyber_neon: 'Cyberpunk Neon',
      monochrome: 'Dramatic Black & White',
    },
    
    // Export Modal
    exportTitle: 'Export Settings',
    resolution: 'Video Resolution',
    fps: 'Frame Rate (FPS)',
    bitrate: 'Bitrate Quality',
    hardwareAccel: 'Hardware Acceleration',
    renderProgress: 'Processing & Exporting Video...',
    renderComplete: 'Export successful! Saved to device gallery.',
    saveToGallery: 'Save to Device Gallery',
    estimatedSize: 'Est. Size',
    estimatedTime: 'Est. Time',
    
    // Device Stats
    deviceCapabilitiesTitle: 'Android Hardware Capabilities',
    gpuDetected: 'Detected GPU',
    maxResSupported: 'Max Resolution',
    maxFpsSupported: 'Max Frame Rate',
    hwStatus: 'Hardware Acceleration Ready',
    fallbackNotice: 'If 8K or 120 FPS is unsupported by the chipset, hardware fallback dynamically selects the highest supported profile.',
    
    // Android Compose Code Viewer
    codeViewerTitle: 'Kotlin & Jetpack Compose Native Code',
    codeViewerDesc: 'Modular architecture ready for Android Studio with OpenCV/MediaCodec hardware pipeline placeholders.',
    copyCode: 'Copy Kotlin Code',
    codeCopied: 'Code Copied!',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.ar;
}
