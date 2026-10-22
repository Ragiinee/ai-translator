import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LanguageSelector from "../LanguageSelector";

describe("LanguageSelector", () => {
  it("renders the selected languages and calls the change handlers", () => {
    const onSourceChange = vi.fn();
    const onTargetChange = vi.fn();

    render(
      <LanguageSelector
        sourceLanguage="th"
        targetLanguage="en"
        onSourceChange={onSourceChange}
        onTargetChange={onTargetChange}
        onSwap={vi.fn()}
      />,
    );

    const sourceSelect = screen.getByRole("combobox", { name: "ภาษาต้นทาง" });
    const targetSelect = screen.getByRole("combobox", {
      name: "ภาษาปลายทาง",
    });

    expect(sourceSelect).toHaveValue("th");
    expect(targetSelect).toHaveValue("en");
    expect(screen.getByText("จาก Thai → English")).toBeInTheDocument();

    fireEvent.change(sourceSelect, { target: { value: "ja" } });
    fireEvent.change(targetSelect, { target: { value: "fr" } });

    expect(onSourceChange).toHaveBeenCalledWith("ja");
    expect(onTargetChange).toHaveBeenCalledWith("fr");
  });

  it("disables language swapping while the source language is automatic", () => {
    const onSwap = vi.fn();

    render(
      <LanguageSelector
        sourceLanguage="auto"
        targetLanguage="en"
        onSourceChange={vi.fn()}
        onTargetChange={vi.fn()}
        onSwap={onSwap}
      />,
    );

    const swapButton = screen.getByRole("button", {
      name: "สลับภาษาต้นทางและปลายทาง",
    });
    expect(swapButton).toBeDisabled();
    expect(swapButton).toHaveAttribute(
      "title",
      "เลือกภาษาต้นทางก่อน จึงจะสลับได้",
    );
    fireEvent.click(swapButton);
    expect(onSwap).not.toHaveBeenCalled();
  });

  it("enables swapping for a selected source language and honors disabled", () => {
    const onSwap = vi.fn();
    const { rerender } = render(
      <LanguageSelector
        sourceLanguage="th"
        targetLanguage="en"
        onSourceChange={vi.fn()}
        onTargetChange={vi.fn()}
        onSwap={onSwap}
      />,
    );

    const swapButton = screen.getByRole("button", {
      name: "สลับภาษาต้นทางและปลายทาง",
    });
    expect(swapButton).toBeEnabled();
    fireEvent.click(swapButton);
    expect(onSwap).toHaveBeenCalledOnce();

    rerender(
      <LanguageSelector
        sourceLanguage="th"
        targetLanguage="en"
        onSourceChange={vi.fn()}
        onTargetChange={vi.fn()}
        onSwap={onSwap}
        disabled
      />,
    );

    expect(swapButton).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "ภาษาต้นทาง" })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "ภาษาปลายทาง" })).toBeDisabled();
  });
});
