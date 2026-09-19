"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  am: "አማርኛ",
  om: "Afaan Oromoo",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1 text-xs font-semibold">
      {routing.locales.map((code) => (
        <button
          key={code}
          onClick={() => router.replace(pathname, { locale: code })}
          aria-current={code === locale}
          className={`rounded px-2 py-1 ${
            code === locale
              ? "bg-green-100 text-green-800"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
