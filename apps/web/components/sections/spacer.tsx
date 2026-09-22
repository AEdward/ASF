import { SpacerSection } from "@/lib/sections";

const HEIGHT_CLASS: Record<SpacerSection["size"], string> = {
  sm: "h-8",
  md: "h-16",
  lg: "h-24",
  xl: "h-40",
};

export default function Spacer({ section }: { section: SpacerSection }) {
  return <div className={HEIGHT_CLASS[section.size]} aria-hidden="true" />;
}
