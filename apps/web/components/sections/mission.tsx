import { Eyebrow } from "@/components/ui";
import { MissionSection } from "@/lib/sections";

export default function Mission({ section }: { section: MissionSection }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <div className="rounded-[1.7rem] bg-[#092713] p-9 text-white shadow-xl">
          <div className="text-6xl text-lime-300">&ldquo;</div>
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          {section.heading && <h2 className="text-3xl font-black">{section.heading}</h2>}
          {section.body && <p className="mt-4 text-green-50/75">{section.body}</p>}
        </div>
      </div>
    </section>
  );
}
