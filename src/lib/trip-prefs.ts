"use client";

export type TripDates = {
  depart: string; // YYYY-MM-DD
  return: string; // YYYY-MM-DD
};

const KEY = "trip.dates";

function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function defaultDates(): TripDates {
  const d = new Date();
  const depart = new Date(d.getTime() + 30 * 86400000);
  const ret = new Date(depart.getTime() + 4 * 86400000);
  return { depart: fmt(depart), return: fmt(ret) };
}

export function loadDates(): TripDates {
  if (typeof window === "undefined") return defaultDates();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultDates();
    const parsed = JSON.parse(raw);
    if (typeof parsed?.depart === "string" && typeof parsed?.return === "string") {
      // Expired if depart in past → reset
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (new Date(parsed.depart) < now) return defaultDates();
      return parsed;
    }
  } catch {
    // ignore
  }
  return defaultDates();
}

export function saveDates(d: TripDates): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    // ignore
  }
}
