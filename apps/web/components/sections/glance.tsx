import { Eyebrow } from "@/components/ui";
import { GlanceSection } from "@/lib/sections";

export default function Glance({ section }: { section: GlanceSection }) {
  return (
    <section className="bg-[#fffaf0] py-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        {section.glanceEyebrow && <Eyebrow>{section.glanceEyebrow}</Eyebrow>}
        {section.glanceHeading && (
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{section.glanceHeading}</h2>
        )}
        {section.glanceBody && <p className="mt-5 max-w-2xl text-slate-600">{section.glanceBody}</p>}
        {section.cards.length > 0 && (
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {section.cards.map((card) => (
              <div key={card.label} className="rounded-2xl border p-5">
                <b>{card.label}</b>
                {card.text && <p className="mt-1 text-sm text-slate-500">{card.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
