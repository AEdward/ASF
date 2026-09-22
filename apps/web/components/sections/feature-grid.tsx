import Image from "next/image";
import { Eyebrow } from "@/components/ui";
import { FeatureGridSection } from "@/lib/sections";

export default function FeatureGrid({ section }: { section: FeatureGridSection }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        {section.heading && (
          <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">{section.heading}</h2>
        )}
        <div
          className="mt-10 grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
        >
          {section.items.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-3xl border bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              {item.imageUrl && (
                <div className="relative h-44">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-7">
                {!item.imageUrl && item.icon && (
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-2xl">
                    {item.icon}
                  </div>
                )}
                <h3 className={item.imageUrl ? "text-2xl font-black" : "mt-6 text-2xl font-black"}>
                  {item.title}
                </h3>
                {item.text && <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
