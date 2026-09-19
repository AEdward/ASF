import { AnimalFeastArt } from "@/components/animal-feast-art";
import { Button, Eyebrow } from "@/components/ui";
import { getSiteSettings } from "@/lib/strapi";

const businessAreas = [
  [
    "🌾",
    "Animal Feed Production",
    "Dairy, fattening, poultry and other livestock feed form the core of ASF's production plan.",
  ],
  [
    "🐄",
    "Dairy & Poultry Farms",
    "Farming activities complement feed production and strengthen the integrated livestock approach.",
  ],
  [
    "⚙",
    "Future Portfolio",
    "Cereal processing, export-standard livestock slaughter, and livestock medicine & equipment supply are planned additions.",
  ],
];

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <main>
      <section className="bg-[radial-gradient(circle_at_78%_20%,#e5f8d3,transparent_28%),linear-gradient(135deg,#f7fff3,#fff_58%,#fff9ed)] py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <div>
            <Eyebrow>Agro processing · Agriculture · Agribusiness</Eyebrow>
            <h1 className="font-display text-5xl font-black tracking-[-.05em] sm:text-6xl lg:text-7xl">
              {settings.heroTitleLine1}
              <br />
              <span className="text-green-700">{settings.heroTitleLine2}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {settings.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/products">Explore products →</Button>
              <Button href="/about" secondary>
                Discover ASF
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <AnimalFeastArt />
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
          <div className="rounded-[1.7rem] bg-[#092713] p-9 text-white shadow-xl">
            <div className="text-6xl text-lime-300">&ldquo;</div>
            <h2 className="text-3xl font-black">Our mission</h2>
            <p className="mt-4 text-green-50/75">{settings.mission}</p>
          </div>
          <div>
            <Eyebrow>At a glance</Eyebrow>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              A practical agro-industry partner built for growth.
            </h2>
            <p className="mt-5 max-w-2xl text-slate-600">
              ASF operates in animal feed production, dairy and poultry farms, with an
              expanding portfolio planned across cereal processing, livestock slaughter,
              and livestock medicine &amp; equipment supply.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border p-5">
                <b>{settings.visionLabel}</b>
                <p className="mt-1 text-sm text-slate-500">{settings.vision}</p>
              </div>
              <div className="rounded-2xl border p-5">
                <b>{settings.currentCapacityLabel}</b>
                <p className="mt-1 text-sm text-slate-500">{settings.currentCapacityValue}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Eyebrow>Our business</Eyebrow>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
            Focused today. Expanding tomorrow.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {businessAreas.map(([icon, title, text]) => (
              <article
                key={title}
                className="rounded-3xl border p-7 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-2xl">
                  {icon}
                </div>
                <h3 className="mt-6 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d2715] py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Eyebrow>Scale</Eyebrow>
          <h2 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Production designed to grow with demand.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {settings.productionStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <b className="text-4xl text-lime-300">{stat.value}</b>
                <span className="mt-2 block text-sm text-green-100/65">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
