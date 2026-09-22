"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eyebrow } from "@/components/ui";
import { SliderSection } from "@/lib/sections";

export default function Slider({ section }: { section: SliderSection }) {
  const slides = section.slides.filter(
    (s): s is { imageUrl: string; caption?: string } => !!s.imageUrl
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        {section.heading && (
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{section.heading}</h2>
        )}
        <div className="relative mt-8 overflow-hidden rounded-3xl">
          <div className="relative aspect-[16/9] w-full">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image src={slide.imageUrl} alt={slide.caption ?? ""} fill className="object-cover" />
              </div>
            ))}
          </div>
          {slides[index]?.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-5 py-3 text-sm text-white">
              {slides[index].caption}
            </div>
          )}
          {slides.length > 1 && (
            <div className="absolute bottom-3 right-5 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
