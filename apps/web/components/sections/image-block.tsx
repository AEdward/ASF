import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ImageBlockSection } from "@/lib/sections";

export default function ImageBlock({ section }: { section: ImageBlockSection }) {
  if (!section.imageUrl) return null;
  const wrapperClass = section.fullBleed ? "" : "mx-auto max-w-5xl px-5 lg:px-8";

  const figure = (
    <figure className="overflow-hidden rounded-3xl">
      <div className="relative aspect-[16/9] w-full">
        <Image src={section.imageUrl} alt={section.caption ?? ""} fill className="object-cover" />
      </div>
      {section.caption && (
        <figcaption className="mt-3 text-center text-sm text-slate-500">{section.caption}</figcaption>
      )}
    </figure>
  );

  return (
    <section className="py-12">
      <div className={wrapperClass}>
        {section.href ? (
          section.href.startsWith("http") ? (
            <a href={section.href} target="_blank" rel="noopener noreferrer">
              {figure}
            </a>
          ) : (
            <Link href={section.href}>{figure}</Link>
          )
        ) : (
          figure
        )}
      </div>
    </section>
  );
}
