import Image from "next/image";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui";
import type { Partner } from "@/lib/content";

export function PartnersMarquee({ partners }: { partners: Partner[] }) {
  const t = useTranslations("home.partnersMarquee");
  const withLogos = partners.filter((partner) => partner.logoUrl);

  if (withLogos.length === 0) return null;

  const track = [...withLogos, ...withLogos];

  return (
    <section className="border-y bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="max-w-2xl text-3xl font-black tracking-tight">{t("heading")}</h2>
      </div>
      <div className="mt-10 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-16">
          {track.map((partner, index) => (
            <div key={`${partner.id}-${index}`} className="relative h-14 w-36 shrink-0 grayscale">
              <Image src={partner.logoUrl!} alt={partner.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
