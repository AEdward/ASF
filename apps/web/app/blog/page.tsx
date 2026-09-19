import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/ui";
import { getArticles } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, farming insights and expansion updates from ASF Agro Industry.",
};

const fallbackColors = ["bg-green-600", "bg-lime-500", "bg-amber-500"];

export default async function Blog() {
  const articles = await getArticles();

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Eyebrow>ASF Journal</Eyebrow>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            Insights from our agricultural journey.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Company news, farming insights, feed education and expansion updates,
            managed from the Strapi dashboard.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-3 lg:px-8">
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
                <span className="text-xs font-black tracking-widest text-green-700">
                  {article.category.toUpperCase()}
                </span>
                <h2 className="mt-2 text-2xl font-black">{article.title}</h2>
                <p className="mt-3 text-sm text-slate-500">{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
