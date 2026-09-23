import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getArticle, getArticles } from "@/lib/strapi";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const articles = await getArticles(params.locale as Locale);
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(slug, locale as Locale);
  return { title: article?.title, description: article?.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("blog");
  const article = await getArticle(slug, locale as Locale);

  if (!article) notFound();

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <Link href="/blog" className="text-sm font-bold text-green-700">
            {t("backToBlog")}
          </Link>
          <Eyebrow>{t(`category.${article.category}`)}</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            {article.title}
          </h1>
        </div>
      </section>

      {article.coverImageUrl && (
        <div className="mx-auto -mt-8 max-w-4xl px-5 lg:px-8">
          <div className="relative h-72 overflow-hidden rounded-3xl sm:h-96">
            <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="whitespace-pre-line text-lg leading-8 text-slate-700">
            {article.content || article.excerpt}
          </div>
        </div>
      </section>
    </main>
  );
}
