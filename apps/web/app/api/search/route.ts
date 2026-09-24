import { NextRequest, NextResponse } from "next/server";
import { runSiteSearch } from "@/lib/search";
import { routing, type Locale } from "@/i18n/routing";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const localeParam = searchParams.get("locale");
  const locale = (routing.locales as readonly string[]).includes(localeParam ?? "")
    ? (localeParam as Locale)
    : routing.defaultLocale;

  const groups = await runSiteSearch(locale, q);
  return NextResponse.json({ groups });
}
