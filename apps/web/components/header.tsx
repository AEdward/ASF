"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SearchModal } from "@/components/search-modal";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useTranslations("header");
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

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
          } flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:static lg:flex lg:flex-row lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {navLinks.map(({ label, href, children }) => {
            const active =
              isActive(href) || (children?.some((child) => isActive(child.href)) ?? false);
            return (
            <div key={href} className="group lg:relative lg:shrink-0">
              <Link
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold hover:bg-green-50 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 lg:px-2 ${
                  active ? "bg-green-50 text-green-800" : "text-slate-900"
                }`}
              >
                {label}
                {children && children.length > 0 && (
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3 w-3 shrink-0">
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Link>
              {children && children.length > 0 && (
                <div className="ml-4 flex flex-col gap-1 lg:invisible lg:absolute lg:left-0 lg:top-full lg:ml-0 lg:w-56 lg:flex-col lg:rounded-xl lg:border lg:border-slate-200 lg:bg-white lg:p-2 lg:opacity-0 lg:shadow-xl lg:transition lg:group-hover:visible lg:group-hover:opacity-100 lg:group-focus-within:visible lg:group-focus-within:opacity-100">
                  {children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(child.href) ? "page" : undefined}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap hover:bg-green-50 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
                        isActive(child.href) ? "bg-green-50 text-green-800" : "text-slate-600"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setSearchOpen(true);
            }}
            aria-label={t("searchLabel")}
            className="flex shrink-0 items-center justify-center rounded-lg p-2.5 text-slate-700 hover:bg-green-50 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.6 4.2l3.6 3.6a.75.75 0 11-1.06 1.06l-3.6-3.6A7 7 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <LanguageSwitcher />
          <Link
            href={ctaHref}
            className="shrink-0 whitespace-nowrap rounded-xl bg-[#58c900] px-4 py-2.5 text-sm font-extrabold text-[#092713] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </Link>
        </nav>
        <button
          aria-label={t("toggleMenu")}
          onClick={() => setOpen(!open)}
          className="rounded-lg border px-3 py-2 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          ☰
        </button>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
