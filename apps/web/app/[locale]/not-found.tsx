import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Eyebrow, Button } from "@/components/ui";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-28">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <div className="flex justify-center">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
            {t("heading")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
            {t("subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/">{t("homeCta")}</Button>
            <Button href="/contact" secondary>
              {t("contactCta")}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
