"use client";

import { useEffect, useRef } from "react";

const PUB_ID = "ca-pub-8619591050588950";

interface WindowWithAds extends Window {
  adsbygoogle?: unknown[];
}

export interface AdsenseSlotProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  layout?: string;
  layoutKey?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdsenseSlot({
  slot,
  format = "auto",
  layout,
  layoutKey,
  fullWidth = true,
  style,
  className,
}: AdsenseSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      const w = window as WindowWithAds;
      (w.adsbygoogle = w.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.warn("[adsense] push fail", e);
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block", ...style }}
      data-ad-client={PUB_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout ? { "data-ad-layout": layout } : {})}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      data-full-width-responsive={fullWidth ? "true" : "false"}
    />
  );
}
