import type { CharacterState } from "@/types/translation";

/** Thai dialogue lines keyed by character/application state. */
export const DIALOGUE_BY_STATE: Record<CharacterState, string[]> = {
  idle: [
    "ว่างมากเลย… เอากระดาษมานี่สิ",
    "นั่งรอแปลทั้งวันเลยนะ",
    "มีอะไรจะให้แปลไหม หรือมาคุยเล่น",
  ],
  waiting: [
    "โอเค อ่านร่างบนมือคุณแล้วนะ",
    "ส่งมาก็ได้ อย่าลังเล",
    "ข้อความพร้อมแล้วใช่ไหม",
  ],
  receiving: [
    "รับแล้ว ๆ วางบนโต๊ะก่อน",
    "เอกสารมาถึงโต๊ะแล้ว",
  ],
  translating: [
    "กำลังแปลอยู่ อย่ารีบ…",
    "แป๊บนึงนะ กำลังคิดคำ",
    "อย่าเพิ่งกระตุกจอ",
  ],
  completed: [
    "เสร็จแล้ว อ่านเองนะ",
    "ง่ายจัง ทำไมไม่แปลเองละ",
    "คำแปลอยู่ด้านล่างแล้ว ชมฉันหน่อยสิ",
    "เสร็จไวใช่ไหม อย่าลืมว่านี่เป็น mock นะ",
  ],
};

/** Comfortable reading pace between line changes (ms). */
export const DIALOGUE_ROTATE_MS = 4200;

/** Mouth frame toggle while a line is being “spoken” (ms). */
export const MOUTH_FRAME_MS = 180;

export type MouthFrame = "closed" | "open" | "smile";
