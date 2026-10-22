"use client";

import { useState } from "react";
import {
  LANGUAGE_LEVELS,
  TRANSLATION_CONTEXTS,
  getLanguageLabel,
} from "@/lib/mock-translation";
import type { TranslationResult as TranslationResultData } from "@/types/translation";

interface TranslationResultProps {
  result: TranslationResultData | null;
  status: "idle" | "loading" | "success" | "error";
  errorMessage: string | null;
}

export default function TranslationResult({
  result,
  status,
  errorMessage,
}: TranslationResultProps) {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  async function handleCopy() {
    if (!result) return;

    setCopyMessage(null);
    setCopyError(null);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("เบราว์เซอร์นี้ไม่รองรับการคัดลอกอัตโนมัติ");
      }
      await navigator.clipboard.writeText(result.translatedText);
      setCopyMessage("คัดลอกคำแปลแล้ว");
    } catch {
      setCopyError("คัดลอกไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง");
    }
  }

  const levelLabel =
    LANGUAGE_LEVELS.find((item) => item.value === result?.languageLevel)?.label ??
    "";
  const contextLabel =
    TRANSLATION_CONTEXTS.find((item) => item.value === result?.context)?.label ??
    "";

  return (
    <section
      id="result"
      aria-labelledby="result-heading"
      className="space-y-4 pr-2 w-[300px] max-h-[600px] overflow-y-auto scrollbar-none panel panel--result"
    >
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 id="result-heading" className="font-semibold text-[var(--ink)] text-sm">
          ผลการแปล
        </h2>
        {result ? (
          <button type="button" onClick={handleCopy} className="btn-secondary">
            Copy Translation
          </button>
        ) : null}
      </div>

      {status === "loading" ? (
        <p className="panel-placeholder" role="status">
          กำลังแปลเอกสารของคุณ...
        </p>
      ) : null}

      {status === "error" && errorMessage ? (
        <p
          role="alert"
          className="bg-[var(--danger-bg)] px-4 py-3 border border-[var(--danger-line)] text-[var(--danger)] text-sm"
        >
          {errorMessage}
        </p>
      ) : null}

      {status !== "loading" && status !== "error" && !result ? (
        <p className="panel-placeholder">
          ยังไม่มีผลการแปล วางข้อความแล้วกด &quot;แปลภาษา&quot; ได้เลย
        </p>
      ) : null}

      {result && status !== "loading" ? (
        <div className="space-y-4">
          {result.mockNotice && (
            <p
              role="status"
              className="bg-[var(--warn-bg)] px-3 py-2 border border-[var(--warn-line)] text-[var(--warn-ink)] text-sm"
            >
              {result.mockNotice}
            </p>
          )}

          <div className="space-y-1 text-[var(--muted)] text-sm">
            <p>
              {getLanguageLabel(result.detectedSourceLanguage ?? "auto")} →{" "}
              {getLanguageLabel(result.targetLanguage)}
            </p>
            <p>
              สไตล์: {levelLabel} · บริบท: {contextLabel}
              {result.funMode ? " · Fun Mode" : ""}
            </p>
          </div>

          <div
            className="bg-[var(--paper)] px-4 py-3 border border-[var(--line)] min-h-40 text-[var(--ink)] whitespace-pre-wrap result-text"
            aria-live="polite"
          >
            {result.translatedText}
          </div>

          {(copyMessage || copyError) && (
            <p
              role="status"
              className={
                copyError
                  ? "text-sm text-[var(--danger)]"
                  : "text-sm text-[var(--success)]"
              }
            >
              {copyError ?? copyMessage}
            </p>
          )}

          {/* ส่วนคำอธิบายเพิ่มเติมที่เปิดใช้งานแล้ว */}
          {result.explanation && (
            <div className="space-y-3 pt-4 border-[var(--line)] border-t">
              {result.explanation.contextMeaning && (
                <div>
                  <h3 className="font-semibold text-[var(--ink)] text-sm">
                    คำอธิบายเพิ่มเติม
                  </h3>
                  <p className="text-[var(--muted)] text-sm">
                    {result.explanation.contextMeaning}
                  </p>
                </div>
              )}

              {result.explanation.keyPhrases && result.explanation.keyPhrases.length > 0 && (
                <div>
                  <p className="font-medium text-[var(--ink)] text-sm">สำนวน / คำศัพท์</p>
                  <ul className="space-y-1 mt-1 pl-5 text-[var(--muted)] text-sm list-disc">
                    {result.explanation.keyPhrases.map((phrase, index) => (
                      <li key={index}>{phrase}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.explanation.alternatives && result.explanation.alternatives.length > 0 && (
                <div>
                  <p className="font-medium text-[var(--ink)] text-sm">ทางเลือกอื่น</p>
                  <ul className="space-y-1 mt-1 pl-5 text-[var(--muted)] text-sm list-disc">
                    {result.explanation.alternatives.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}