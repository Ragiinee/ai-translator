"use client";

import {
  SOURCE_LANGUAGES,
  TARGET_LANGUAGES,
  getLanguageLabel,
} from "@/lib/mock-translation";
import type { LanguageCode } from "@/types/translation";

interface LanguageSelectorProps {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  onSourceChange: (code: LanguageCode) => void;
  onTargetChange: (code: LanguageCode) => void;
  onSwap: () => void;
  disabled?: boolean;
}

export default function LanguageSelector({
  sourceLanguage,
  targetLanguage,
  onSourceChange,
  onTargetChange,
  onSwap,
  disabled = false,
}: LanguageSelectorProps) {
  const canSwap = sourceLanguage !== "auto";

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-[var(--ink)]">
        เลือกภาษา
      </legend>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div className="space-y-1.5">
          <label htmlFor="source-language" className="text-sm text-[var(--muted)]">
            ภาษาต้นทาง
          </label>
          <select
            id="source-language"
            value={sourceLanguage}
            disabled={disabled}
            onChange={(event) =>
              onSourceChange(event.target.value as LanguageCode)
            }
            className="field-control"
          >
            {SOURCE_LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label} ({language.nativeLabel})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onSwap}
          disabled={disabled || !canSwap}
          className="btn-secondary h-11 w-full sm:w-11"
          aria-label="สลับภาษาต้นทางและปลายทาง"
          title={
            canSwap
              ? "สลับภาษา"
              : "เลือกภาษาต้นทางก่อน จึงจะสลับได้"
          }
        >
          ⇄
        </button>

        <div className="space-y-1.5">
          <label htmlFor="target-language" className="text-sm text-[var(--muted)]">
            ภาษาปลายทาง
          </label>
          <select
            id="target-language"
            value={targetLanguage}
            disabled={disabled}
            onChange={(event) =>
              onTargetChange(event.target.value as LanguageCode)
            }
            className="field-control"
          >
            {TARGET_LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label} ({language.nativeLabel})
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-[var(--muted)]">
        จาก {getLanguageLabel(sourceLanguage)} → {getLanguageLabel(targetLanguage)}
      </p>
    </fieldset>
  );
}
