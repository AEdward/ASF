import Link from "next/link";

export function Footer({
  companyName,
  tagline,
  footerLinks,
}: {
  companyName: string;
  tagline: string;
  footerLinks: { label: string; href: string }[];
}) {
  return (
    <footer className="bg-[#081c0d] py-10 text-sm text-green-100/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <strong className="text-white">{companyName}</strong>
          <span className="ml-2">· {tagline}</span>
        </div>
        <div className="flex gap-5">
          {footerLinks.map(({ label, href }) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          © {new Date().getFullYear()} {companyName}
        </div>
      </div>
    </footer>
  );
}
