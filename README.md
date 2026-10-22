# 🤖 AI Translator - แอปพลิเคชันแปลภาษาด้วย AI พร้อมมาสคอตพิกเซล

> เว็บแอปพลิเคชันแปลภาษาอัจฉริยะ พัฒนาขึ้นเป็น **Personal Project** โดยเชื่อมต่อกับ **Google Gemini LLM API** เพื่อการแปลภาษาเชิงบริบท มาพร้อมพนักงานแปลภาษาประจำออฟฟิศที่เป็นตัวการ์ตูนพิกเซลย้อนยุค ซึ่งจะคอยส่งข้อความทักทายและเปลี่ยนท่าทางโต้ตอบกับคุณตลอดการใช้งาน!

---

## 🔗 Quick Links / ลิงก์เข้าชมผลงาน
- 🌐 **Live Demo (เว็บไซต์ผลงาน):** [https://pixer-ai-translator.vercel.app/](https://pixer-ai-translator.vercel.app/) 
- 👨‍💻 **My Portfolio (เว็บไซต์ส่วนตัว):** [https://nopparat-portfoliov2.vercel.app/?job=fullstack](https://nopparat-portfoliov2.vercel.app/?job=fullstack)

---

## ✨ ไฮไลต์และฟีเจอร์เด่น (Key Features)

- **Smart LLM Translation:** ขับเคลื่อนด้วย **Google Gemini API** ไม่เพียงแค่แปลคำต่อคำ แต่ยังอธิบายบริบท สรุปกลุ่มคำศัพท์สำคัญ และคืนค่าผลลัพธ์เป็น Structured Data (JSON)
- **Interactive Pixel Character (`PixelCharacter`):** มาสคอตประจำเว็บที่มี State และ Dialogue ระบบสลับบทพูดและขยับปากตามสถานะการทำงาน (เช่น สภาพพร้อมทำงาน, รับเอกสาร, กำลังคิดคำแปล หรือแปลเสร็จสิ้น)
- **Customizable Translation Styles:** ปรับแต่งความทางการของภาษา (Language Level) หรือเลือกเปิดโหมดสนุกสนาน (Fun Mode) ได้
- **Robust Automated Testing:** มีระบบ Unit Test ครอบคลุมทั้ง Backend API Route, Frontend Components และตัวละครพิกเซล เพื่อความถูกต้องของระบบ

---

## 💡 Note on AI-Assisted Development & LLM API

โปรเจกต์นี้ถูกสร้างขึ้นเพื่อฝึกฝนทักษะการพัฒนาเว็บด้วย **Next.js** และการประยุกต์ใช้เทคโนโลยี AI ใน 2 มิติหลัก:

1. **LLM API Integration:** เชื่อมต่อ Next.js API Routes กับ **Google Gemini API** เพื่อดึงความสามารถในการประมวลผลภาษาธรรมชาติ (NLP) วิเคราะห์บริบท และส่งกลับข้อมูลโครงสร้าง JSON มาแสดงผลใน UI
2. **AI-Assisted Development Workflow:** ใช้ AI เป็นผู้ช่วยในการช่วยออกแบบโครงสร้างโปรเจกต์, Refactor โค้ด และออกแบบชุดทดสอบคุณภาพ (Unit Testing) เพื่อจำลองกระบวนการพัฒนาซอฟต์แวร์ยุคใหม่

---

## 🛠️ เครื่องมือและเทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend & UI:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **AI Integration:** Google GenAI SDK (`@google/genai`)
- **Testing Framework:** Vitest, `@testing-library/react`, `jsdom`
- **Deployment:** Vercel

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
ai_translator/
├── app/                  # Next.js App Router (Pages และ app/api/translate/route.ts)
├── components/           # UI Components (translator/ และ character/PixelCharacter.tsx)
├── lib/                  # Utilities และ Helper functions (mock-translation.ts)
├── types/                # TypeScript Interfaces (translation.ts)
├── AGENTS.md             # ข้อกำหนดและ System Rules เข้มงวดสำหรับ AI Agents (Off-limits / ห้ามแก้ไข)
├── unittest.md           # ข้อกำหนด กรอบการทดสอบ และ Tech Stack สำหรับการทำ Unit Test
├── unit-test-plan.md     # สรุปแผนการทดสอบและเคสการทดสอบ (Test Cases) ของระบบ
└── context.md            # สรุปภาพรวมบริบท โครงสร้างโปรเจกต์ และ Business Logic หลักสำหรับ AI / Developers

```