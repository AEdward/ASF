import { EmbedSection } from "@/lib/sections";

function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function Embed({ section }: { section: EmbedSection }) {
  if (!section.url) return null;
  const embedUrl = toEmbedUrl(section.url);
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        {embedUrl ? (
          <div className="overflow-hidden rounded-3xl">
            <iframe
              src={embedUrl}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <a
            href={section.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 underline"
          >
            {section.url}
          </a>
        )}
        {section.caption && (
          <p className="mt-3 text-center text-sm text-slate-500">{section.caption}</p>
        )}
      </div>
    </section>
  );
}
