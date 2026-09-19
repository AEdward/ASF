import Image from "next/image";
import { Eyebrow } from "@/components/ui";
import { StoryPanelSection } from "@/lib/sections";

export default function StoryPanel({ section }: { section: StoryPanelSection }) {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
        <div>
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          {section.heading && <h2 className="text-4xl font-black">{section.heading}</h2>}
          {section.bodyParagraph1 && (
            <p className="mt-6 leading-8 text-slate-600">{section.bodyParagraph1}</p>
          )}
          {section.bodyParagraph2 && (
            <p className="mt-4 leading-8 text-slate-600">{section.bodyParagraph2}</p>
          )}
        </div>
        <div className="rounded-[2rem] bg-[#0c2914] p-3 shadow-2xl rotate-1">
          <div className="relative min-h-[470px] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(145deg,#8cde1e,#20781d_55%,#0b3518)] p-8 text-white flex flex-col justify-end">
            <Image
              src="/asf-logo.png"
              alt="ASF logo"
              width={240}
              height={240}
              className="absolute right-4 top-4 h-40 w-40 object-contain opacity-20"
            />
            {section.panelBadge && (
              <span className="mb-4 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold">
                {section.panelBadge}
              </span>
            )}
            {section.panelTitle && <h2 className="max-w-lg text-3xl font-black">{section.panelTitle}</h2>}
            {section.panelText && (
              <p className="mt-4 max-w-lg text-green-50/80">{section.panelText}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
