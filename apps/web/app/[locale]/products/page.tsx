import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { ProductImageCard } from "@/components/products/product-image-card";
import { Link } from "@/i18n/navigation";
import { getProducts } from "@/lib/strapi";
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd, JsonLd, SITE_URL } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/products",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function Products({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("products");
  const tc = await getTranslations("common");
  const products = await getProducts(locale as Locale);
  const mainProducts = products.filter((product) => product.imageUrl);
  const upcomingProjects = products.filter((product) => !product.imageUrl);

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tc("breadcrumbHome"), path: "" },
            { name: t("metaTitle"), path: "/products" },
          ],
          locale as Locale
        )}
      />
      <JsonLd
        data={itemListJsonLd(
          mainProducts.map((product) => ({
            name: product.name,
            url: `${SITE_URL}/${locale}/products/${product.slug}`,
          }))
        )}
      />
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
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {mainProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="flex flex-col items-center text-center transition hover:-translate-y-1"
            >
              <div className="w-full max-w-[280px]">
                <ProductImageCard imageUrl={product.imageUrl as string} name={product.name} />
              </div>
              <span className="mt-6 text-xs font-black tracking-widest text-green-700">
                {t(`stage.${product.stage}`)}
              </span>
              <h2 className="mt-2 text-2xl font-black">{product.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{product.description}</p>
              {product.details.length > 0 && (
                <ul className="mt-4 space-y-1 text-sm text-slate-600">
                  {product.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </Link>
          ))}
        </div>
      </section>

      {upcomingProjects.length > 0 && (
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Eyebrow>{t("upcomingProjectsEyebrow")}</Eyebrow>
            <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              {t("upcomingProjectsHeading")}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {upcomingProjects.map((project) => (
                <article key={project.slug} className="rounded-3xl border bg-white p-7">
                  <span className="text-xs font-black tracking-widest text-green-700">
                    {t(`stage.${project.stage}`)}
                  </span>
                  <h3 className="mt-3 text-2xl font-black">{project.name}</h3>
                  <p className="mt-3 text-slate-500">{project.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
