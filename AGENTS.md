# AGENTS.md — ai_translator

## 1. Next.js Agent Rules

<!-- BEGIN:nextjs-agent-rules -->

**## This is NOT the Next.js you know**

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 2. General Working Rules

- Explain the implementation plan before making significant changes.
- Follow the user's approved requirements. Do not invent additional features.
- Prefer simple, maintainable solutions over unnecessary abstractions.
- Avoid unnecessary dependencies, files, and duplicated code.
- Do not overwrite or delete existing work without approval.
- Never expose API keys, secrets, or environment variables.
- Ask before performing destructive actions or making significant architectural changes.
- After implementation, run relevant checks and explain the results.
- Explain important technical decisions in Thai using beginner-friendly language.

## 3. Project Requirements

- Project: ai_translator.
- Framework: Next.js with TypeScript.
- Styling: Tailwind CSS.
- Backend: Supabase, including Edge Functions where appropriate.
- AI translation: use an LLM API through a secure server-side endpoint.
- Client platforms: web first, with LINE LIFF support planned.
- Keep LLM API keys on the server. Never expose secret keys in client-side code.
- Keep web and LINE LIFF integrations organized so they can reuse the same translation backend.
- Implement features incrementally and verify each stage before proceeding.

## 4. Token and Context Efficiency

- Read only the project files and documentation relevant to the current task.
- Do not repeatedly print entire files or documentation when a concise summary is sufficient.
- Reuse existing project context instead of asking the user to repeat it.
- Inspect existing code before proposing replacements.
- Prefer targeted changes over rewriting entire files.
- Summarize completed work, changed files, checks performed, and unresolved issues concisely.
- Ask for clarification only when missing information materially affects implementation.
