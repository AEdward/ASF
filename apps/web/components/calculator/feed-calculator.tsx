"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import type { FeedRate } from "@/lib/content";

export function FeedCalculator({ rates }: { rates: FeedRate[] }) {
  const t = useTranslations("calculator");
  const [animalKey, setAnimalKey] = useState(rates[0]?.animalKey ?? "");
  const [count, setCount] = useState(10);
  const [days, setDays] = useState(30);

  const rate = rates.find((r) => r.animalKey === animalKey) ?? rates[0];

  const result = useMemo(() => {
    if (!rate) return null;
    const safeCount = Math.max(0, count);
    const safeDays = Math.max(0, days);
    const totalKg = rate.dailyKgPerAnimal * safeCount * safeDays;
    const totalBags = Math.ceil(totalKg / rate.bagSizeKg);
    return { totalKg, totalBags };
  }, [rate, count, days]);

  if (!rate) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-8">
        <div className="grid gap-6">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">{t("animalLabel")}</span>
            <select
              value={animalKey}
              onChange={(e) => setAnimalKey(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              {rates.map((r) => (
                <option key={r.animalKey} value={r.animalKey}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">{t("countLabel")}</span>
            <input
              type="number"
              min={0}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">{t("daysLabel")}</span>
            <input
              type="number"
              min={0}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl bg-[#0f2e17] p-8 text-white">
        <h2 className="text-xl font-black">{t("resultHeading")}</h2>

        <div className="mt-6 space-y-1">
          <p className="text-sm text-green-200">{t("totalKg")}</p>
          <p className="text-4xl font-black">{result?.totalKg.toLocaleString(undefined, { maximumFractionDigits: 1 }) ?? 0} kg</p>
        </div>

        <p className="mt-4 text-sm text-green-100">
          {t("totalBags", { count: result?.totalBags ?? 0, size: rate.bagSizeKg })}
        </p>
        <p className="mt-1 text-sm text-green-100">
          {t("perDay", { kg: rate.dailyKgPerAnimal })}
        </p>

        {rate.recommendedProductSlug && (
          <div className="mt-6 rounded-2xl bg-white/10 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-green-200">
              {t("recommendedProduct")}
            </p>
            <Link
              href={`/products/${rate.recommendedProductSlug}`}
              className="mt-2 inline-block text-sm font-bold text-white hover:underline"
            >
              {t("viewProduct")}
            </Link>
          </div>
        )}

        <p className="mt-6 text-xs text-green-200">{t("disclaimer")}</p>
        <div className="mt-6">
          <Button href="/contact">{t("contactCta")}</Button>
        </div>
      </div>
    </div>
  );
}
