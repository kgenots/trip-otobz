import { NextResponse, type NextRequest } from "next/server";

const GEO_COOKIE = "tob_geo";
const GEO_MAX_AGE = 60 * 60 * 24 * 7;

function setGeoCookie(req: NextRequest, res: NextResponse) {
  if (req.cookies.get(GEO_COOKIE)?.value) return;
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
}

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const { pathname, search } = req.nextUrl;

  // 루트 도메인 otobz.com 접근 → /hub 페이지로 rewrite (URL은 otobz.com 유지)
  // AdSense가 otobz.com을 최상위 도메인으로 인식 가능
  const isRootOtobz = host === "otobz.com" || host === "www.otobz.com";
  if (isRootOtobz && pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/hub";
    const res = NextResponse.rewrite(url);
    setGeoCookie(req, res);
    return res;
  }

  const res = NextResponse.next();
  setGeoCookie(req, res);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|sitemap.xml|robots.txt|llms.txt).*)"],
};
