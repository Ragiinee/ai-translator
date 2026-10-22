import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TranslationOptions from "../TranslationOptions";

describe("TranslationOptions", () => {
  it("renders the selected options and reports changes", () => {
    const onLanguageLevelChange = vi.fn();
    const onContextChange = vi.fn();
    const onFunModeChange = vi.fn();

    render(
      <TranslationOptions
        languageLevel="natural"
        context="general"
        funMode={false}
        onLanguageLevelChange={onLanguageLevelChange}
        onContextChange={onContextChange}
        onFunModeChange={onFunModeChange}
      />,
    );

    const levelSelect = screen.getByRole("combobox", { name: "ระดับภาษา" });
    const contextSelect = screen.getByRole("combobox", { name: "บริบท" });
    const funModeCheckbox = screen.getByRole("checkbox", {
      name: /Fun Mode/,
    });

    expect(levelSelect).toHaveValue("natural");
    expect(contextSelect).toHaveValue("general");
    expect(funModeCheckbox).not.toBeChecked();

    fireEvent.change(levelSelect, { target: { value: "formal" } });
    fireEvent.change(contextSelect, { target: { value: "business" } });
    fireEvent.click(funModeCheckbox);

    expect(onLanguageLevelChange).toHaveBeenCalledWith("formal");
    expect(onContextChange).toHaveBeenCalledWith("business");
    expect(onFunModeChange).toHaveBeenCalledWith(true);
  });

  it("supports an enabled Fun Mode value and disables all controls when requested", () => {
    const { rerender } = render(
      <TranslationOptions
        languageLevel="academic"
        context="education"
        funMode
        onLanguageLevelChange={vi.fn()}
        onContextChange={vi.fn()}
        onFunModeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox", { name: /Fun Mode/ })).toBeChecked();

    rerender(
      <TranslationOptions
        languageLevel="academic"
        context="education"
        funMode
        onLanguageLevelChange={vi.fn()}
        onContextChange={vi.fn()}
        onFunModeChange={vi.fn()}
        disabled
      />,
    );

    expect(screen.getByRole("combobox", { name: "ระดับภาษา" })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "บริบท" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: /Fun Mode/ })).toBeDisabled();
  });
});
