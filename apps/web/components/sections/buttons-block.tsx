import { Button } from "@/components/ui";
import { ButtonsSection } from "@/lib/sections";

const ALIGN_CLASS: Record<ButtonsSection["align"], string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function ButtonsBlock({ section }: { section: ButtonsSection }) {
  if (!section.buttons.length) return null;
  return (
    <section className="py-8">
      <div
        className={`mx-auto flex max-w-7xl flex-wrap gap-4 px-5 lg:px-8 ${ALIGN_CLASS[section.align]}`}
      >
        {section.buttons.map((btn, i) => (
          <Button key={i} href={btn.href} secondary={btn.style === "secondary"}>
            {btn.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
