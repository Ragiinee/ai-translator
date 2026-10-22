
"use client";

import { useEffect, useState } from "react";
import type { CharacterState } from "@/types/translation";

export const RECEIVE_ANIMATION_MS = 520;

const STATE_LABELS: Record<CharacterState, string> = {
  idle: "พร้อมรับเอกสาร",
  waiting: "รอข้อความจากคุณ",
  receiving: "รับเอกสารแล้ว",
  translating: "กำลังแปลอยู่...",
  completed: "แปลเสร็จแล้ว!",
};

const DIALOGUES: Record<CharacterState, string[]> = {
  idle: [
    "มีเอกสารให้แปลไหมครับ?",
    "พร้อมทำงานแล้ว!",
    "วันนี้มีอะไรให้ช่วยบ้าง?",
  ],
  waiting: [
    "พิมพ์ข้อความได้เลยครับ",
    "ผมรออยู่นะ...",
    "เอกสารอยู่ไหนเอ่ย?",
  ],
  receiving: [
    "รับเอกสารแล้วครับ!",
    "ขอดูหน่อย...",
    "ส่งมาเลย เดี๋ยวจัดการให้!",
  ],
  translating: [
    "ขอคิดแป๊บนึง...",
    "กำลังเรียบเรียงอยู่ครับ",
    "คำนี้ใช้แบบไหนดีนะ?",
    "ตรวจอีกนิด...",
  ],
  completed: [
    "เสร็จแล้วครับ! งานดีไม่มีแก้",
    "เรียบร้อย รับกลับได้เลย!",
    "แปลให้แล้วครับ อย่าลืมตรวจด้วยนะ",
    "เรียบร้อยครับ ค่าบริการ... ล้อเล่น!",
  ],
};

interface PixelCharacterProps {
  state: CharacterState;
}

export default function PixelCharacter({ state }: PixelCharacterProps) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(true);

  // เริ่มบทพูดใหม่เมื่อสถานะการทำงานเปลี่ยน
  useEffect(() => {
    setDialogueIndex(0);
    setIsSpeaking(true);
  }, [state]);

  // สลับบทพูดเป็นระยะ โดยไม่ใช้ browser timer นอก effect
  useEffect(() => {
    if (state === "receiving") return;

    const interval = window.setInterval(() => {
      setDialogueIndex((current) => {
        const next = (current + 1) % DIALOGUES[state].length;
        return next;
      });
      setIsSpeaking(true);
    }, state === "translating" ? 2600 : 3800);

    return () => window.clearInterval(interval);
  }, [state]);

  // ทำให้ปากขยับสลับเปิด-ปิดระหว่างพูด
  useEffect(() => {
    if (!isSpeaking) return;

    const timeout = window.setTimeout(() => {
      setIsSpeaking(false);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [isSpeaking, dialogueIndex]);

  // สถานะ receiving สั้นมาก จึงใช้ข้อความคงที่ให้ตรงกับแอนิเมชันรับเอกสาร
  const dialogue =
    state === "receiving"
      ? DIALOGUES.receiving[0]
      : DIALOGUES[state][dialogueIndex];

  return (
    <div
      className={`pixel-scene pixel-scene--${state}`}
      data-character-state={state}
      role="group"
      aria-label={`พนักงานแปลภาษา: ${STATE_LABELS[state]}`}
    >
      <div className="pixel-dialogue" aria-live="polite">
        <span className="pixel-dialogue__text" key={`${state}-${dialogueIndex}`}>
          {dialogue}
        </span>
        <span className="pixel-dialogue__tail" aria-hidden="true" />
      </div>

      <svg
        className="pixel-mascot"
        viewBox="0 0 160 120"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        {/* Wall */}
        <g className="pixel-mascot__wall">
          <rect x="0" y="0" width="160" height="78" fill="#D4C9BA" />
          <rect x="0" y="0" width="160" height="4" fill="#C4B7A6" />

          {/* Shelf */}
          <rect x="10" y="16" width="30" height="4" fill="#8F7356" />
          <rect x="12" y="20" width="8" height="14" fill="#6E4E36" />
          <rect x="22" y="22" width="8" height="12" fill="#8B3E2F" />
          <rect x="32" y="24" width="6" height="10" fill="#3D6A78" />

          {/* Window */}
          <rect x="118" y="14" width="30" height="24" fill="#8F7356" />
          <rect x="120" y="16" width="26" height="20" fill="#E8F0F2" />
          <rect x="132" y="16" width="2" height="20" fill="#8F7356" />
          <rect x="120" y="25" width="26" height="2" fill="#8F7356" />
        </g>

        {/* Body */}
        <g className="pixel-mascot__body">
          <rect x="58" y="8" width="36" height="8" fill="#3A2A20" />
          <rect x="54" y="14" width="8" height="16" fill="#3A2A20" />
          <rect x="90" y="14" width="8" height="16" fill="#3A2A20" />
          <rect x="58" y="16" width="36" height="4" fill="#2A1E17" />

          <rect x="60" y="16" width="32" height="30" fill="#E6B890" />
          <rect x="60" y="40" width="32" height="6" fill="#C9926E" />
          <rect x="58" y="16" width="2" height="30" fill="#C9926E" />
          <rect x="92" y="16" width="2" height="30" fill="#C9926E" />

          {/* Eyes */}
          <g className="pixel-mascot__eyes">
            <rect
              className="pixel-mascot__eye"
              x="66"
              y="26"
              width="4"
              height="4"
              fill="#2C2925"
            />
            <rect
              className="pixel-mascot__eye"
              x="82"
              y="26"
              width="4"
              height="4"
              fill="#2C2925"
            />
            <rect x="66" y="26" width="2" height="2" fill="#F7F2EC" />
            <rect x="82" y="26" width="2" height="2" fill="#F7F2EC" />
          </g>

          {/* Mouth: CSS switches between normal and speaking */}
          <rect
            className="pixel-mascot__mouth"
            x="72"
            y="36"
            width="8"
            height="2"
            fill="#A86B52"
          />
          <rect
            className="pixel-mascot__mouth-happy"
            x="70"
            y="34"
            width="12"
            height="4"
            fill="#A86B52"
            opacity="0"
          />
          <rect
            className={`pixel-mascot__mouth-speaking ${isSpeaking ? "is-speaking" : ""
              }`}
            x="72"
            y="34"
            width="8"
            height="4"
            fill="#754334"
          />

          <rect x="70" y="46" width="12" height="6" fill="#C9926E" />

          {/* Shirt */}
          <rect x="56" y="50" width="40" height="28" fill="#3D6A78" />
          <rect x="56" y="50" width="40" height="4" fill="#2C5160" />
          <rect x="72" y="54" width="8" height="18" fill="#E8E0D6" />
          <rect x="56" y="70" width="40" height="8" fill="#2C5160" />
        </g>

        {/* Desk */}
        <g className="pixel-mascot__desk">
          <rect x="4" y="72" width="152" height="12" fill="#B8956C" />
          <rect x="4" y="72" width="152" height="2" fill="#C9A67A" />
          <rect x="4" y="84" width="152" height="8" fill="#9A754C" />
          <rect x="4" y="92" width="152" height="6" fill="#7A5A38" />
          <rect x="10" y="98" width="10" height="16" fill="#6A4C30" />
          <rect x="140" y="98" width="10" height="16" fill="#6A4C30" />
        </g>

        {/* Arms */}
        <g className="pixel-mascot__arms">
          <rect
            className="pixel-mascot__arm-left"
            x="42"
            y="56"
            width="14"
            height="20"
            fill="#3D6A78"
          />
          <rect
            className="pixel-mascot__hand-left"
            x="38"
            y="74"
            width="14"
            height="8"
            fill="#E6B890"
          />
          <rect
            className="pixel-mascot__arm-right"
            x="96"
            y="56"
            width="14"
            height="20"
            fill="#3D6A78"
          />
          <rect
            className="pixel-mascot__hand-right"
            x="100"
            y="74"
            width="14"
            height="8"
            fill="#E6B890"
          />
        </g>

        {/* Props */}
        <g className="pixel-mascot__props">
          <rect
            className="pixel-mascot__book"
            x="14"
            y="62"
            width="20"
            height="14"
            fill="#8B3E2F"
          />
          <rect x="14" y="62" width="20" height="2" fill="#A85A48" />
          <rect x="16" y="66" width="16" height="2" fill="#F3EEE6" />
          <rect x="16" y="70" width="12" height="2" fill="#F3EEE6" />

          <g className="pixel-mascot__paper-in">
            <rect
              x="52"
              y="64"
              width="24"
              height="12"
              fill="#FFFCF7"
              stroke="#C4B8A8"
              strokeWidth="2"
            />
            <rect x="56" y="68" width="16" height="2" fill="#D9D0C4" />
            <rect x="56" y="72" width="12" height="2" fill="#D9D0C4" />
          </g>

          <g className="pixel-mascot__paper-out">
            <rect
              x="96"
              y="64"
              width="24"
              height="12"
              fill="#FFFCF7"
              stroke="#C4B8A8"
              strokeWidth="2"
            />
            <rect x="100" y="68" width="16" height="2" fill="#2F6F62" />
            <rect x="100" y="72" width="12" height="2" fill="#D9D0C4" />
          </g>

          <g className="pixel-mascot__pen">
            <rect x="128" y="70" width="16" height="4" fill="#2C2925" />
            <rect x="142" y="70" width="4" height="4" fill="#2F6F62" />
          </g>
        </g>
      </svg>

      <p className="pixel-scene__status" aria-live="polite">
        {STATE_LABELS[state]}
      </p>
    </div>
  );
}
