export type LanguageCode =
  | "auto"
  | "th"
  | "en"
  | "zh"
  | "ja"
  | "ko"
  | "fr"
  | "de"
  | "es";

export type LanguageLevel =
  | "casual"
  | "natural"
  | "formal"
  | "professional"
  | "academic";

export type TranslationContext =
  | "general"
  | "business"
  | "job"
  | "education"
  | "travel"
  | "social";

export type CharacterState =
  | "idle"
  | "waiting"
  | "receiving"
  | "translating"
  | "completed";

export type TranslationStatus = "idle" | "loading" | "success" | "error";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export interface StyleOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

export interface TranslationRequest {
  sourceText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  languageLevel: LanguageLevel;
  context: TranslationContext;
  funMode: boolean;
}

export interface TranslationExplanation {
  contextMeaning: string;
  keyPhrases: string[];
  alternatives: string[];
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  languageLevel: LanguageLevel;
  context: TranslationContext;
  funMode: boolean;
  explanation: TranslationExplanation;
  isMock: true;
  mockNotice: string;
}
