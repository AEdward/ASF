import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/ui";
import { getSiteSettings } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "About",
  description: "About ASF Agro Industry — our story, vision and principles.",
};

const principles = [
  ["Farmer-centered", "Solutions are grounded in assessed agricultural needs."],
  ["Scientific", "Nutrition and production expertise support the operating model."],
  ["Reliable", "The company aims to deliver dependable agro-processing solutions."],
  ["Growth-minded", "Capacity and business portfolio are planned to expand over time."],
];

export default async function About() {
  const settings = await getSiteSettings();

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Eyebrow>About ASF</Eyebrow>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            Agro-processing built around real agricultural needs.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">{settings.aboutIntro}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="text-4xl font-black">
              From animal feed toward an integrated agro-industry platform.
            </h2>
            <p className="mt-6 leading-8 text-slate-600">{settings.aboutStory}</p>
            <p className="mt-4 leading-8 text-slate-600">{settings.vision}</p>
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
              <span className="mb-4 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold">
                {settings.heroPanelBadge}
              </span>
              <h2 className="max-w-lg text-3xl font-black">{settings.heroPanelTitle}</h2>
              <p className="mt-4 max-w-lg text-green-50/80">{settings.heroPanelText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Eyebrow>What guides us</Eyebrow>
          <h2 className="text-4xl font-black">Four principles behind the ASF approach.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(([title, text]) => (
              <div key={title} className="rounded-2xl border bg-white p-6">
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
