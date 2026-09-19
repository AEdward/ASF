import { Eyebrow } from "@/components/ui";
import { IntroSection } from "@/lib/sections";

export default function Intro({ section }: { section: IntroSection }) {
  return (
    <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">{section.heading}</h1>
        {section.body && <p className="mt-6 max-w-2xl text-lg text-slate-600">{section.body}</p>}
      </div>
    </section>
  );
}
