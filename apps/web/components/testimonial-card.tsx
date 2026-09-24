import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Testimonial } from "@/lib/content";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const t = useTranslations("testimonials");

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div
        aria-label={t("ratingLabel", { rating: testimonial.rating })}
        className="mb-4 text-lg text-[#f5a617]"
      >
        {"★".repeat(testimonial.rating)}
        <span className="text-slate-300">{"★".repeat(5 - testimonial.rating)}</span>
      </div>
      <p className="flex-1 text-lg leading-7 text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        {testimonial.photoUrl ? (
          <div className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image src={testimonial.photoUrl} alt={testimonial.authorName} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-sm font-black text-green-700">
            {testimonial.authorName.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-slate-900">{testimonial.authorName}</p>
          {testimonial.role && <p className="text-xs text-slate-500">{testimonial.role}</p>}
        </div>
      </div>
    </div>
  );
}
