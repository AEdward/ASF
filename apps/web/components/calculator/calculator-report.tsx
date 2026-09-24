import { useLocale, useTranslations } from "next-intl";
import type { FeedRate } from "@/lib/content";

interface CalculatorResult {
  perFeedingKg: number;
  feedingsPerDay: number;
  herdDailyKg: number;
  planningTotalKg: number;
  planningTotalBags: number;
  hasPrice: boolean;
  perAnimalCostDay: number;
  herdCostDay: number;
}

function formatKg(kg: number): string {
  if (kg <= 0) return "0 g";
  if (kg < 1) return `${Math.round(kg * 1000).toLocaleString()} g`;
  return `${kg.toLocaleString(undefined, { maximumFractionDigits: kg < 10 ? 2 : 1 })} kg`;
}

function formatMoney(value: number): string {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ETB`;
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: "1px solid #e2e8f0",
        fontSize: "12px",
      }}
    >
      <span style={{ color: "#475569" }}>{label}</span>
      <span style={{ fontWeight: 700, color: "#0f2e17" }}>{value}</span>
    </div>
  );
}

export function CalculatorReport({
  rate,
  count,
  days,
  result,
}: {
  rate: FeedRate;
  count: number;
  days: number;
  result: CalculatorResult;
}) {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const generatedDate = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="print-only">
      <div style={{ position: "relative", width: "210mm", minHeight: "297mm", margin: "0 auto" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> loads eagerly even while display:none, unlike next/image's lazy loading, which never fires for this print-only, off-screen element */}
        <img
          src="/report-letterhead.webp"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: "22%",
            paddingBottom: "22%",
            paddingLeft: "8%",
            paddingRight: "8%",
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#102018",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#0f2e17", margin: 0 }}>
            {t("reportTitle")}
          </h1>
          <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
            {t("generatedOn", { date: generatedDate })}
          </p>

          <ReportRow label={t("animalLabel")} value={rate.label} />
          <ReportRow label={t("countLabel")} value={String(count)} />
          <ReportRow label={t("daysLabel")} value={String(days)} />

          <h2
            style={{
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#15803d",
              marginTop: "20px",
              marginBottom: "6px",
            }}
          >
            {t("perAnimalHeading")}
          </h2>
          <ReportRow label={t("dailyAmountLabel")} value={formatKg(rate.dailyKgPerAnimal)} />
          <ReportRow
            label={t("perFeedingLabel")}
            value={`${formatKg(result.perFeedingKg)} (${t("feedingsPerDayValue", { n: result.feedingsPerDay })})`}
          />
          {result.hasPrice && (
            <>
              <ReportRow label={t("costDayLabel")} value={formatMoney(result.perAnimalCostDay)} />
              <ReportRow label={t("costWeekLabel")} value={formatMoney(result.perAnimalCostDay * 7)} />
              <ReportRow label={t("costMonthLabel")} value={formatMoney(result.perAnimalCostDay * 30)} />
            </>
          )}

          <h2
            style={{
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#15803d",
              marginTop: "20px",
              marginBottom: "6px",
            }}
          >
            {t("herdHeading")}
          </h2>
          <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
            {t("herdAnimalsLabel", { count })}
          </p>
          <ReportRow label={t("herdDailyAmountLabel")} value={formatKg(result.herdDailyKg)} />
          {result.hasPrice && (
            <>
              <ReportRow label={t("costDayLabel")} value={formatMoney(result.herdCostDay)} />
              <ReportRow label={t("costWeekLabel")} value={formatMoney(result.herdCostDay * 7)} />
              <ReportRow label={t("costMonthLabel")} value={formatMoney(result.herdCostDay * 30)} />
            </>
          )}

          <h2
            style={{
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#15803d",
              marginTop: "20px",
              marginBottom: "6px",
            }}
          >
            {t("planningHeading")}
          </h2>
          <ReportRow label={t("totalKg")} value={formatKg(result.planningTotalKg)} />
          <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px" }}>
            {t("totalBags", { count: result.planningTotalBags, size: rate.bagSizeKg })}
          </p>

          <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "18px" }}>{t("disclaimer")}</p>
        </div>
      </div>
    </div>
  );
}
