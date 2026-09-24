import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow, Button } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getProduct, getProducts } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const products = await getProducts(params.locale as Locale);
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug, locale as Locale);
  if (!product) return {};
  return buildMetadata({
    locale: locale as Locale,
    path: `/products/${slug}`,
    title: product.name,
    description: product.description,
    image: product.imageUrl,
  });
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("products");
  const product = await getProduct(slug, locale as Locale);

  if (!product) notFound();

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Link href="/products" className="text-sm font-bold text-green-700">
            {t("backToProducts")}
          </Link>
          <Eyebrow>{t(`stage.${product.stage}`)}</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">{product.description}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            {product.imageUrl ? (
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                {product.name}
              </div>
            )}
          </div>

          <div>
            {product.details.length > 0 && (
              <ul className="space-y-3">
                {product.details.map((detail) => (
                  <li key={detail} className="flex gap-3 text-slate-700">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#58c900]" />
                    {detail}
                  </li>
                ))}
              </ul>
            )}

            {product.body && (
              <div className="mt-8 whitespace-pre-line text-base leading-7 text-slate-700">
                {product.body}
              </div>
            )}

            <div className="mt-10">
              <Button href="/contact">{t("requestQuote")}</Button>
            </div>
          </div>
        </div>
      </section>

      {product.galleryUrls && product.galleryUrls.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="mb-6 text-2xl font-black">{t("galleryHeading")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.galleryUrls.map((url) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image src={url} alt={product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
