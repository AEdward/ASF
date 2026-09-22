"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export function Header({
  companyName,
  tagline,
  navLinks,
  ctaLabel,
  ctaHref,
}: {
  companyName: string;
  tagline: string;
  navLinks: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/asf-logo.png"
            alt={companyName}
            width={58}
            height={58}
            className="h-14 w-14 object-contain"
          />
          <span className="font-bold tracking-tight">
            {companyName}
            <span className="mt-0.5 block text-[10px] uppercase tracking-[.16em] text-green-700">
              {tagline}
            </span>
          </span>
        </Link>
        <nav
          className={`${
            open ? "absolute left-4 right-4 top-[76px] flex" : "hidden"
          } flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {navLinks.map(({ label, href, children }) => (
            <div key={href} className="group md:relative">
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-green-50 hover:text-green-800"
              >
                {label}
                {children && children.length > 0 && (
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3 w-3">
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Link>
              {children && children.length > 0 && (
                <div className="ml-4 flex flex-col gap-1 md:invisible md:absolute md:left-0 md:top-full md:ml-0 md:w-56 md:flex-col md:rounded-xl md:border md:border-slate-200 md:bg-white md:p-2 md:opacity-0 md:shadow-xl md:transition md:group-hover:visible md:group-hover:opacity-100">
                  {children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-green-50 hover:text-green-800"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <LanguageSwitcher />
          <Link
            href={ctaHref}
            className="rounded-xl bg-[#58c900] px-4 py-2.5 text-sm font-extrabold text-[#092713]"
          >
            {ctaLabel}
          </Link>
        </nav>
        <button
          aria-label={t("toggleMenu")}
          onClick={() => setOpen(!open)}
          className="rounded-lg border px-3 py-2 md:hidden"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
