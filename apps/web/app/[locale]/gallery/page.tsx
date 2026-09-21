import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { getGalleryAlbums } from "@/lib/strapi";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Gallery({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("gallery");
  const albums = await getGalleryAlbums(locale as Locale);

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
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {albums.length === 0 ? (
            <div className="rounded-3xl border bg-slate-50 p-10 text-center">
              <h2 className="text-2xl font-black">{t("emptyTitle")}</h2>
              <p className="mt-3 text-slate-500">{t("emptyBody")}</p>
            </div>
          ) : (
            <div className="space-y-16">
              {albums.map((album) => (
                <div key={album.slug}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-3xl font-black">{album.title}</h2>
                    {album.category && (
                      <span className="text-xs font-black tracking-widest text-green-700">
                        {album.category.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {album.description && <p className="mt-2 text-slate-500">{album.description}</p>}
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {album.imageUrls.map((url) => (
                      <div key={url} className="relative aspect-square overflow-hidden rounded-2xl">
                        <Image src={url} alt={album.title} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
