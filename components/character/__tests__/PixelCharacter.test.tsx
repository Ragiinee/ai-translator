import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PixelCharacter from "../PixelCharacter";
import type { CharacterState } from "@/types/translation";

const stateLabels: Record<CharacterState, string> = {
  idle: "พร้อมรับเอกสาร",
  waiting: "รอข้อความจากคุณ",
  receiving: "รับเอกสารแล้ว",
  translating: "กำลังแปลอยู่...",
  completed: "แปลเสร็จแล้ว!",
};

afterEach(() => {
  vi.useRealTimers();
});

describe("PixelCharacter", () => {
  it.each(Object.entries(stateLabels) as [CharacterState, string][])(
    "renders the %s state with accessible labels and status",
    (state, label) => {
      const { container } = render(<PixelCharacter state={state} />);
      const character = screen.getByRole("group", {
        name: `พนักงานแปลภาษา: ${label}`,
      });

      expect(character).toHaveAttribute("data-character-state", state);
      expect(
        screen.getByText(label, { selector: ".pixel-scene__status" }),
      ).toHaveAttribute("aria-live", "polite");
      expect(
        screen.getByText(/.+/, { selector: ".pixel-dialogue__text" }),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".pixel-dialogue"),
      ).toHaveAttribute("aria-live", "polite");
      expect(container.querySelector("svg")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    },
  );

  it("cycles through dialogue and resets to the first line when the state changes", () => {
    vi.useFakeTimers();
    const { rerender } = render(<PixelCharacter state="idle" />);

    expect(screen.getByText("มีเอกสารให้แปลไหมครับ?")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3800);
    });
    expect(screen.getByText("พร้อมทำงานแล้ว!")).toBeInTheDocument();

    rerender(<PixelCharacter state="waiting" />);
    expect(screen.getByText("พิมพ์ข้อความได้เลยครับ")).toBeInTheDocument();
  });

  it("keeps the receiving dialogue stable", () => {
    vi.useFakeTimers();
    render(<PixelCharacter state="receiving" />);

    expect(screen.getByText("รับเอกสารแล้วครับ!")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByText("รับเอกสารแล้วครับ!")).toBeInTheDocument();
  });
});
