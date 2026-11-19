export interface Voice {
  id: string;
  name: string;
  nativeName?: string;
  language: string;
  langCode: string;
  gender: 'male' | 'female';
  category: 'storytelling' | 'dramatic' | 'conversational' | 'news' | 'poetic' | 'asmr' | 'kids';
  accent: string;
  description: string;
  geminiVoice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  recommendedStyle: string;
  avatarSeed: string;
  featured?: boolean;
  samplePrompt: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ur', name: 'Pakistani Urdu', nativeName: 'اردو (پاکستان)', flag: '🇵🇰', isRtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧' },
  { code: 'fr-CA', name: 'Canadian French', nativeName: 'Français (Canada)', flag: '🇨🇦' },
  { code: 'fr-FR', name: 'French (France)', nativeName: 'Français (France)', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRtl: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ / پنجابی', flag: '🇵🇰' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: 'Chinese Mandarin', nativeName: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

export const VOICES: Voice[] = [
  // --- PAKISTANI URDU ---
  {
    id: 'tariq-urdu',
    name: 'Tariq Mahmood',
    nativeName: 'طارق محمود',
    language: 'Pakistani Urdu',
    langCode: 'ur',
    gender: 'male',
    category: 'storytelling',
    accent: 'Pakistani Urdu (Lahori/Karachi Dastangoi)',
    description: 'Deep, captivating mystery and horror dastan-goi voice. Measured dramatic pauses, authentic Pakistani Urdu articulation.',
    geminiVoice: 'Fenrir',
    recommendedStyle: 'Authentic Pakistani Urdu Dastan-goi with deep raspy baritone, suspenseful pauses, and vivid atmospheric mystery.',
    avatarSeed: 'tariq-urdu-voice',
    featured: true,
    samplePrompt: 'رات کے تین بجے جب لاہور کی قدیم گلیوں میں دھند اترتی تھی، اس پرانی حویلی کی کھڑکی خود بخود کھل جاتی تھی۔ ہوا میں ایک عجیب سی خنکی اور سرسراہٹ تھی، جیسے کوئی صدیوں سے وہاں کسی کا انتظار کر رہا ہو۔'
  },
  {
    id: 'zainab-urdu',
    name: 'Zainab Bano',
    nativeName: 'زینب بانو',
    language: 'Pakistani Urdu',
    langCode: 'ur',
    gender: 'female',
    category: 'storytelling',
    accent: 'Pakistani Urdu (Literary & Emotive)',
    description: 'Soulful, elegant classic Urdu literature and romance novelist voice. Soft, emotive, poetic cadence.',
    geminiVoice: 'Kore',
    recommendedStyle: 'Graceful, heartwarming Pakistani Urdu literary narrator. Melodic, rich emotional nuance with gentle cadence.',
    avatarSeed: 'zainab-urdu-voice',
    featured: true,
    samplePrompt: 'زندگی کے راستے پر بچھڑی ہوئی یادیں خزاں کے زرد پتوں کی مانند خاموشی سے گرتی ہیں۔ وہ لمحہ جب ہم نے پہلی بار دریا کے کنارے بیٹھ کر چاندنی رات کو دیکھا تھا، آج بھی دل کی دھڑکنوں میں محفوظ ہے۔'
  },
  {
    id: 'hassan-urdu',
    name: 'Hassan RJ',
    nativeName: 'حسن آر جے',
    language: 'Pakistani Urdu',
    langCode: 'ur',
    gender: 'male',
    category: 'conversational',
    accent: 'Pakistani Urdu (Modern Youth / FM 100)',
    description: 'Upbeat, friendly youth radio jockey and modern podcast host. Casual, bilingual Urdu-English cadence.',
    geminiVoice: 'Puck',
    recommendedStyle: 'High-energy, charismatic Pakistani youth FM radio host. Warm, engaging, spontaneous conversational pace.',
    avatarSeed: 'hassan-urdu-voice',
    samplePrompt: 'سلام پاکستان! میں ہوں آپ کا اپنا حسن آر جے۔ آج کی رات ہمارے ساتھ ہیں کچھ شاندار کہانیاں اور دل کو چھو لینے والے گیت۔ فون اٹھائیے اور ہمیں بتائیے کہ آپ کا موڈ کیسا ہے!'
  },
  {
    id: 'mirza-urdu',
    name: 'Mirza Baig',
    nativeName: 'مرزا بیگ',
    language: 'Pakistani Urdu',
    langCode: 'ur',
    gender: 'male',
    category: 'poetic',
    accent: 'Pakistani Urdu (Classical Diction / Ghazal)',
    description: 'Grand classical orator for Urdu poetry, Faiz, Ghalib, and historical epics. Resonant, philosophical.',
    geminiVoice: 'Charon',
    recommendedStyle: 'Grand classical Urdu poet and philosophical orator. Rich resonant depth, pristine Talaffuz and dramatic emphasis.',
    avatarSeed: 'mirza-urdu-voice',
    samplePrompt: 'ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے۔ بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے۔ محبت میں نہیں ہے فرق جینے اور مرنے کا، اسی کو دیکھ کر جیتے ہیں جس کافر پہ دم نکلے۔'
  },
  {
    id: 'ayesha-urdu',
    name: 'Ayesha Siddiqui',
    nativeName: 'عائشہ صدیقی',
    language: 'Pakistani Urdu',
    langCode: 'ur',
    gender: 'female',
    category: 'news',
    accent: 'Pakistani Urdu (National Broadcast)',
    description: 'Crisp, crystal-clear national television news anchor and investigative documentary presenter.',
    geminiVoice: 'Zephyr',
    recommendedStyle: 'Authoritative, pristine Urdu news anchor and documentary presenter. Crisp pronunciation, steady rhythmic pacing.',
    avatarSeed: 'ayesha-urdu-voice',
    samplePrompt: 'اسلام آباد سے خصوصی رپورٹ: شمالی علاقہ جات میں موسم کی پہلی برف باری نے وادیوں کے حسن کو چار چاند لگا دیے۔ سیاحوں کا بڑا ہجوم شاہراہ قراقرم کی جانب رواں دواں ہے۔'
  },
  {
    id: 'dadijaan-urdu',
    name: 'Dadi Jaan',
    nativeName: 'دادی جان',
    language: 'Pakistani Urdu',
    langCode: 'ur',
    gender: 'female',
    category: 'kids',
    accent: 'Pakistani Urdu (Grandmotherly Folk)',
    description: 'Tender, loving grandmother telling timeless bedtime folk tales (Pariyon ki Kahaniyan) to children.',
    geminiVoice: 'Kore',
    recommendedStyle: 'Warm, grandmotherly Urdu bedtime storyteller. Gentle, comforting cadence, soothing affectionate tone.',
    avatarSeed: 'dadijaan-urdu-voice',
    samplePrompt: 'میرے پیارے بچو، ایک دفعہ کا ذکر ہے کہ کوہ قاف کی نیلی پہاڑیوں کے پیچھے ایک جادوئی گلاب کا باغ تھا۔ جہاں کے پرندے رات کو ستاروں کی کہانیاں سنایا کرتے تھے...'
  },

  // --- HINDI ---
  {
    id: 'aarav-hindi',
    name: 'Aarav Sharma',
    nativeName: 'आरव शर्मा',
    language: 'Hindi',
    langCode: 'hi',
    gender: 'male',
    category: 'storytelling',
    accent: 'Standard Hindi (Northern India)',
    description: 'Commanding storyteller for ancient epics, Panchatantra, historical dramas, and audiobooks.',
    geminiVoice: 'Charon',
    recommendedStyle: 'Epic Hindi mythological and dramatic narrator with deep voice, steady cadence, and dramatic gravity.',
    avatarSeed: 'aarav-hindi-voice',
    featured: true,
    samplePrompt: 'घने जंगलों के बीच छिपा वो प्राचीन मंदिर जब हवाओं में गूंजता था, तो ऐसा लगता था मानो युगों पुरानी कोई गाथा स्वयं सजीव हो उठी हो। कोई नहीं जानता था कि उस द्वार के पीछे क्या रहस्य छिपा है।'
  },
  {
    id: 'pooja-hindi',
    name: 'Pooja Verma',
    nativeName: 'पूजा वर्मा',
    language: 'Hindi',
    langCode: 'hi',
    gender: 'female',
    category: 'storytelling',
    accent: 'Standard Hindi (Melodic & Warm)',
    description: 'Gentle, expressive Hindi narrator for contemporary fiction, podcasts, and emotional storytelling.',
    geminiVoice: 'Kore',
    recommendedStyle: 'Melodic, heartfelt Hindi audiobook narrator. Expressive intonation with soothing warmth.',
    avatarSeed: 'pooja-hindi-voice',
    samplePrompt: 'बनारस के घाटों पर शाम की आरती जब शुरू होती थी, तो दीयों की रोशनी गंगा की लहरों पर तैरती हुई किसी सुनहरी परी की तरह प्रतीत होती थी।'
  },

  // --- ENGLISH ---
  {
    id: 'marcus-en',
    name: 'Marcus Vance',
    nativeName: 'Marcus Vance',
    language: 'English (US)',
    langCode: 'en-US',
    gender: 'male',
    category: 'dramatic',
    accent: 'American (Cinematic Baritone)',
    description: 'Iconic movie trailer, suspense thriller, and fantasy audiobook voice with powerful low-end resonance.',
    geminiVoice: 'Fenrir',
    recommendedStyle: 'Deep, cinematic Hollywood movie trailer baritone. Gritty, commanding, and thunderous suspense.',
    avatarSeed: 'marcus-en-voice',
    featured: true,
    samplePrompt: 'In a world forgotten by light, one silent watchman guarded the final threshold. He knew the prophecy was true, and the hour had finally arrived.'
  },
  {
    id: 'eleanor-en',
    name: 'Eleanor Vance',
    nativeName: 'Eleanor Vance',
    language: 'English (UK)',
    langCode: 'en-GB',
    gender: 'female',
    category: 'storytelling',
    accent: 'British Received Pronunciation (BBC)',
    description: 'Prestigious BBC documentary narrator and classical period drama voice. Articulate, sophisticated, and warm.',
    geminiVoice: 'Kore',
    recommendedStyle: 'Refined BBC documentary narrator. Sophisticated British RP, warm cadence, and crystalline clarity.',
    avatarSeed: 'eleanor-en-voice',
    samplePrompt: 'Beneath the ancient mist-shrouded moors of Yorkshire, whispers of bygone kingdoms still linger upon the northern wind, waiting for those who listen.'
  },
  {
    id: 'chloe-en',
    name: 'Chloe Miller',
    nativeName: 'Chloe Miller',
    language: 'English (US)',
    langCode: 'en-US',
    gender: 'female',
    category: 'asmr',
    accent: 'American (Soft & Mindful)',
    description: 'Tranquil ASMR, mindfulness meditation, and sleep story guide. Intimate breathwork and comforting whispers.',
    geminiVoice: 'Zephyr',
    recommendedStyle: 'Whispering, serene meditation and ASMR guide. Slow, rhythmic breathwork with peaceful presence.',
    avatarSeed: 'chloe-en-voice',
    samplePrompt: 'Take a deep, slow breath in through your nose... hold it gently... and let it drift away like a cloud dissolving in the evening twilight sky.'
  },

  // --- CANADIAN FRENCH ---
  {
    id: 'jean-luc-fr-ca',
    name: 'Jean-Luc Bouchard',
    nativeName: 'Jean-Luc Bouchard',
    language: 'Canadian French',
    langCode: 'fr-CA',
    gender: 'male',
    category: 'storytelling',
    accent: 'Français Canadien (Québécois Traditionnel)',
    description: 'Rich Québécois storyteller for folklore, Saint-Laurent coastal legends, and heartwarming radio narratives.',
    geminiVoice: 'Charon',
    recommendedStyle: 'Authentic Canadian French storyteller from Quebec. Warm, resonant timbre, natural folk cadence.',
    avatarSeed: 'jean-luc-fr-ca-voice',
    featured: true,
    samplePrompt: 'Par une froide soirée d\'hiver le long du fleuve Saint-Laurent, le vieux phare de la Pointe-aux-Érables veillait sur les navigateurs perdus au cœur de la tempête blanche.'
  },
  {
    id: 'genevieve-fr-ca',
    name: 'Geneviève Tremblay',
    nativeName: 'Geneviève Tremblay',
    language: 'Canadian French',
    langCode: 'fr-CA',
    gender: 'female',
    category: 'conversational',
    accent: 'Français Canadien (Montréal Urbain)',
    description: 'Warm, melodic contemporary Québécois voice for podcasts, culture reviews, and commercial branding.',
    geminiVoice: 'Kore',
    recommendedStyle: 'Modern, engaging Montreal Canadian French speaker. Clear, friendly, dynamic intonation.',
    avatarSeed: 'genevieve-fr-ca-voice',
    samplePrompt: 'Bienvenue au cœur de Montréal! Aujourd\'hui, on explore les cafés cachés du Mile End et les secrets des artistes qui font vibrer nos ruelles colorées.'
  },

  // --- ARABIC ---
  {
    id: 'tariq-ar',
    name: 'Tariq Al-Mansoor',
    nativeName: 'طارق المنصور',
    language: 'Arabic',
    langCode: 'ar',
    gender: 'male',
    category: 'storytelling',
    accent: 'Classical Arabic (Fusha)',
    description: 'Majestic classical Arabic hakawati storyteller for Arabian Nights and epic historical tales.',
    geminiVoice: 'Charon',
    recommendedStyle: 'Majestic classical Fusha Arabic Hakawati narrator. Grand resonance, flawless articulation.',
    avatarSeed: 'tariq-ar-voice',
    samplePrompt: 'كان يا ما كان في قديم الزمان، حين كانت الصحراء تحرس أسرار المدن الضائعة، وقف الفارس وحيداً أمام بوابة النجوم الشاهقة.'
  },

  // --- SPANISH ---
  {
    id: 'mateo-es',
    name: 'Mateo Morales',
    nativeName: 'Mateo Morales',
    language: 'Spanish',
    langCode: 'es',
    gender: 'male',
    category: 'storytelling',
    accent: 'Spanish (Castilian / Neutral)',
    description: 'Deep, engaging Spanish narrator for audiobooks, documentaries, and compelling tales.',
    geminiVoice: 'Puck',
    recommendedStyle: 'Captivating Spanish narrator with rich tone, expressive pacing, and natural warmth.',
    avatarSeed: 'mateo-es-voice',
    samplePrompt: 'El viento soplaba con fuerza a través de los viejos olivos de Andalucía, susurrando secretos que solo el tiempo y la noche recordaban.'
  }
];

export interface StoryPreset {
  id: string;
  title: string;
  language: string;
  langCode: string;
  voiceId: string;
  description: string;
  category: string;
  text: string;
}

export const STORY_PRESETS: StoryPreset[] = [
  {
    id: 'lahore-mystery-urdu',
    title: 'لاہور کی پرانی حویلی کا پراسرار راز',
    language: 'Pakistani Urdu',
    langCode: 'ur',
    voiceId: 'tariq-urdu',
    category: 'Horror / Mystery Dastan',
    description: 'Classic Pakistani Dastan-goi style mystery set in the ancient walled city of Lahore.',
    text: 'رات کے تین بجے جب لاہور کے شاہی قلعے کے اطراف گہری خاموشی چھا جاتی تھی، موچی دروازے کی تنگ گلیوں میں ایک دھیمی سی سرگوشی گونجتی تھی۔ بزرگ بتاتے ہیں کہ حویلی کے پرانے جھروکے پر جلنے والا چراغ کسی انسان کا محتاج نہیں تھا۔ جب بھی تیز آندھی چلتی، اس چراغ کی لو بجھنے کی بجائے اور سرخ ہو جاتی، اور پرانی دیواروں سے گھنگھروؤں کی مدہم جھنکار سنائی دینے لگتی۔'
  },
  {
    id: 'nostalgia-monsoon-urdu',
    title: 'لاہور کی پہلی بارش اور بچپن کی یادیں',
    language: 'Pakistani Urdu',
    langCode: 'ur',
    voiceId: 'zainab-urdu',
    category: 'Heartwarming / Nostalgia',
    description: 'Poetic, evocative Urdu prose remembering monsoon rains, clay scent, and hot cardamom tea.',
    text: 'مٹی کی سوندھی خوشبو جب پہلی بارش کے قطروں سے اٹھتی ہے، تو بچپن کے وہ خوش رنگ دن پلکوں پر تیرنے لگتے ہیں۔ چھت پر بارش میں نہانا، کاغذ کی کشتیاں پانی کی نالیوں میں بہانا، اور پھر دادی جان کے ہاتھ کے گرما گرم پکوڑے اور الائچی والی چائے... زندگی کتنی پرسکون تھی نا!'
  },
  {
    id: 'dadi-pari-urdu',
    title: 'کوہ قاف کا نیلا ستارہ — پریوں کی کہانی',
    language: 'Pakistani Urdu',
    langCode: 'ur',
    voiceId: 'dadijaan-urdu',
    category: 'Bedtime Folk Tale',
    description: 'Loving grandmother bedtime tale for sleep and sweet dreams.',
    text: 'سنو میرے چاند! بہت دور، بادلوں کے اس پار ایک چاندی کا پہاڑ تھا جہاں رات کو پریاں آسمان سے اتر کر گلاب کے پھولوں میں سوجایا کرتی تھیں۔ ایک ننھا شہزادہ روز رات کو کھڑکی میں بیٹھ کر ایک نیلے ستارے سے باتیں کیا کرتا تھا، جس نے اسے سکھایا کہ سچی ہمت اور سچائی ہمیشہ اندھیرے پر جیت جاتی ہے۔'
  },
  {
    id: 'katha-himalaya-hindi',
    title: 'हिमालय के गुप्त ऋषि की अमर गाथा',
    language: 'Hindi',
    langCode: 'hi',
    voiceId: 'aarav-hindi',
    category: 'Mythological / Epic',
    description: 'Resonant Hindi narrative of Himalayan mystics and timeless wisdom.',
    text: 'बर्फ की ऊंची चोटियों के परे, जहां केवल हवा का संनाटा और सूर्य की पहली किरणें पहुंचती हैं, एक रहस्यमयी गुफा में युगों से एक ज्योति प्रज्वलित थी। कहते हैं कि जिसने भी उस ज्योति के दर्शन किए, उसके मन का समस्त भय और अंधकार सदैव के लिए मिट गया।'
  },
  {
    id: 'lighthouse-cinema-en',
    title: 'The Whispering Lighthouse of Cape Hope',
    language: 'English (US)',
    langCode: 'en-US',
    voiceId: 'marcus-en',
    category: 'Cinematic Thriller',
    description: 'Gripping epic movie trailer voiceover about a remote Atlantic sentinel.',
    text: 'For eighty years, the light kept the dark at bay. But when the fog rolled in on the longest night of winter, the keeper heard a voice calling from beneath the black waves. It was not asking for rescue. It was calling him home.'
  },
  {
    id: 'saint-laurent-fr-ca',
    title: 'Le Conte du Vieux Phare du Saint-Laurent',
    language: 'Canadian French',
    langCode: 'fr-CA',
    voiceId: 'jean-luc-fr-ca',
    category: 'Québécois Legend',
    description: 'Atmospheric French-Canadian tale from the shores of Quebec.',
    text: 'Quand le vent du nord souffle sur le golfe du Saint-Laurent et que la banquise commence à gémir, les vieux pêcheurs de la Gaspésie se rassemblent autour du poêle à bois pour se raconter l\'histoire de la baleine blanche qui sauvait les goélettes perdues dans la brume.'
  }
];
