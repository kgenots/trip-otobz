import { cityBySlug } from "@/data/cities";

// IATA airport/city code → city slug in data/cities.ts
// Multiple codes can map to same slug (primary + alt airports, city-level codes)
export const ROUTE_TO_SLUG: Record<string, string> = {
  // Japan
  NRT: "tokyo", HND: "tokyo", TYO: "tokyo",
  KIX: "osaka", ITM: "osaka", OSA: "osaka",
  UKB: "kyoto", // Kobe proxy
  FUK: "fukuoka",
  CTS: "sapporo", SPK: "sapporo",
  OKA: "okinawa",
  NGO: "nagoya",

  // Thailand
  BKK: "bangkok", DMK: "bangkok",
  CNX: "chiangmai",
  HKT: "phuket",

  // Vietnam
  SGN: "hochiminh",
  HAN: "hanoi",
  DAD: "danang",

  // SEA
  SIN: "singapore",
  DPS: "bali",
  CEB: "cebu",
  MNL: "manila",
  KUL: "kualalumpur",
  BKI: "kotakinabalu",
  REP: "siemreap",

  // Greater China
  TPE: "taipei", TSA: "taipei",
  HKG: "hongkong",
  MFM: "macau",
  PVG: "shanghai", SHA: "shanghai",
  PEK: "beijing", PKX: "beijing",

  // Middle East
  DXB: "dubai",
  IST: "istanbul", SAW: "istanbul",
  MLE: "maldives",

  // Europe
  CDG: "paris", ORY: "paris", PAR: "paris",
  LHR: "london", LGW: "london", LCY: "london", STN: "london", LON: "london",
  BCN: "barcelona",
  FCO: "rome", CIA: "rome", ROM: "rome",
  AMS: "amsterdam",
  PRG: "prague",
  VIE: "vienna",
  ZRH: "zurich",
  LIS: "lisbon",
  ATH: "athens",
  HEL: "helsinki",

  // Americas
  JFK: "newyork", EWR: "newyork", LGA: "newyork", NYC: "newyork",
  LAX: "losangeles",
  SFO: "sanfrancisco",
  LAS: "lasvegas",
  HNL: "hawaii", OGG: "hawaii", KOA: "hawaii",
  CUN: "cancun",

  // Pacific / Oceania
  GUM: "guam",
  SPN: "saipan",
  SYD: "sydney",
  MEL: "melbourne",
  AKL: "auckland",

  // Africa
  CAI: "cairo",
};

export function codeToCity(code: string) {
  const slug = ROUTE_TO_SLUG[code];
  return slug ? cityBySlug[slug] : undefined;
}
