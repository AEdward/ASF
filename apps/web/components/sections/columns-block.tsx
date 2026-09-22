import Image from "next/image";
import { Eyebrow } from "@/components/ui";
import { ColumnsSection } from "@/lib/sections";

export default function ColumnsBlock({ section }: { section: ColumnsSection }) {
  if (!section.columns.length) return null;
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        {section.heading && (
          <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">{section.heading}</h2>
        )}
        <div
          className="mt-8 grid gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {section.columns.map((col, i) => (
            <div key={i}>
              {col.imageUrl && (
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={col.imageUrl} alt={col.heading ?? ""} fill className="object-cover" />
                </div>
              )}
              {col.heading && <h3 className="text-xl font-bold">{col.heading}</h3>}
              {col.text && <p className="mt-2 text-sm leading-6 text-slate-600">{col.text}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
