import type { Metadata } from "next";
import { Press_Start_2P, Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-body",
  weight: ["400", "600", "700"],
  subsets: ["thai", "latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Translator",
  description: "ส่งข้อความมา แล้วให้เราช่วยแปล — Minimal Pixel Art Office",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${sarabun.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body className="flex flex-col min-h-full font-[family-name:var(--font-body)]">
        {children}
      </body>
    </html>
  );
}
