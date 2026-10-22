import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MAX_WORDS,
  countCharacters,
  countWords,
  getLanguageLabel,
  mockTranslate,
} from "../mock-translation";
import type { TranslationRequest } from "@/types/translation";

const defaultRequest: TranslationRequest = {
  sourceText: "Hello there",
  sourceLanguage: "auto",
  targetLanguage: "th",
  languageLevel: "natural",
  context: "general",
  funMode: false,
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

async function translate(request: TranslationRequest) {
  const result = mockTranslate(request).then(
    (value) => ({ value }),
    (error: unknown) => ({ error }),
  );
  await vi.advanceTimersByTimeAsync(900);
  const settled = await result;

  if ("error" in settled) {
    throw settled.error;
  }

  return settled.value;
}

describe("translation utility helpers", () => {
  it("counts whitespace-separated words and approximates Thai and CJK words", () => {
    expect(countWords("  hello   world\nagain  ")).toBe(3);
    expect(countWords("ภาษาไทย")).toBe(3);
    expect(countWords("こんにちは")).toBe(3);
    expect(countWords(" \n\t ")).toBe(0);
  });

  it("counts Unicode code points and resolves language labels", () => {
    expect(countCharacters("ไทย🙂")).toBe(4);
    expect(getLanguageLabel("ja")).toBe("Japanese");
    expect(getLanguageLabel("auto")).toBe("Auto Detect");
  });

  it("returns a result matching the translation type and detects Thai from script", async () => {
    const result = await translate({
      ...defaultRequest,
      sourceText: "สวัสดี",
    });

    expect(result).toMatchObject({
      translatedText: expect.stringContaining("[MOCK] แปลเป็นThai แบบธรรมชาติ"),
      detectedSourceLanguage: "th",
      targetLanguage: "th",
      languageLevel: "natural",
      context: "general",
      funMode: false,
      explanation: {
        contextMeaning: expect.stringContaining("เหมาะกับการสนทนาทั่วไป"),
        keyPhrases: expect.any(Array),
        alternatives: expect.any(Array),
      },
      isMock: true,
      mockNotice: expect.stringContaining("ข้อมูลจำลอง"),
    });
    expect(result.explanation.keyPhrases).toHaveLength(2);
    expect(result.explanation.alternatives).toHaveLength(2);
  });

  it.each([
    ["こんにちは", "ja"],
    ["안녕하세요", "ko"],
    ["你好", "zh"],
    ["hello", "en"],
  ] as const)("detects %s as %s when source language is automatic", async (text, code) => {
    const result = await translate({
      ...defaultRequest,
      sourceText: text,
    });

    expect(result.detectedSourceLanguage).toBe(code);
  });

  it("uses an explicitly selected source language and supports Fun Mode", async () => {
    const result = await translate({
      ...defaultRequest,
      sourceText: "สวัสดี",
      sourceLanguage: "en",
      languageLevel: "formal",
      funMode: true,
    });

    expect(result.detectedSourceLanguage).toBe("en");
    expect(result.translatedText).toContain("[MOCK / Fun Mode]");
    expect(result.translatedText).toContain("แบบสุภาพ");
  });

  it("trims input and truncates the displayed mock preview at 120 characters", async () => {
    const result = await translate({
      ...defaultRequest,
      sourceText: `  ${"a".repeat(121)}  `,
    });

    expect(result.translatedText).toContain(`${"a".repeat(120)}…`);
    expect(result.translatedText).not.toContain("a".repeat(121));
  });

  it("accepts a submission at the configured word limit", async () => {
    const result = await translate({
      ...defaultRequest,
      sourceText: Array.from({ length: MAX_WORDS }, () => "word").join(" "),
    });

    expect(result.translatedText).toContain('"word word');
  });

  it.each([
    ["empty input", { sourceText: "   " }, "กรุณาวางหรือพิมพ์ข้อความก่อนแปล"],
    [
      "input over the word limit",
      {
        sourceText: Array.from({ length: MAX_WORDS + 1 }, () => "word").join(
          " ",
        ),
      },
      `ข้อความยาวเกิน ${MAX_WORDS} คำ กรุณาย่อให้สั้นลง`,
    ],
    ["an automatic target language", { targetLanguage: "auto" }, "กรุณาเลือกภาษาปลายทาง"],
  ] as const)(
    "rejects %s",
    async (_scenario, overrides, errorMessage) => {
      await expect(
        translate({ ...defaultRequest, ...overrides }),
      ).rejects.toThrow(errorMessage);
    },
  );
});
