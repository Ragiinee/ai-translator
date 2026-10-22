export default function Header() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <p className="font-[family-name:var(--font-pixel)] text-[0.7rem] tracking-wide text-[var(--ink)] sm:text-xs">
            AI Translator
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            ส่งข้อความมา แล้วให้เราช่วยแปล
          </p>
        </div>
        <nav aria-label="เมนูหลัก" className="hidden items-center gap-3 text-sm sm:flex">
          <a
            href="#workspace"
            className="px-2 py-1 text-[var(--ink)] outline-none hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            แปลภาษา
          </a>
          <a
            href="#result"
            className="px-2 py-1 text-[var(--ink)] outline-none hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            ผลลัพธ์
          </a>
        </nav>
      </div>
    </header>
  );
}
