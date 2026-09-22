import Image from "next/image";
import { Button, Eyebrow } from "@/components/ui";
import { HeroSection } from "@/lib/sections";

export default function Hero({ section }: { section: HeroSection }) {
  return (
    <section className="bg-[radial-gradient(circle_at_78%_20%,#e5f8d3,transparent_28%),linear-gradient(135deg,#f7fff3,#fff_58%,#fff9ed)] py-10 sm:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
        <div>
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h1 className="font-display text-5xl font-black tracking-[-.05em] sm:text-6xl lg:text-7xl">
            {section.headingLine1}
            {section.headingLine2 && (
              <>
                <br />
                <span className="text-green-700">{section.headingLine2}</span>
              </>
            )}
          </h1>
          {section.subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{section.subtitle}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {section.primaryButtonLabel && section.primaryButtonHref && (
              <Button href={section.primaryButtonHref}>{section.primaryButtonLabel}</Button>
            )}
            {section.secondaryButtonLabel && section.secondaryButtonHref && (
              <Button href={section.secondaryButtonHref} secondary>
                {section.secondaryButtonLabel}
              </Button>
            )}
          </div>
        </div>
        {section.imageStyle === "logo-3d" && (
          <div className="spin-3d-stage relative mx-auto aspect-square w-full max-w-md">
            <div className="animate-spin-3d relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
              <Image
                src={section.imageUrl || "/crop-residue-logo.jpg"}
                alt="ASF Crop Residue Feed — Biofermentation Technology, in collaboration with ILRI and WRI"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-contain p-4"
              />
            </div>
          </div>
        )}
        {(section.imageStyle === "plain" || section.imageStyle === "disc-spin") && (
          <div
            className={
              section.imageStyle === "plain"
                ? "relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl"
                : "relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-full shadow-2xl ring-8 ring-white/50"
            }
          >
            <Image
              src={section.imageUrl || "/hero-topdown.png"}
              alt="Top-down view of a cow, camel, ox, goat, sheep and chicken feeding from a plate styled after the ASF Agro Industry logo"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className={section.imageStyle === "plain" ? "object-cover" : "animate-spin-slow object-cover"}
            />
          </div>
        )}
      </div>
    </section>
  );
}
