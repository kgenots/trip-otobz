"use client";

import { trackAffiliateClick, measureScrollDepth } from "@/lib/analytics";

export interface TravelInsuranceLinkProps {
  href: string;
  cta: string;
  cityKo?: string;
  countryKo?: string;
  lang: "ko" | "en";
}

export default function TravelInsuranceLink({
  href,
  cta,
  cityKo,
  countryKo,
  lang,
}: TravelInsuranceLinkProps) {
  function handleClick() {
    trackAffiliateClick({
      provider: "safetywing",
      product: "nomad-insurance",
      city: cityKo || "",
      region: countryKo || "",
      stage: "plan",
      placement: `blog-insurance-box-${lang}`,
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
      className="inline-flex items-center mt-3 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
    >
      {cta}
    </a>
  );
}
