
import type { CharacterState } from "@/types/translation";
import type { ReactNode } from "react";

interface PaperHandoffProps {
  state: CharacterState;
  children: ReactNode;
}

export default function PaperHandoff({
  state,
  children,
}: PaperHandoffProps) {
  return (
    <div className={`paper-handoff paper-handoff--${state}`}>
      {/* กระดาษและส่วนที่ผู้ใช้โต้ตอบได้ */}
      <div className="w-full md:w-[600px] lg:w-[800px] max-w-[1200px]">
        <div className="paper-handoff__document">
          <div className="paper-handoff__content">
            {children}
          </div>
        </div>

      </div>

      {/* มืออยู่ด้านหน้าขอบล่างของกระดาษ */}
      <svg
        className="paper-handoff__hands"
        viewBox="0 0 240 120"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {/* แขนซ้าย */}
        <g className="paper-handoff__hand--left paper-handoff__hand">
          {/* แขนเสื้อ */}
          <rect x="0" y="84" width="24" height="36" fill="#3D6A78" />

          {/* ฝ่ามือ */}
          <rect x="12" y="58" width="30" height="24" fill="#E6B890" />

          {/* นิ้วมือ */}
          <rect x="6" y="66" width="10" height="20" fill="#E6B890" />
          <rect x="16" y="76" width="8" height="16" fill="#E6B890" />
          <rect x="24" y="78" width="8" height="14" fill="#E6B890" />
          <rect x="32" y="70" width="10" height="18" fill="#E6B890" />

          {/* ข้อมือ */}
          <rect x="18" y="82" width="20" height="10" fill="#E6B890" />
        </g>

        {/* แขนขวา */}
        <g className="paper-handoff__hand--right paper-handoff__hand">
          {/* แขนเสื้อ */}
          <rect x="216" y="84" width="24" height="36" fill="#3D6A78" />

          {/* ฝ่ามือ */}
          <rect x="198" y="58" width="30" height="24" fill="#E6B890" />

          {/* นิ้วมือ */}
          <rect x="224" y="66" width="10" height="20" fill="#E6B890" />
          <rect x="216" y="76" width="8" height="16" fill="#E6B890" />
          <rect x="208" y="78" width="8" height="14" fill="#E6B890" />
          <rect x="198" y="70" width="10" height="18" fill="#E6B890" />

          {/* ข้อมือ */}
          <rect x="202" y="82" width="20" height="10" fill="#E6B890" />
        </g>
      </svg>
    </div>
  );
}
