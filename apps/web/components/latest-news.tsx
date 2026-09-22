import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/ui";
import type { Article } from "@/lib/content";

const fallbackColors = ["bg-green-600", "bg-lime-500", "bg-amber-500"];

export function LatestNews({ articles }: { articles: Article[] }) {
  const t = useTranslations("home.latestNews");

  if (articles.length === 0) return null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              {t("heading")}
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-bold text-green-700">
            {t("viewAll")}
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {articles.map((article, index) => (
            <article key={article.slug} className="overflow-hidden rounded-3xl border">
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
                <h3 className="text-2xl font-black">{article.title}</h3>
                <p className="mt-3 text-sm text-slate-500">{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
