import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// 1. 'as const' allows us to derive the Locale type perfectly
export const locales = ["en", "es", "de", "fr", "pl", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "en";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // 2. Use [...locales] to satisfy the 'string[]' type requirement
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages([
    ...locales,
  ]);

  return matchLocale(languages, [...locales], defaultLocale);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip static files, images, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Check if the pathname already has a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url),
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
