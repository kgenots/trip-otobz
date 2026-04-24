import { cityBySlug } from "@/data/cities";

export const ROUTE_TO_SLUG: Record<string, string> = {
  BKK: "bangkok",
  NRT: "tokyo",
  CNX: "chiangmai",
  SGN: "hochiminh",
  KUL: "kualalumpur",
  MNL: "manila",
  TPE: "taipei",
  SIN: "singapore",
  PEK: "beijing",
};

export const SLUG_TO_ROUTE: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTE_TO_SLUG).map(([code, slug]) => [slug, code])
);

export function routeToCity(code: string) {
  const slug = ROUTE_TO_SLUG[code];
  return slug ? cityBySlug[slug] : undefined;
}
