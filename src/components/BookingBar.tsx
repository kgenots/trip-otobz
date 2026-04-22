"use client";

import SmartCTA from "./SmartCTA";

export interface BookingBarProps {
  cityEn: string;
  cityKo: string;
  stage?: "browse" | "plan" | "book" | "unknown";
  placement?: string;
  lang?: "ko" | "en";
  products?: Array<"hotel" | "tour" | "flight" | "activity">;
}

export default function BookingBar({
  cityEn,
  cityKo,
  stage = "plan",
  placement = "city-top",
  lang = "ko",
  products = ["hotel", "tour", "flight"],
}: BookingBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {products.map((p) => (
        <SmartCTA
          key={p}
          cityEn={cityEn}
          cityKo={cityKo}
          product={p}
          stage={stage}
          placement={`${placement}-${p}`}
          lang={lang}
          limit={2}
        />
      ))}
    </div>
  );
}
