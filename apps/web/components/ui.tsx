import { Link } from "@/i18n/navigation";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[.15em] text-green-700">
      <span className="h-1 w-7 rounded bg-[#f5a617]" />
      {children}
    </div>
  );
}

export function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex rounded-xl px-5 py-3 text-sm font-extrabold ${
        secondary ? "border border-slate-300 bg-white" : "bg-[#58c900] text-[#092713]"
      }`}
    >
      {children}
    </Link>
  );
}
