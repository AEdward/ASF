import Image from "next/image";
import { Eyebrow } from "@/components/ui";
import { GalleryBlockSection } from "@/lib/sections";

export default function GalleryBlock({ section }: { section: GalleryBlockSection }) {
  if (!section.imageUrls.length) return null;
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        {section.heading && (
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{section.heading}</h2>
        )}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {section.imageUrls.map((url, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={url} alt="" fill className="object-cover transition hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
