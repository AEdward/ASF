"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links: [string, string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["Products", "/products"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/asf-logo.png"
            alt="ASF Agro Industry"
            width={58}
            height={58}
            className="h-14 w-14 object-contain"
          />
          <span className="font-bold tracking-tight">
            ASF Agro Industry
            <span className="mt-0.5 block text-[10px] uppercase tracking-[.16em] text-green-700">
              Animal Feed Processing P/S
            </span>
          </span>
        </Link>
        <nav
          className={`${
            open ? "absolute left-4 right-4 top-[76px] flex" : "hidden"
          } flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-green-50 hover:text-green-800"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-xl bg-[#58c900] px-4 py-2.5 text-sm font-extrabold text-[#092713]"
          >
            Talk to us →
          </Link>
        </nav>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="rounded-lg border px-3 py-2 md:hidden"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
