"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();
  const t = useTranslations("search");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("placeholder")}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-[#58c900] px-6 py-3 text-sm font-extrabold text-[#092713] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
      >
        {t("submit")}
      </button>
    </form>
  );
}
