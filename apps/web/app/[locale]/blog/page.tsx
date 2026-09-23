import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/strapi";
import type { Locale } from "@/i18n/routing";

const fallbackColors = ["bg-green-600", "bg-lime-500", "bg-amber-500"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("blog");
  const articles = await getArticles(locale as Locale);

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
        <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-3 lg:px-8">
          {articles.map((article, index) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="overflow-hidden rounded-3xl border transition hover:border-green-700"
            >
              <article>
                {article.coverImageUrl ? (
                  <div className="relative h-44">
                    <Image
                      src={article.coverImageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`h-44 ${fallbackColors[index % fallbackColors.length]}`} />
                )}
                <div className="p-6">
                  <span className="text-xs font-black tracking-widest text-green-700">
                    {t(`category.${article.category}`).toUpperCase()}
                  </span>
                  <h2 className="mt-2 text-2xl font-black">{article.title}</h2>
                  <p className="mt-3 text-sm text-slate-500">{article.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-bold text-green-700">
                    {t("readMore")} →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
