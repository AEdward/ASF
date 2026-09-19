import { Eyebrow } from "@/components/ui";
import { MissionGlanceSection } from "@/lib/sections";

export default function MissionGlance({ section }: { section: MissionGlanceSection }) {
  return (
    <section className="bg-[#fffaf0] py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
        <div className="rounded-[1.7rem] bg-[#092713] p-9 text-white shadow-xl">
          <div className="text-6xl text-lime-300">&ldquo;</div>
          {section.missionHeading && <h2 className="text-3xl font-black">{section.missionHeading}</h2>}
          {section.missionBody && <p className="mt-4 text-green-50/75">{section.missionBody}</p>}
        </div>
        <div>
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
      </div>
    </section>
  );
}
