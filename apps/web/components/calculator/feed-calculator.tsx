"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import { CalculatorReport } from "@/components/calculator/calculator-report";
import type { FeedRate } from "@/lib/content";

function formatKg(kg: number): string {
  if (kg <= 0) return "0 g";
  if (kg < 1) return `${Math.round(kg * 1000).toLocaleString()} g`;
  return `${kg.toLocaleString(undefined, { maximumFractionDigits: kg < 10 ? 2 : 1 })} kg`;
}

function formatMoney(value: number): string {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ETB`;
}

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
    const feedingsPerDay = Math.max(1, rate.feedingsPerDay || 1);

    const perAnimalDailyKg = rate.dailyKgPerAnimal;
    const perFeedingKg = perAnimalDailyKg / feedingsPerDay;
    const herdDailyKg = perAnimalDailyKg * safeCount;

    const planningTotalKg = herdDailyKg * safeDays;
    const planningTotalBags = Math.ceil(planningTotalKg / rate.bagSizeKg);

    const hasPrice = typeof rate.pricePerKg === "number" && rate.pricePerKg > 0;
    const perAnimalCostDay = hasPrice ? perAnimalDailyKg * (rate.pricePerKg as number) : 0;
    const herdCostDay = hasPrice ? herdDailyKg * (rate.pricePerKg as number) : 0;

    return {
      perFeedingKg,
      feedingsPerDay,
      herdDailyKg,
      planningTotalKg,
      planningTotalBags,
      hasPrice,
      perAnimalCostDay,
      herdCostDay,
    };
  }, [rate, count, days]);

  if (!rate || !result) return null;

  return (
    <>
    <div className="no-print grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 lg:sticky lg:top-24 lg:self-start">
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

      <div className="grid gap-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border border-green-700 px-5 py-2.5 text-sm font-extrabold text-green-700 hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            {t("downloadPdf")} ↓
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <h2 className="text-xs font-black uppercase tracking-widest text-green-700">
              {t("perAnimalHeading")}
            </h2>
            <p className="mt-4 text-sm text-slate-500">{t("dailyAmountLabel")}</p>
            <p className="text-3xl font-black text-slate-900">{formatKg(rate.dailyKgPerAnimal)}</p>

            <p className="mt-4 text-sm text-slate-500">{t("perFeedingLabel")}</p>
            <p className="text-lg font-bold text-slate-900">
              {formatKg(result.perFeedingKg)}{" "}
              <span className="text-sm font-semibold text-slate-500">
                ({t("feedingsPerDayValue", { n: result.feedingsPerDay })})
              </span>
            </p>

            {result.hasPrice && (
              <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t("costDayLabel")}</dt>
                  <dd className="font-bold text-slate-900">{formatMoney(result.perAnimalCostDay)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t("costWeekLabel")}</dt>
                  <dd className="font-bold text-slate-900">{formatMoney(result.perAnimalCostDay * 7)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t("costMonthLabel")}</dt>
                  <dd className="font-bold text-slate-900">{formatMoney(result.perAnimalCostDay * 30)}</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <h2 className="text-xs font-black uppercase tracking-widest text-green-700">
              {t("herdHeading")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t("herdAnimalsLabel", { count })}</p>

            <p className="mt-4 text-sm text-slate-500">{t("herdDailyAmountLabel")}</p>
            <p className="text-3xl font-black text-slate-900">{formatKg(result.herdDailyKg)}</p>

            {result.hasPrice ? (
              <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t("costDayLabel")}</dt>
                  <dd className="font-bold text-slate-900">{formatMoney(result.herdCostDay)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t("costWeekLabel")}</dt>
                  <dd className="font-bold text-slate-900">{formatMoney(result.herdCostDay * 7)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t("costMonthLabel")}</dt>
                  <dd className="font-bold text-slate-900">{formatMoney(result.herdCostDay * 30)}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
                {t("noPriceNote")}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-[#0f2e17] p-8 text-white">
          <h2 className="text-xl font-black">{t("resultHeading")}</h2>

          <div className="mt-6 space-y-1">
            <p className="text-sm text-green-200">{t("totalKg")}</p>
            <p className="text-4xl font-black">{formatKg(result.planningTotalKg)}</p>
          </div>

          <p className="mt-4 text-sm text-green-100">
            {t("totalBags", { count: result.planningTotalBags, size: rate.bagSizeKg })}
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
    </div>
    <CalculatorReport rate={rate} count={count} days={days} result={result} />
    </>
  );
}
