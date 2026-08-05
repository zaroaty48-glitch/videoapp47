export interface VisualEffect {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'cinematic' | 'social_media' | 'neon' | 'clean_enhancement' | 'slow_motion' | 'transitions';
  packNameAr: string;
  packNameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  previewBg: string; // CSS gradient for preview thumbnail
  parameters: {
    blur?: number; // 0 to 100
    sharpen?: number; // 0 to 100
    brightness?: number; // -100 to 100
    contrast?: number; // -100 to 100
    saturation?: number; // -100 to 100
    glitch?: number; // 0 to 100
    vignette?: number; // 0 to 100
    colorGrade?: 'teal_orange' | 'cyberpunk' | 'vintage_film' | 'noir' | 'golden_hour' | 'none';
    speedMultiplier?: number; // 0.25, 0.5, 1.0, 2.0
    transitionType?: string;
  };
}

export const EFFECTS_LIBRARY: VisualEffect[] = [
  // --- CINEMATIC PACK ---
  {
    id: 'teal_orange_grade',
    nameAr: 'تلوين سينمائي (Teal & Orange)',
    nameEn: 'Teal & Orange Cinematic',
    category: 'cinematic',
    packNameAr: 'حزمة السينما الاحترافية',
    packNameEn: 'Cinematic Pack',
    descriptionAr: 'تلوين هوليوودي احترافي يبرز البشرة مع خلفية زرقاء سينمائية',
    descriptionEn: 'Hollywood blockbuster look with warm skintones and teal shadows',
    icon: '🎬',
    previewBg: 'linear-gradient(135deg, #00b4d8 0%, #f77f00 100%)',
    parameters: { colorGrade: 'teal_orange', contrast: 20, saturation: 15, vignette: 40 }
  },
  {
    id: 'cinematic_vignette',
    nameAr: 'فيغنيت سينمائي (Vignette)',
    nameEn: 'Cinematic Vignette',
    category: 'cinematic',
    packNameAr: 'حزمة السينما الاحترافية',
    packNameEn: 'Cinematic Pack',
    descriptionAr: 'تظليل دافئ لأطراف الفيديو لإبراز التركيز على المنتصف',
    descriptionEn: 'Darkened border focus gradient for dramatic storytelling',
    icon: '⭕',
    previewBg: 'radial-gradient(circle, #27272a 30%, #000000 100%)',
    parameters: { vignette: 75, contrast: 10 }
  },
  {
    id: 'vintage_35mm',
    nameAr: 'فيلم كلاسيكي 35mm',
    nameEn: '35mm Vintage Film',
    category: 'cinematic',
    packNameAr: 'حزمة السينما الاحترافية',
    packNameEn: 'Cinematic Pack',
    descriptionAr: 'مظهر الأفلام الكلاسيكية مع حبوب الفيلم الدافئة ولمسة ريترو',
    descriptionEn: 'Warm analog film grain texture with vintage tone curves',
    icon: '🎞️',
    previewBg: 'linear-gradient(135deg, #d4a373 0%, #faedcd 100%)',
    parameters: { colorGrade: 'vintage_film', contrast: 15, saturation: -10, vignette: 30 }
  },
  {
    id: 'noir_dramatic',
    nameAr: 'أبيض وأسود درامي (Noir)',
    nameEn: 'Dramatic Film Noir',
    category: 'cinematic',
    packNameAr: 'حزمة السينما الاحترافية',
    packNameEn: 'Cinematic Pack',
    descriptionAr: 'تباين عالي باللونين الأبيض والأسود مع ظلال عميقة',
    descriptionEn: 'High-contrast black & white moody cinema grade',
    icon: '🕶️',
    previewBg: 'linear-gradient(135deg, #18181b 0%, #71717a 100%)',
    parameters: { colorGrade: 'noir', contrast: 40, saturation: -100, vignette: 50 }
  },

  // --- SOCIAL MEDIA PACK ---
  {
    id: 'portrait_glow',
    nameAr: 'توهج البورتريه (Portrait Glow)',
    nameEn: 'Portrait Soft Glow',
    category: 'social_media',
    packNameAr: 'حزمة منصات التواصل',
    packNameEn: 'Social Media Pack',
    descriptionAr: 'تنعيم خفيف للبشرة مع إضافة إضاءة ملائكية زاهية للفيديوهات',
    descriptionEn: 'Soft beauty bloom lighting perfect for TikTok & Reels creator videos',
    icon: '✨',
    previewBg: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
    parameters: { blur: 15, brightness: 10, saturation: 20 }
  },
  {
    id: 'vibrant_boost',
    nameAr: 'تشبع ألوان زاهي (Vibrant Boost)',
    nameEn: 'Vibrant Color Pop',
    category: 'social_media',
    packNameAr: 'حزمة منصات التواصل',
    packNameEn: 'Social Media Pack',
    descriptionAr: 'تعزيز قوة وشغف الألوان لتصبح جذابة ومشرقة على الشاشات',
    descriptionEn: 'High saturation and clarity for eye-catching mobile feeds',
    icon: '🌈',
    previewBg: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    parameters: { saturation: 45, contrast: 15, sharpen: 20 }
  },
  {
    id: 'warm_golden_hour',
    nameAr: 'ساعة الغروب الذهبية (Golden Hour)',
    nameEn: 'Warm Golden Hour',
    category: 'social_media',
    packNameAr: 'حزمة منصات التواصل',
    packNameEn: 'Social Media Pack',
    descriptionAr: 'إضافة أشعة الشمس الدافئة والنغمات الذهبية الساحرة',
    descriptionEn: 'Sun-kissed warm golden tint for outdoor & lifestyle vlogs',
    icon: '🌅',
    previewBg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    parameters: { colorGrade: 'golden_hour', brightness: 5, saturation: 25 }
  },

  // --- NEON / CYBER PACK ---
  {
    id: 'cyber_neon',
    nameAr: 'نيون مستقبلي (Cyberpunk Neon)',
    nameEn: 'Cyberpunk Neon Glow',
    category: 'neon',
    packNameAr: 'حزمة النيون والجلتش',
    packNameEn: 'Neon & Cyber Pack',
    descriptionAr: 'أضواء نيون سايبربانك مشبعة بالأزرق السماوي والأرجواني',
    descriptionEn: 'Futuristic cyan and magenta glowing neon tinting',
    icon: '🌆',
    previewBg: 'linear-gradient(135deg, #06b6d4 0%, #d946ef 100%)',
    parameters: { colorGrade: 'cyberpunk', contrast: 30, saturation: 40 }
  },
  {
    id: 'vhs_glitch_crt',
    nameAr: 'جلتش VHS وتفكيك الألوان',
    nameEn: 'VHS Retro Glitch',
    category: 'neon',
    packNameAr: 'حزمة النيون والجلتش',
    packNameEn: 'Neon & Cyber Pack',
    descriptionAr: 'خطوط مسح قديمة وتفكيك ريترو للألوان مع تشويش بصري',
    descriptionEn: 'Scanlines, RGB split chromatic aberration & tape noise',
    icon: '📼',
    previewBg: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)',
    parameters: { glitch: 65, contrast: 20 }
  },
  {
    id: 'laser_rgb_split',
    nameAr: 'انقسام الليزر (RGB Split)',
    nameEn: 'RGB Laser Split',
    category: 'neon',
    packNameAr: 'حزمة النيون والجلتش',
    packNameEn: 'Neon & Cyber Pack',
    descriptionAr: 'تشتت قنوات اللون الأحمر والأزرق لإعطاء انطباع ثلاثي الأبعاد',
    descriptionEn: '3D chromatic separation effect with dynamic edge jitter',
    icon: '⚡',
    previewBg: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
    parameters: { glitch: 85, saturation: 30 }
  },

  // --- CLEAN ENHANCEMENT PACK ---
  {
    id: 'ai_sharpness_hdr',
    nameAr: 'حدّة وتفاصيل ذكية (HDR Sharpen)',
    nameEn: 'AI HDR Sharpen',
    category: 'clean_enhancement',
    packNameAr: 'حزمة التحسين النقي',
    packNameEn: 'Clean Enhancement Pack',
    descriptionAr: 'زيادة حدة التفاصيل الدقيقة وإبراز الحواف دون تشويش',
    descriptionEn: 'Edge detail enhancement and local contrast restoration',
    icon: '🔍',
    previewBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    parameters: { sharpen: 70, contrast: 15 }
  },
  {
    id: 'denoise_smooth',
    nameAr: 'تنعيم وإزالة الضوضاء (Noise Cleaner)',
    nameEn: 'Denoise & Edge Smooth',
    category: 'clean_enhancement',
    packNameAr: 'حزمة التحسين النقي',
    packNameEn: 'Clean Enhancement Pack',
    descriptionAr: 'إزالة التشويش الحبيبي وتنعيم أسطح الفيديو مع الحفاظ على الحواف',
    descriptionEn: 'Removes digital noise artifacts and smooths grainy frames',
    icon: '💧',
    previewBg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    parameters: { blur: 10, brightness: 5, contrast: -5 }
  },
  {
    id: 'hdr_clarity_boost',
    nameAr: 'وضوح فائق HDR (Clarity Boost)',
    nameEn: 'Ultra HDR Clarity',
    category: 'clean_enhancement',
    packNameAr: 'حزمة التحسين النقي',
    packNameEn: 'Clean Enhancement Pack',
    descriptionAr: 'موازنة الإضاءة في المناطق المظلمة والمشرقة للحصول على ناتج غني',
    descriptionEn: 'Shadow recovery and highlight protection for crystal clear video',
    icon: '💎',
    previewBg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    parameters: { contrast: 25, brightness: 10, saturation: 10, sharpen: 30 }
  },

  // --- SLOW MOTION PACK ---
  {
    id: 'smooth_slow_mo_50',
    nameAr: 'حركة بطيئة 0.5x (Smooth Slow-Mo)',
    nameEn: '0.5x Smooth Slow Motion',
    category: 'slow_motion',
    packNameAr: 'حزمة الحركة البطيئة',
    packNameEn: 'Slow Motion Pack',
    descriptionAr: 'إبطاء سرعة المقطع للنصف مع تنعيم الإطارات لمنع التقطيع',
    descriptionEn: '50% playback speed with optical frame interpolation smoothing',
    icon: '⏱️',
    previewBg: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
    parameters: { speedMultiplier: 0.5 }
  },
  {
    id: 'ultra_slow_mo_25',
    nameAr: 'حركة فائقة البطء 0.25x (Ultra Slow)',
    nameEn: '0.25x Ultra Slow Motion',
    category: 'slow_motion',
    packNameAr: 'حزمة الحركة البطيئة',
    packNameEn: 'Slow Motion Pack',
    descriptionAr: 'إبطاء سينمائي شديد لإبراز تفاصيل الحركة في اللحظات الحماسية',
    descriptionEn: '25% playback speed for high action cinematic moments',
    icon: '🐌',
    previewBg: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
    parameters: { speedMultiplier: 0.25 }
  },

  // --- TRANSITIONS PACK ---
  {
    id: 'transition_fade',
    nameAr: 'تلاشي تدريجي (Fade In/Out)',
    nameEn: 'Smooth Fade In/Out',
    category: 'transitions',
    packNameAr: 'حزمة الانتقالات',
    packNameEn: 'Transitions Pack',
    descriptionAr: 'انتقال سلس بظهور واختفاء ناعم للمقطع',
    descriptionEn: 'Classic opacity fade transition',
    icon: '🔲',
    previewBg: 'linear-gradient(135deg, #3f3f46 0%, #18181b 100%)',
    parameters: { transitionType: 'fade' }
  },
  {
    id: 'transition_zoom_punch',
    nameAr: 'انتقال زوم حماسي (Zoom Punch)',
    nameEn: 'Zoom Punch Punch',
    category: 'transitions',
    packNameAr: 'حزمة الانتقالات',
    packNameEn: 'Transitions Pack',
    descriptionAr: 'دفعة تكبير سريعة ومثيرة عند بداية المقطع',
    descriptionEn: 'Fast energetic zoom punch entry transition',
    icon: '🔍',
    previewBg: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    parameters: { transitionType: 'zoom_punch' }
  },
  {
    id: 'transition_glitch_flash',
    nameAr: 'وميض جلتش (Glitch Flash)',
    nameEn: 'Glitch Flash Transition',
    category: 'transitions',
    packNameAr: 'حزمة الانتقالات',
    packNameEn: 'Transitions Pack',
    descriptionAr: 'وميض كهربائي وتداخل رقمي سريع للربط بين اللقطات',
    descriptionEn: 'High speed cyber glitch flash transition',
    icon: '⚡',
    previewBg: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    parameters: { transitionType: 'glitch_flash' }
  }
];
