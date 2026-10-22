import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { TranslationResult as TranslationResultData } from "@/types/translation";
import TranslationResult from "../TranslationResult";

const result: TranslationResultData = {
  translatedText: "Good morning",
  detectedSourceLanguage: "th",
  targetLanguage: "en",
  languageLevel: "natural",
  context: "general",
  funMode: false,
  explanation: {
    contextMeaning: "คำทักทายตอนเช้า",
    keyPhrases: ["Good morning = สวัสดีตอนเช้า"],
    alternatives: ["Morning"],
  },
  isMock: true,
  mockNotice: "ข้อมูลจำลอง",
};

let originalClipboard: PropertyDescriptor | undefined;

afterEach(() => {
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Reflect.deleteProperty(navigator, "clipboard");
  }
  originalClipboard = undefined;
});

function setClipboard(value: Pick<Clipboard, "writeText"> | undefined) {
  originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value,
  });
}

describe("TranslationResult", () => {
  it("renders the idle placeholder, loading status, and error alert", () => {
    const { rerender } = render(
      <TranslationResult result={null} status="idle" errorMessage={null} />,
    );

    expect(
      screen.getByText(/ยังไม่มีผลการแปล/),
    ).toBeInTheDocument();

    rerender(
      <TranslationResult result={null} status="loading" errorMessage={null} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "กำลังแปลเอกสารของคุณ...",
    );

    rerender(
      <TranslationResult
        result={null}
        status="error"
        errorMessage="บริการแปลขัดข้อง"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("บริการแปลขัดข้อง");
  });

  it("renders the translated text, metadata, mock notice, and explanation details", () => {
    render(
      <TranslationResult
        result={result}
        status="success"
        errorMessage={null}
      />,
    );

    expect(screen.getByText("Good morning")).toBeInTheDocument();
    expect(screen.getByText("ข้อมูลจำลอง")).toBeInTheDocument();
    expect(screen.getByText("Thai → English")).toBeInTheDocument();
    expect(
      screen.getByText("สไตล์: Natural · บริบท: General Conversation"),
    ).toBeInTheDocument();
    expect(screen.getByText("คำทักทายตอนเช้า")).toBeInTheDocument();
    expect(screen.getByText("Good morning = สวัสดีตอนเช้า")).toBeInTheDocument();
    expect(screen.getByText("Morning")).toBeInTheDocument();
  });

  it("omits empty explanation sections and hides a result while loading", () => {
    const resultWithoutExplanation: TranslationResultData = {
      ...result,
      explanation: {
        contextMeaning: "",
        keyPhrases: [],
        alternatives: [],
      },
    };
    const { rerender } = render(
      <TranslationResult
        result={resultWithoutExplanation}
        status="success"
        errorMessage={null}
      />,
    );

    expect(screen.queryByText("คำอธิบายเพิ่มเติม")).not.toBeInTheDocument();
    expect(screen.queryByText("สำนวน / คำศัพท์")).not.toBeInTheDocument();
    expect(screen.queryByText("ทางเลือกอื่น")).not.toBeInTheDocument();

    rerender(
      <TranslationResult
        result={result}
        status="loading"
        errorMessage={null}
      />,
    );
    expect(screen.queryByText("Good morning")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "กำลังแปลเอกสารของคุณ...",
    );
  });

  it("copies the translation and announces success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    render(
      <TranslationResult
        result={result}
        status="success"
        errorMessage={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy Translation" }));

    expect(writeText).toHaveBeenCalledWith("Good morning");
    expect(await screen.findByText("คัดลอกคำแปลแล้ว")).toHaveTextContent(
      "คัดลอกคำแปลแล้ว",
    );
  });

  it("announces a copy failure when the Clipboard API rejects", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Clipboard denied"));
    setClipboard({ writeText });

    render(
      <TranslationResult
        result={result}
        status="success"
        errorMessage={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy Translation" }));

    expect(
      await screen.findByText("คัดลอกไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง"),
    ).toHaveTextContent(
      "คัดลอกไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง",
    );
  });

  it("announces that copying is unavailable when the Clipboard API is missing", async () => {
    setClipboard(undefined);

    render(
      <TranslationResult
        result={result}
        status="success"
        errorMessage={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy Translation" }));

    expect(
      await screen.findByText("คัดลอกไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง"),
    ).toHaveTextContent(
      "คัดลอกไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง",
    );
  });
});
