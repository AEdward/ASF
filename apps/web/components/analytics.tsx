"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

function report(strapiUrl: string, path: string, body: Record<string, unknown>) {
  try {
    fetch(`${strapiUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: body }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // never let analytics/error reporting break the page
  }
}

export function Analytics({ strapiUrl }: { strapiUrl: string }) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    report(strapiUrl, "/api/page-views", {
      path: pathname,
      locale: document.documentElement.lang || "",
      referrer: document.referrer || "",
    });
  }, [pathname, strapiUrl]);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      report(strapiUrl, "/api/site-errors", {
        source: "client",
        message: event.message || "Unknown client error",
        path: window.location.pathname,
        stack: event.error?.stack || "",
      });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      report(strapiUrl, "/api/site-errors", {
        source: "client",
        message: String(event.reason?.message || event.reason || "Unhandled rejection"),
        path: window.location.pathname,
        stack: event.reason?.stack || "",
      });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [strapiUrl]);

  return null;
}
