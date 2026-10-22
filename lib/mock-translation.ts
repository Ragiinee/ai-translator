import type {
  LanguageCode,
  LanguageLevel,
  LanguageOption,
  StyleOption,
  TranslationContext,
  TranslationRequest,
  TranslationResult,
} from "@/types/translation";

/** Hard limit for Phase 1 prototype submissions. */
export const MAX_WORDS = 500;

export const SOURCE_LANGUAGES: LanguageOption[] = [
  { code: "auto", label: "Auto Detect", nativeLabel: "ตรวจจับอัตโนมัติ" },
  { code: "th", label: "Thai", nativeLabel: "ไทย" },
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
];

export const TARGET_LANGUAGES: LanguageOption[] = SOURCE_LANGUAGES.filter(
  (language) => language.code !== "auto",
);

export const LANGUAGE_LEVELS: StyleOption<LanguageLevel>[] = [
  {
    value: "casual",
    label: "Casual",
    description: "ภาษาพูดทั่วไป เป็นกันเอง",
  },
  {
    value: "natural",
    label: "Natural",
    description: "ภาษาธรรมชาติ อ่านลื่นไหล",
  },
  {
    value: "formal",
    label: "Formal",
    description: "ภาษาทางการ สุภาพ",
  },
  {
    value: "professional",
    label: "Professional",
    description: "ภาษาเชิงธุรกิจหรือการทำงาน",
  },
  {
    value: "academic",
    label: "Academic",
    description: "ภาษาเชิงวิชาการ",
  },
];

export const TRANSLATION_CONTEXTS: StyleOption<TranslationContext>[] = [
  {
    value: "general",
    label: "General Conversation",
    description: "สนทนาทั่วไป",
  },
  {
    value: "business",
    label: "Business",
    description: "ธุรกิจและการทำงาน",
  },
  {
    value: "job",
    label: "Job Application",
    description: "สมัครงานและการสื่อสารกับนายจ้าง",
  },
  {
    value: "education",
    label: "Education",
    description: "การเรียนและการศึกษา",
  },
  {
    value: "travel",
    label: "Travel",
    description: "การเดินทางและการท่องเที่ยว",
  },
  {
    value: "social",
    label: "Social Media",
    description: "โพสต์และแชตบนโซเชียลมีเดีย",
  },
];

const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  auto: "Auto Detect",
  th: "Thai",
  en: "English",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  fr: "French",
  de: "German",
  es: "Spanish",
};

const LEVEL_TONE: Record<LanguageLevel, string> = {
  casual: "แบบกันเอง",
  natural: "แบบธรรมชาติ",
  formal: "แบบสุภาพ",
  professional: "แบบมืออาชีพ",
  academic: "แบบวิชาการ",
};

const CONTEXT_NOTE: Record<TranslationContext, string> = {
  general: "เหมาะกับการสนทนาทั่วไป",
  business: "เหมาะกับบริบทธุรกิจ",
  job: "เหมาะกับการสมัครงาน",
  education: "เหมาะกับบริบทการศึกษา",
  travel: "เหมาะกับการเดินทาง",
  social: "เหมาะกับโซเชียลมีเดีย",
};

/**
 * Word counting for mixed scripts.
 * - Space-separated languages: count whitespace-delimited tokens.
 * - Thai / CJK runs: approximate words from character length
 *   (Thai ≈ 3 chars/word, CJK ≈ 2 chars/word) because these scripts
 *   are not reliably split by spaces alone.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  const tokens = trimmed.match(
    /[\u0E00-\u0E7F]+|[\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]+|[^\s\u0E00-\u0E7F\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]+/g,
  );

  if (!tokens) return 0;

  return tokens.reduce((total, token) => {
    if (/^[\u0E00-\u0E7F]+$/.test(token)) {
      return total + Math.max(1, Math.ceil(token.length / 3));
    }
    if (/^[\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]+$/.test(token)) {
      return total + Math.max(1, Math.ceil(token.length / 2));
    }
    return total + token.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
}

export function countCharacters(text: string): number {
  return [...text].length;
}

export function getLanguageLabel(code: LanguageCode): string {
  return LANGUAGE_LABELS[code];
}

function detectSourceLanguage(text: string, selected: LanguageCode): LanguageCode {
  if (selected !== "auto") return selected;

  if (/[\u0E00-\u0E7F]/.test(text)) return "th";
  if (/[\u3040-\u30FF]/.test(text)) return "ja";
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/[\u3400-\u9FFF]/.test(text)) return "zh";
  return "en";
}

function buildMockTranslation(request: TranslationRequest): string {
  const preview = request.sourceText.trim().slice(0, 120);
  const levelTone = LEVEL_TONE[request.languageLevel];
  const targetLabel = getLanguageLabel(request.targetLanguage);

  if (request.funMode) {
    return `[MOCK / Fun Mode] แปลเป็น${targetLabel} ${levelTone}: "${preview}${
      request.sourceText.trim().length > 120 ? "…" : ""
    }" — เวอร์ชันมีม ๆ ที่ยังคงความหมายหลัก (ยังไม่ใช่ผลจาก AI จริง)`;
  }

  return `[MOCK] แปลเป็น${targetLabel} ${levelTone}: "${preview}${
    request.sourceText.trim().length > 120 ? "…" : ""
  }" — นี่คือข้อความจำลองสำหรับทดสอบ Frontend เท่านั้น`;
}

/**
 * Simulated translation delay for the Phase 1 frontend prototype.
 * Does not call any external API.
 */
export async function mockTranslate(
  request: TranslationRequest,
): Promise<TranslationResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const sourceText = request.sourceText.trim();
  if (!sourceText) {
    throw new Error("กรุณาวางหรือพิมพ์ข้อความก่อนแปล");
  }

  if (countWords(sourceText) > MAX_WORDS) {
    throw new Error(`ข้อความยาวเกิน ${MAX_WORDS} คำ กรุณาย่อให้สั้นลง`);
  }

  if (request.targetLanguage === "auto") {
    throw new Error("กรุณาเลือกภาษาปลายทาง");
  }

  const detectedSourceLanguage = detectSourceLanguage(
    sourceText,
    request.sourceLanguage,
  );

  return {
    translatedText: buildMockTranslation(request),
    detectedSourceLanguage,
    targetLanguage: request.targetLanguage,
    languageLevel: request.languageLevel,
    context: request.context,
    funMode: request.funMode,
    explanation: {
      contextMeaning: `[MOCK] ${CONTEXT_NOTE[request.context]} — คำอธิบายนี้เป็นข้อมูลจำลอง ไม่ได้มาจาก AI`,
      keyPhrases: [
        "[MOCK] สำนวนสำคัญ (ตัวอย่าง)",
        "[MOCK] คำศัพท์ตามบริบท (ตัวอย่าง)",
      ],
      alternatives: [
        "[MOCK] ทางเลือกการแปล 1",
        "[MOCK] ทางเลือกการแปล 2",
      ],
    },
    isMock: true,
    mockNotice:
      "ผลลัพธ์นี้เป็นข้อมูลจำลอง (Mock Data) สำหรับ Prototype เท่านั้น ยังไม่ได้เชื่อมต่อ AI API",
  };
}
