import { Eyebrow } from "@/components/ui";
import { TeamGridSection } from "@/lib/sections";

export default function TeamGrid({ section }: { section: TeamGridSection }) {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        {section.heading && (
          <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">{section.heading}</h2>
        )}
        <div
          className="mt-10 grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {section.members.map((member) => (
            <article key={member.name} className="rounded-3xl border bg-white p-7">
              <h3 className="text-xl font-black">{member.name}</h3>
              {member.role && (
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-green-700">
                  {member.role}
                </p>
              )}
              {member.qualification && (
                <p className="mt-3 text-sm font-semibold text-slate-700">{member.qualification}</p>
              )}
              {member.experience && (
                <p className="mt-2 text-sm leading-6 text-slate-500">{member.experience}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
