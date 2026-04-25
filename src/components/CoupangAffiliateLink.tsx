"use client";

import { trackAffiliateClick, measureScrollDepth } from "@/lib/analytics";

export interface CoupangAffiliateLinkProps {
  href: string;
  tag: string;
  emoji: string;
  label: string;
  cityKo?: string;
  countryKo?: string;
}

export default function CoupangAffiliateLink({
  href,
  tag,
  emoji,
  label,
  cityKo,
  countryKo,
}: CoupangAffiliateLinkProps) {
  function handleClick() {
    trackAffiliateClick({
      provider: "coupang",
      product: tag,
      city: cityKo || "",
      region: countryKo || "",
      stage: "plan",
      placement: "blog-coupang-box",
      source_page:
        typeof window !== "undefined" ? window.location.pathname : "",
      scroll_depth: measureScrollDepth(),
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      onClick={handleClick}
      className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-sm transition-all"
    >
      <span className="text-2xl shrink-0">{emoji}</span>
      <span className="text-sm font-medium text-[#333] leading-tight">
        {label}
      </span>
    </a>
  );
}
