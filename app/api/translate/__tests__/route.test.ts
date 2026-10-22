import { beforeEach, describe, expect, it, vi } from "vitest";

const { create } = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    interactions = { create };
  },
}));

import { POST } from "../route";

const validRequest = {
  sourceText: "สวัสดี",
  sourceLanguage: "auto",
  targetLanguage: "en",
  languageLevel: "natural",
  context: "general",
  funMode: false,
};

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/translate", () => {
  beforeEach(() => {
    create.mockReset();
  });

  it("calls Gemini and returns the translated result with request metadata", async () => {
    create.mockResolvedValue({
      output_text: JSON.stringify({
        translatedText: "Hello",
        detectedSourceLanguage: "th",
        explanation: {
          contextMeaning: "คำทักทาย",
          keyPhrases: ["Hello = สวัสดี"],
          alternatives: ["Hi"],
        },
      }),
    });

    const response = await POST(makeRequest(validRequest));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      translatedText: "Hello",
      sourceLanguage: "auto",
      detectedSourceLanguage: "th",
      targetLanguage: "en",
      languageLevel: "natural",
      context: "general",
      funMode: false,
      explanation: {
        contextMeaning: "คำทักทาย",
        keyPhrases: ["Hello = สวัสดี"],
        alternatives: ["Hi"],
      },
    });
    expect(create).toHaveBeenCalledOnce();
    expect(create).toHaveBeenCalledWith({
      model: "gemini-3.1-flash-lite",
      input: expect.stringContaining("Detect automatically"),
    });
  });

  it("strips a JSON Markdown fence before parsing the Gemini response", async () => {
    create.mockResolvedValue({
      output_text:
        '```json\n{"translatedText":"Good morning","detectedSourceLanguage":"en"}\n```',
    });

    const response = await POST(makeRequest(validRequest));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      translatedText: "Good morning",
      detectedSourceLanguage: "en",
      explanation: {
        contextMeaning: "",
        keyPhrases: [],
        alternatives: [],
      },
    });
  });

  it.each(["", "   "])("rejects an empty source text (%j)", async (sourceText) => {
    const response = await POST(
      makeRequest({ ...validRequest, sourceText }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "กรุณาระบุข้อความที่ต้องการแปล",
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("returns a server error when the Gemini request fails", async () => {
    const error = new Error("Gemini is unavailable");
    create.mockRejectedValue(error);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(makeRequest(validRequest));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Gemini is unavailable",
    });
    expect(consoleError).toHaveBeenCalledWith(
      "=== Interactions API Error ===",
      error,
    );
  });

  it("returns a server error when Gemini returns invalid JSON", async () => {
    create.mockResolvedValue({ output_text: "not valid JSON" });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(makeRequest(validRequest));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "AI ส่งข้อมูลกลับมาไม่ถูกต้องตามโครงสร้าง JSON ที่กำหนด",
    });
  });
});
