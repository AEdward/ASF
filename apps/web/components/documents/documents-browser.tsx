"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { DocumentCard } from "@/components/documents/document-card";
import type { DocumentAsset } from "@/lib/content";

export function DocumentsBrowser({ documents }: { documents: DocumentAsset[] }) {
  const t = useTranslations("documents");
  const [query, setQuery] = useState("");

  const categoryLabel = useCallback(
    (category: string) => {
      try {
        return t(`category.${category}`);
      } catch {
        return category;
      }
    },
    [t]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((doc) =>
      [doc.title, doc.description, categoryLabel(doc.category)]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(q))
    );
  }, [documents, query, categoryLabel]);

  return (
    <div>
      <div className="relative mx-auto max-w-xl">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        />
      </div>

      <div className="mt-12 rounded-3xl bg-[linear-gradient(180deg,#f7f2e7,#efe4cf)] p-6 sm:p-10">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-amber-300 bg-white/60 p-10 text-center">
            <h2 className="text-xl font-black">
              {query ? t("noResultsTitle") : t("emptyTitle")}
            </h2>
            <p className="mt-3 text-slate-500">{query ? t("noResultsBody") : t("emptyBody")}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                categoryLabel={categoryLabel(doc.category)}
                downloadLabel={t("download")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
