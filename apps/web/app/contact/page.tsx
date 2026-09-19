import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui";
import { getSiteSettings } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the ASF Agro Industry team for partnerships and enquiries.",
};

export default async function Contact() {
  const settings = await getSiteSettings();

  const details = [
    ["Head Office", settings.headOffice],
    ["Operational Factory", settings.factoryAddress],
    ["Expansion Site", settings.expansionAddress],
    ["Phone", `${settings.phonePrimary} · ${settings.phoneSecondary}`],
    ["Email", `${settings.emailPrimary} · ${settings.emailSecondary}`],
  ];

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Eyebrow>Contact ASF</Eyebrow>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            Let&apos;s build the agricultural future together.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            For partnerships, feed supply, business development and other enquiries,
            contact the ASF team.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl border p-8">
            <Eyebrow>Company details</Eyebrow>
            <h2 className="text-3xl font-black">Reach our team.</h2>
            <div className="mt-7 space-y-3">
              {details.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <b className="block text-xs uppercase tracking-widest text-green-700">
                    {label}
                  </b>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <form
            className="rounded-3xl border p-8"
            action={`mailto:${settings.emailPrimary}`}
            method="post"
            encType="text/plain"
          >
            <Eyebrow>Send an enquiry</Eyebrow>
            <div className="grid gap-3">
              <input required name="name" placeholder="Your name" className="rounded-xl border p-3" />
              <input
                required
                type="email"
                name="email"
                placeholder="Email address"
                className="rounded-xl border p-3"
              />
              <input
                name="company"
                placeholder="Company / organization"
                className="rounded-xl border p-3"
              />
              <textarea
                required
                name="message"
                placeholder="How can we work together?"
                className="min-h-40 rounded-xl border p-3"
              />
              <button className="rounded-xl bg-[#58c900] px-5 py-3 font-extrabold text-[#092713]">
                Send enquiry →
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
