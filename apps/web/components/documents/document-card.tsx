import Image from "next/image";
import type { DocumentAsset } from "@/lib/content";

const SPINE_COLORS: Record<string, string> = {
  "Company Profile": "bg-green-700",
  Certification: "bg-amber-500",
  "Product Spec": "bg-sky-600",
  Policy: "bg-slate-600",
  Report: "bg-lime-600",
  Other: "bg-stone-500",
};

function formatSize(kb?: number) {
  if (!kb) return undefined;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function DocumentCard({
  document,
  categoryLabel,
  downloadLabel,
}: {
  document: DocumentAsset;
  categoryLabel: string;
  downloadLabel: string;
}) {
  const spine = SPINE_COLORS[document.category] ?? SPINE_COLORS.Other;
  const size = formatSize(document.fileSizeKb);

  return (
    <a
      href={document.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span className={`w-2 shrink-0 ${spine}`} />
      <div className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] bg-slate-100">
          {document.thumbnailUrl ? (
            <Image src={document.thumbnailUrl} alt={document.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <span className="text-4xl">📄</span>
              {document.fileExt && (
                <span className="text-xs font-black tracking-widest">{document.fileExt}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-green-700">
            {categoryLabel}
          </span>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{document.title}</h3>
          {document.description && (
            <p className="mt-2 text-sm text-slate-500">{document.description}</p>
          )}
          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-xs text-slate-400">
              {[document.fileExt, size].filter(Boolean).join(" · ")}
            </span>
            <span className="text-sm font-bold text-green-700 group-hover:underline">
              {downloadLabel} ↓
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
