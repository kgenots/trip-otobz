import { NextResponse, type NextRequest } from "next/server";

const GEO_COOKIE = "tob_geo";
const GEO_MAX_AGE = 60 * 60 * 24 * 7;

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.cookies.get(GEO_COOKIE)?.value) {
    return res;
  }

  const cf = req.headers.get("cf-ipcountry");
  const vercel = req.headers.get("x-vercel-ip-country");
  const accept = req.headers.get("accept-language") ?? "";
  const fallback = accept.toLowerCase().startsWith("ko") ? "KR" : "US";
  const country = (cf || vercel || fallback).toUpperCase();

  res.cookies.set(GEO_COOKIE, country, {
    maxAge: GEO_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|sitemap.xml|robots.txt|llms.txt).*)"],
};
