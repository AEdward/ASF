import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/ui";
import { TestimonialCard } from "@/components/testimonial-card";
import type { Testimonial } from "@/lib/content";

export function TestimonialsHighlight({ testimonials }: { testimonials: Testimonial[] }) {
  const t = useTranslations("home.testimonials");

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              {t("heading")}
            </h2>
          </div>
          <Link href="/about/testimonials" className="text-sm font-bold text-green-700">
            {t("viewAll")}
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
