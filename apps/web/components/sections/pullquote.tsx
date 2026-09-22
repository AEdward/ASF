import { PullquoteSection } from "@/lib/sections";

export default function Pullquote({ section }: { section: PullquoteSection }) {
  if (!section.quote) return null;
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <blockquote className="border-l-4 border-[#f5a617] pl-6 text-2xl font-bold italic text-slate-800 sm:text-3xl">
          &ldquo;{section.quote}&rdquo;
        </blockquote>
        {(section.author || section.role) && (
          <p className="mt-4 text-sm font-semibold text-slate-500">
            {section.author}
            {section.author && section.role ? ", " : ""}
            {section.role}
          </p>
        )}
      </div>
    </section>
  );
}
