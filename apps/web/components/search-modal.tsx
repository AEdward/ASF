"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface SearchResult {
  title: string;
  description?: string;
  href: string;
}

interface SearchResultGroup {
  label: string;
  results: SearchResult[];
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const st = useTranslations("search");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<SearchResultGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setGroups([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`)
        .then((res) => res.json())
        .then((data) => setGroups(data.groups ?? []))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query, locale]);

  if (!open) return null;

  const totalResults = groups.reduce((sum, g) => sum + g.results.length, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={st("heading")}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-20 sm:pt-28"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.6 4.2l3.6 3.6a.75.75 0 11-1.06 1.06l-3.6-3.6A7 7 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={st("placeholder")}
            className="flex-1 text-base focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={st("close")}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5">
              <path d="M6.28 6.28a.75.75 0 011.06 0L10 8.94l2.66-2.66a.75.75 0 111.06 1.06L11.06 10l2.66 2.66a.75.75 0 11-1.06 1.06L10 11.06l-2.66 2.66a.75.75 0 11-1.06-1.06L8.94 10 6.28 7.34a.75.75 0 010-1.06z" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {!query.trim() && (
            <p className="p-4 text-center text-sm text-slate-500">{st("noQueryBody")}</p>
          )}

          {query.trim() && loading && (
            <p className="p-4 text-center text-sm text-slate-400">{st("submit")}…</p>
          )}

          {query.trim() && !loading && totalResults === 0 && (
            <div className="p-4 text-center">
              <h2 className="text-lg font-bold">{st("noResultsTitle")}</h2>
              <p className="mt-1 text-sm text-slate-500">{st("noResultsBody")}</p>
            </div>
          )}

          {!loading && totalResults > 0 && (
            <div className="space-y-6">
              {groups.map((group) => (
                <div key={group.label}>
                  <h2 className="mb-2 text-xs font-black uppercase tracking-widest text-green-700">
                    {group.label}
                  </h2>
                  <div className="grid gap-2">
                    {group.results.map((result, i) => (
                      <Link
                        key={`${result.href}-${i}`}
                        href={result.href}
                        onClick={onClose}
                        className="block rounded-xl p-3 transition hover:bg-green-50"
                      >
                        <h3 className="text-sm font-bold text-slate-900">{result.title}</h3>
                        {result.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{result.description}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
