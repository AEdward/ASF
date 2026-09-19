import type { Metadata } from "next";
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
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <Eyebrow>Our story</Eyebrow>
          <h2 className="text-4xl font-black">
            From animal feed toward an integrated agro-industry platform.
          </h2>
          <p className="mt-6 leading-8 text-slate-600">{settings.aboutStory}</p>
          <p className="mt-4 leading-8 text-slate-600">{settings.vision}</p>
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
