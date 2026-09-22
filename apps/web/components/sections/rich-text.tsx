import { Eyebrow } from "@/components/ui";
import { RichTextSection } from "@/lib/sections";
import { renderRichText } from "@/lib/blocks-renderer";

export default function RichText({ section }: { section: RichTextSection }) {
  const widthClass = section.width === "wide" ? "max-w-4xl" : "max-w-3xl";
  return (
    <section className="py-16">
      <div className={`mx-auto px-5 lg:px-8 ${widthClass}`}>
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        {section.heading && (
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{section.heading}</h2>
        )}
        {renderRichText(section.content)}
      </div>
    </section>
  );
}
