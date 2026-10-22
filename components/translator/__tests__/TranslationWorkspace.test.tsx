import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TranslationWorkspace from "../TranslationWorkspace";

const fetchMock = vi.fn<typeof fetch>();

const translationResponse = {
  translatedText: "Hello",
  sourceLanguage: "th",
  detectedSourceLanguage: "th",
  targetLanguage: "en",
  languageLevel: "formal",
  context: "business",
  funMode: true,
  explanation: {
    contextMeaning: "คำทักทาย",
    keyPhrases: ["Hello = สวัสดี"],
    alternatives: ["Hi"],
  },
  isMock: true,
  mockNotice: "ข้อมูลจำลอง",
};

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

describe("TranslationWorkspace", () => {
  it("starts with an unavailable submit button and updates word and character counts", () => {
    render(<TranslationWorkspace />);

    expect(
      screen.getByRole("button", { name: "ส่งเอกสารให้แปล" }),
    ).toBeDisabled();
    expect(screen.getByText(/0 คำ · 0 อักขระ/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("ข้อความต้นฉบับ"), {
      target: { value: "hello world" },
    });

    expect(screen.getByText(/2 คำ · 11 อักขระ/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ส่งเอกสารให้แปล" }),
    ).toBeEnabled();
  });

  it("blocks text over the word limit", () => {
    render(<TranslationWorkspace />);
    const longText = Array.from({ length: 501 }, (_, index) => `word${index}`).join(
      " ",
    );

    fireEvent.change(screen.getByLabelText("ข้อความต้นฉบับ"), {
      target: { value: longText },
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "ข้อความเกิน 500 คำ",
    );
    expect(
      screen.getByRole("button", { name: "ส่งเอกสารให้แปล" }),
    ).toBeDisabled();
  });

  it("sends the selected options, shows loading, and renders the result", async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }),
    );

    render(<TranslationWorkspace />);
    fireEvent.change(screen.getByLabelText("ข้อความต้นฉบับ"), {
      target: { value: "สวัสดี" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "ภาษาต้นทาง" }), {
      target: { value: "th" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "ภาษาปลายทาง" }), {
      target: { value: "en" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "ระดับภาษา" }), {
      target: { value: "formal" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "บริบท" }), {
      target: { value: "business" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /Fun Mode/ }));
    fireEvent.click(screen.getByRole("button", { name: "ส่งเอกสารให้แปล" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/translate",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText: "สวัสดี",
          sourceLanguage: "th",
          targetLanguage: "en",
          languageLevel: "formal",
          context: "business",
          funMode: true,
        }),
      }),
    );
    expect(screen.getByRole("button", { name: "กำลังแปล..." })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "กำลังส่งเอกสารให้พนักงาน...",
    );

    await act(async () => {
      resolveFetch(
        new Response(JSON.stringify(translationResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    expect(await screen.findByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("เอกสารแปลแล้ว")).toBeInTheDocument();
    expect(screen.getByText("ข้อมูลจำลอง")).toBeInTheDocument();
  });

  it("shows API errors and allows retrying with the original text", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Translation unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(<TranslationWorkspace />);
    fireEvent.change(screen.getByLabelText("ข้อความต้นฉบับ"), {
      target: { value: "hello" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ส่งเอกสารให้แปล" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Translation unavailable",
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "ส่งเอกสารให้แปล" }),
      ).toBeEnabled();
    });
    expect(screen.getByLabelText("ข้อความต้นฉบับ")).toHaveValue("hello");
  });

  it("can edit a completed translation and clear the document", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(translationResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    render(<TranslationWorkspace />);
    fireEvent.change(screen.getByLabelText("ข้อความต้นฉบับ"), {
      target: { value: "hello" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ส่งเอกสารให้แปล" }));

    expect(await screen.findByText("เอกสารแปลแล้ว")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "แก้ไขข้อความ" }));

    expect(screen.getByLabelText("ข้อความต้นฉบับ")).toHaveValue("hello");
    fireEvent.click(screen.getByRole("button", { name: "ล้างข้อความ" }));

    expect(screen.getByLabelText("ข้อความต้นฉบับ")).toHaveValue("");
    expect(screen.getByText(/0 คำ · 0 อักขระ/)).toBeInTheDocument();
  });
});
