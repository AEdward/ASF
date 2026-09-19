import { Eyebrow } from "@/components/ui";
import { StatsBandSection } from "@/lib/sections";

export default function StatsBand({ section }: { section: StatsBandSection }) {
  return (
    <section className={section.dark ? "bg-[#0d2715] py-24 text-white" : "bg-white py-24"}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        {section.heading && (
          <h2 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{section.heading}</h2>
        )}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {section.stats.map((stat) => (
            <div
              key={stat.label}
              className={
                section.dark
                  ? "rounded-2xl border border-white/10 bg-white/5 p-6"
                  : "rounded-2xl border p-6"
              }
            >
              <b className={section.dark ? "text-4xl text-lime-300" : "text-4xl text-green-700"}>
                {stat.value}
              </b>
              <span
                className={
                  section.dark ? "mt-2 block text-sm text-green-100/65" : "mt-2 block text-sm text-slate-500"
                }
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
