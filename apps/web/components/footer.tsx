import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function phoneLinks(value?: string) {
  if (!value) return [];
  return value
    .split("/")
    .map((n) => n.trim())
    .filter(Boolean);
}

export function Footer({
  companyName,
  tagline,
  footerLinks,
  headOffice,
  phonePrimary,
  phoneSecondary,
  emailPrimary,
  emailSecondary,
}: {
  companyName: string;
  tagline: string;
  footerLinks: { label: string; href: string }[];
  headOffice?: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  emailPrimary?: string;
  emailSecondary?: string;
}) {
  const t = useTranslations("footer");
  const phones = [...phoneLinks(phonePrimary), ...phoneLinks(phoneSecondary)];
  const emails = [emailPrimary, emailSecondary].filter(Boolean) as string[];

  return (
    <footer className="bg-[#081c0d] text-sm text-green-100/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/asf-logo.png"
              alt={companyName}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <div>
              <strong className="text-white">{companyName}</strong>
              <span className="block text-xs">{tagline}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
            {t("quickLinks")}
          </h3>
          <ul className="flex flex-col gap-2">
            {footerLinks.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
            {t("contact")}
          </h3>
          <ul className="flex flex-col gap-2">
            {headOffice && <li>{headOffice}</li>}
            {phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
            ))}
            {emails.map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-1 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
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
