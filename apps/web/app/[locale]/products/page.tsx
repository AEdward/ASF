import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { getProducts } from "@/lib/strapi";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Products({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("products");
  const products = await getProducts(locale as Locale);

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            {t("heading")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 lg:px-8">
          {products.map((product, index) => (
            <article key={product.slug} className="rounded-3xl border p-7">
              <span className="text-xs font-black tracking-widest text-green-700">
                {String(index + 1).padStart(2, "0")} · {t(`stage.${product.stage}`)}
              </span>
              <h2 className="mt-3 text-3xl font-black">{product.name}</h2>
              <p className="mt-3 text-slate-500">{product.description}</p>
              {product.details.length > 0 && (
                <ul className="mt-5 space-y-2 pl-5 text-sm text-slate-600">
                  {product.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
