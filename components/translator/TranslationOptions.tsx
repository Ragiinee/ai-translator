"use client";

import {
  LANGUAGE_LEVELS,
  TRANSLATION_CONTEXTS,
} from "@/lib/mock-translation";
import type {
  LanguageLevel,
  TranslationContext,
} from "@/types/translation";

interface TranslationOptionsProps {
  languageLevel: LanguageLevel;
  context: TranslationContext;
  funMode: boolean;
  onLanguageLevelChange: (level: LanguageLevel) => void;
  onContextChange: (context: TranslationContext) => void;
  onFunModeChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export default function TranslationOptions({
  languageLevel,
  context,
  funMode,
  onLanguageLevelChange,
  onContextChange,
  onFunModeChange,
  disabled = false,
}: TranslationOptionsProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-semibold text-[var(--ink)]">
        สไตล์คำแปล
      </legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="language-level" className="text-sm text-[var(--muted)]">
            ระดับภาษา
          </label>
          <select
            id="language-level"
            value={languageLevel}
            disabled={disabled}
            onChange={(event) =>
              onLanguageLevelChange(event.target.value as LanguageLevel)
            }
            className="field-control"
          >
            {LANGUAGE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label} — {level.description}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="translation-context" className="text-sm text-[var(--muted)]">
            บริบท
          </label>
          <select
            id="translation-context"
            value={context}
            disabled={disabled}
            onChange={(event) =>
              onContextChange(event.target.value as TranslationContext)
            }
            className="field-control"
          >
            {TRANSLATION_CONTEXTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label} — {item.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-start gap-3 border border-[var(--line)] bg-[var(--paper)] px-3 py-3 text-sm text-[var(--ink)]">
        <input
          type="checkbox"
          checked={funMode}
          disabled={disabled}
          onChange={(event) => onFunModeChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
        />
        <span>
          <span className="block font-medium">แปลแบบมีม ๆ / ตลก ๆ (Fun Mode)</span>
          <span className="mt-1 block text-[var(--muted)]">
            ใช้สำนวนขำขันโดยยังรักษาความหมายหลัก และระบุชัดว่าเป็นการแปลเชิงสร้างสรรค์
          </span>
        </span>
      </label>
    </fieldset>
  );
}
