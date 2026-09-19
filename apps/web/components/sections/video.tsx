import { Eyebrow } from "@/components/ui";
import { VideoSection } from "@/lib/sections";

export default function Video({ section }: { section: VideoSection }) {
  if (!section.videoUrl) return null;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        {section.heading && (
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{section.heading}</h2>
        )}
        {section.caption && <p className="mt-4 max-w-2xl text-slate-600">{section.caption}</p>}
        <div className="mt-8 overflow-hidden rounded-3xl bg-black shadow-2xl">
          <video
            controls
            preload="none"
            poster={section.posterUrl}
            className="aspect-video w-full"
          >
            <source src={section.videoUrl} />
          </video>
        </div>
      </div>
    </section>
  );
}
