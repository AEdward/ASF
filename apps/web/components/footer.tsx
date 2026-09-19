import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer({
  companyName,
  tagline,
  footerLinks,
}: {
  companyName: string;
  tagline: string;
  footerLinks: { label: string; href: string }[];
}) {
  const t = useTranslations("footer");

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
        <div className="flex flex-col items-start gap-1 lg:items-end">
          <span>
            © {new Date().getFullYear()} {companyName}
          </span>
          <span>
            {t("developedBy")}{" "}
            <a
              href="https://paraibatech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-100/90 underline hover:text-white"
            >
              Paraiba Technology PLC
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
