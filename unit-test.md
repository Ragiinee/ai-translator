# Unit Testing Guidelines & Plan (AI Translator Project)

## 🛠️ Recommended Tech Stack
- **Test Runner & Framework:** `Vitest` (Fast execution, excellent integration with Next.js / TypeScript)
- **Component Testing:** `@testing-library/react` + `@testing-library/jest-dom`
- **Environment:** `jsdom`

---

## 📂 Folder Structure & Test Locations
- **Backend API Route:** 
  - Target: `app/api/translate/route.ts`
  - Test file: `app/api/translate/__tests__/route.test.ts`
- **Translator Components:**
  - Target: `components/translator/`
  - Test files: Stored in `components/translator/__tests__/` or named after components, e.g., `TranslationWorkspace.test.tsx`, `TranslationResult.test.tsx`
- **Utilities / Lib:**
  - Target: `lib/mock-translation.ts`
  - Test file: `lib/__tests__/mock-translation.test.ts`

---

## 🎯 Test Scope & Plan (Deep Dive into Actual Structure)

### 1. Backend API Route (`app/api/translate/route.ts`)
- **Happy Path:**
  - Sending a complete request (`sourceText`, language settings) -> Returns HTTP 200 with valid Gemini JSON structure (`translatedText`, `detectedSourceLanguage`, `explanation`)
- **Validation / Bad Request:**
  - Sending empty values (`sourceText = ""`) or invalid body structure -> Returns HTTP 400/422 with an error message
- **External API Error Handling:**
  - Mocking `@google/genai` to throw an error/network failure -> System must gracefully handle it and return HTTP 500 without crashing
- **JSON Clean & Parse:**
  - Testing cases where the Gemini API response is wrapped in Markdown blocks (` ```json `) so the backend can successfully clean and parse it into JSON

### 2. Frontend Translator Components (`components/translator/`)
- **`LanguageSelector.tsx` & `TranslationOptions.tsx`:**
  - Test changing source/target language, language level, and fun mode options to ensure values are correctly passed via callbacks or state.
- **`TranslationWorkspace.tsx` (Main Orchestrator):**
  - Test data flow and connection between input, options, and results.
  - Test loading state during translation submission (buttons disabled or loading indicator displayed).
- **`TranslationResult.tsx`:**
  - Render primary translated text upon success.
  - Test dynamic rendering of the `explanation` section (hidden when empty, fully displayed when context and key phrases data are present).
  - Test the copy translation button integration with the Clipboard API.

### 3. Utility & Helper Functions (`lib/`)
- **`lib/mock-translation.ts`:**
  - Test mock data functions or helper utilities (if any) to ensure they return data structures compliant with the TypeScript interfaces in `types/translation.ts`.

---

## ⚠️ Strict Constraints & Rules
1. **OFF-LIMITS FILE:** 
   - **Strictly DO NOT modify, alter, or touch the `AGENTS.md` file under any circumstances!**
2. **100% EXTERNAL API MOCKING:**
   - Never call the actual Google Gemini API or real network during unit tests. Always use `vi.mock()` to simulate responses.
3. **NO PLAN FILES CREATED:**
   - Do not create additional `unit-test-plan.md` files. Once unit tests are completed, report the test case summary as a Markdown table via the terminal only.