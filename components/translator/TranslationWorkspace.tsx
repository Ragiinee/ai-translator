"use client";

import { useRef, useState } from "react";
import PixelCharacter, {
  RECEIVE_ANIMATION_MS,
} from "@/components/character/PixelCharacter";
import PaperHandoff from "@/components/character/PaperHandoff";
import LanguageSelector from "@/components/translator/LanguageSelector";
import TranslationOptions from "@/components/translator/TranslationOptions";
import TranslationResult from "@/components/translator/TranslationResult";
import {
  MAX_WORDS,
  countCharacters,
  countWords,
  mockTranslate,
} from "@/lib/mock-translation";
import type {
  CharacterState,
  LanguageCode,
  LanguageLevel,
  TranslationContext,
  TranslationResult as TranslationResultData,
  TranslationStatus,
} from "@/types/translation";

function resolveCharacterState({
  status,
  isEmpty,
  isReceiving,
}: {
  status: TranslationStatus;
  isEmpty: boolean;
  isReceiving: boolean;
}): CharacterState {
  if (status === "loading") {
    return isReceiving ? "receiving" : "translating";
  }

  if (status === "success") return "completed";
  if (isEmpty) return "idle";

  return "waiting";
}

export default function TranslationWorkspace() {
  const [sourceText, setSourceText] = useState("");
  const [sourceLanguage, setSourceLanguage] =
    useState<LanguageCode>("auto");
  const [targetLanguage, setTargetLanguage] =
    useState<LanguageCode>("en");
  const [languageLevel, setLanguageLevel] =
    useState<LanguageLevel>("natural");
  const [context, setContext] =
    useState<TranslationContext>("general");
  const [funMode, setFunMode] = useState(false);

  const [status, setStatus] =
    useState<TranslationStatus>("idle");
  const [result, setResult] =
    useState<TranslationResultData | null>(null);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);
  const [isReceiving, setIsReceiving] = useState(false);

  const receiveTimerRef = useRef<number | null>(null);

  const wordCount = countWords(sourceText);
  const characterCount = countCharacters(sourceText);
  const isOverLimit = wordCount > MAX_WORDS;
  const isEmpty = sourceText.trim().length === 0;
  const isLoading = status === "loading";
  const isCompleted = status === "success" && result !== null;

  const canTranslate =
    !isEmpty && !isOverLimit && !isLoading;

  const characterState = resolveCharacterState({
    status,
    isEmpty,
    isReceiving,
  });

  function clearReceiveTimer() {
    if (receiveTimerRef.current !== null) {
      window.clearTimeout(receiveTimerRef.current);
      receiveTimerRef.current = null;
    }
  }

  function handleSwapLanguages() {
    if (sourceLanguage === "auto") return;

    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  }

  function handleClear() {
    clearReceiveTimer();
    setSourceText("");
    setResult(null);
    setErrorMessage(null);
    setStatus("idle");
    setIsReceiving(false);
  }

  function handleEditDocument() {
    // กลับไปแก้ข้อความเดิม โดยไม่ลบข้อความต้นฉบับ
    setResult(null);
    setErrorMessage(null);
    setStatus("idle");
    setIsReceiving(false);
  }

  function handleSourceTextChange(value: string) {
    setSourceText(value);

    if (!isLoading) {
      setStatus("idle");
      setErrorMessage(null);
      setResult(null);
    }
  }

  async function handleTranslate() {
    if (!canTranslate) return;

    clearReceiveTimer();
    setErrorMessage(null);
    setIsReceiving(true);
    setStatus("loading");

    receiveTimerRef.current = window.setTimeout(() => {
      setIsReceiving(false);
      receiveTimerRef.current = null;
    }, RECEIVE_ANIMATION_MS);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText,
          sourceLanguage,
          targetLanguage,
          languageLevel,
          context,
          funMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการแปล');
      }

      console.log("=== 📥 ผลลัพธ์จาก Backend ===", data);

      // ใช้ข้อมูลที่ Backend ส่งมาตรงๆ ได้เลย ไม่ต้อง Map ใหม่
      clearReceiveTimer();
      setIsReceiving(false);
      setResult(data);
      setStatus("success");

    } catch (error) {
      clearReceiveTimer();
      setIsReceiving(false);

      const message =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดระหว่างแปล กรุณาลองใหม่";

      console.error("=== ❌ เกิดข้อผิดพลาด ===", message);
      setErrorMessage(message);
      setStatus("error");
    }
  }

  return (
    <div className="translator-app">
      <section
        id="workspace"
        className="desk-workspace"
        aria-labelledby="workspace-heading"
      >
        {/* ฉากสำนักงานและตัวละคร */}
        <div className="desk-workspace__scene">
          <div className="flex md:flex-row flex-col justify-between items-center pb-6 w-full">
            <div className="desk-workspace__intro">
              <h1
                id="hero-heading"
                className="desk-workspace__title"
              >
                AI Translator
              </h1>

              <p className="desk-workspace__subtitle">
                กรอกข้อมูลของคุณลงเอกสารและส่งให้พนักงานแปลที่โต๊ะทำงาน
                แล้วรอรับเอกสารที่แปลเสร็จกลับมา
              </p>
            </div>

            {/* ปุ่ม GitHub (Primary Button Style) */}
            <div className="flex justify-start md:justify-end items-center w-full">
              <a
                href="https://github.com/Ragiinee/ai-translator.git" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow px-4 py-2 rounded-lg font-medium text-white text-sm active:scale-95 transition-all duration-200"
              >
                {/* GitHub SVG Icon */}
                <svg
                  className="fill-current w-5 h-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <PixelCharacter state={characterState} />

          {/* เมนูและเอกสารทั้งหมดอยู่บนกระดาษ */}
          <PaperHandoff state={characterState}>
            {isCompleted ? (
              <div className="space-y-3 paper-form">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h2 className="font-bold text-sm">
                    เอกสารแปลแล้ว
                  </h2>

                  <span className="text-[var(--accent)] text-xs">
                    แปลสำเร็จ
                  </span>
                </div>

                <TranslationResult
                  result={result}
                  status={status}
                  errorMessage={errorMessage}
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleEditDocument}
                    className="btn-primary"
                  >
                    แก้ไขข้อความ
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="btn-secondary"
                  >
                    เริ่มเอกสารใหม่
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 px-2 paper-form">
                <div>
                  <h2 className="font-bold text-sm">
                    ใบงานแปลภาษา
                  </h2>
                  <p className="mt-1 text-[var(--muted)] text-xs">
                    เลือกตัวเลือกและกรอกข้อความที่ต้องการแปล
                  </p>
                </div>

                <div className="paper-form__menus">
                  <LanguageSelector
                    sourceLanguage={sourceLanguage}
                    targetLanguage={targetLanguage}
                    onSourceChange={setSourceLanguage}
                    onTargetChange={setTargetLanguage}
                    onSwap={handleSwapLanguages}
                    disabled={isLoading}
                  />

                  <TranslationOptions
                    languageLevel={languageLevel}
                    context={context}
                    funMode={funMode}
                    onLanguageLevelChange={setLanguageLevel}
                    onContextChange={setContext}
                    onFunModeChange={setFunMode}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <label
                      htmlFor="source-text"
                      className="font-semibold text-sm"
                    >
                      ข้อความต้นฉบับ
                    </label>

                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={isLoading || isEmpty}
                      className="btn-secondary"
                    >
                      ล้างข้อความ
                    </button>
                  </div>

                  <textarea
                    id="source-text"
                    value={sourceText}
                    disabled={isLoading}
                    onChange={(event) =>
                      handleSourceTextChange(event.target.value)
                    }
                    rows={7}
                    placeholder="วางข้อความที่ต้องการแปลที่นี่..."
                    className="min-h-36 resize-y field-control"
                    aria-describedby="word-count-help word-limit-warning"
                  />

                  <div className="space-y-1 text-xs">
                    <p
                      id="word-count-help"
                      className="text-[var(--muted)]"
                    >
                      {wordCount} คำ · {characterCount} อักขระ
                      <span className="block">
                        จำกัดไม่เกิน {MAX_WORDS} คำ
                      </span>
                    </p>

                    {isOverLimit ? (
                      <p
                        id="word-limit-warning"
                        role="alert"
                        className="text-[var(--danger)]"
                      >
                        ข้อความเกิน {MAX_WORDS} คำ
                        กรุณาย่อข้อความก่อนแปล
                      </p>
                    ) : (
                      <span
                        id="word-limit-warning"
                        className="sr-only"
                      >
                        ยังไม่เกินขีดจำกัด
                      </span>
                    )}
                  </div>
                </div>

                {status === "error" && (
                  <TranslationResult
                    result={null}
                    status={status}
                    errorMessage={errorMessage}
                  />
                )}

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleTranslate}
                    disabled={!canTranslate}
                    className="w-full btn-primary"
                    aria-busy={isLoading}
                  >
                    {isLoading ? "กำลังแปล..." : "ส่งเอกสารให้แปล"}
                  </button>

                  {isLoading && (
                    <p
                      className="text-[var(--muted)] text-xs text-center"
                      role="status"
                    >
                      {characterState === "receiving"
                        ? "กำลังส่งเอกสารให้พนักงาน..."
                        : "พนักงานกำลังแปลเอกสารของคุณ"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </PaperHandoff>
        </div>


      </section>
    </div>
  );
}