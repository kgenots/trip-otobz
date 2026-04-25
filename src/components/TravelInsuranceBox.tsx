import TravelInsuranceLink from "./TravelInsuranceLink";

export interface TravelInsuranceBoxProps {
  cityKo?: string;
  cityEn?: string;
  countryKo?: string;
  lang?: "ko" | "en";
}

const SAFETYWING_BASE = "https://safetywing.com/nomad-insurance";

function buildSafetyWingUrl(campaign: string, lang: "ko" | "en"): string {
  const refId = process.env.SAFETYWING_REF_ID || "";
  const url = new URL(SAFETYWING_BASE);
  if (refId) url.searchParams.set("referenceID", refId);
  url.searchParams.set("utm_source", "trip-otobz");
  url.searchParams.set("utm_medium", "affiliate");
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_content", lang);
  return url.toString();
}

export default function TravelInsuranceBox({
  cityKo,
  cityEn,
  countryKo,
  lang = "ko",
}: TravelInsuranceBoxProps) {
  const refId = process.env.SAFETYWING_REF_ID || "";
  if (!refId) return null;

  const href = buildSafetyWingUrl(
    `blog-${cityEn || cityKo || "global"}`.toLowerCase().replace(/\s+/g, "-"),
    lang,
  );

  const copy =
    lang === "ko"
      ? {
          title: "🛡️ 여행 의료 보험, 이미 챙기셨나요?",
          desc: cityKo
            ? `${cityKo} 여행 중 응급실·도난·항공 지연까지. 디지털 노마드도 쓰는 글로벌 여행자 보험 SafetyWing.`
            : "응급실·도난·항공 지연까지. 디지털 노마드도 쓰는 글로벌 여행자 보험 SafetyWing.",
          cta: "주당 $42부터 — 견적 보기 →",
          note: "전 세계 180+ 국가, 28일·연단위 가능. 별도 가입 후 출국해도 OK.",
        }
      : {
          title: "🛡️ Got travel medical insurance yet?",
          desc: cityEn
            ? `Coverage for ER visits, theft, and flight delays during your ${cityEn} trip. Used by digital nomads worldwide — SafetyWing.`
            : "Coverage for ER visits, theft, and flight delays. Used by digital nomads worldwide — SafetyWing.",
          cta: "From $42/week — Get a quote →",
          note: "Covers 180+ countries, 4-week & yearly plans. Sign up even after you depart.",
        };

  return (
    <section className="mt-10 p-6 bg-sky-50 rounded-2xl border border-sky-100">
      <h3 className="font-bold text-[#222] text-base sm:text-lg">
        {copy.title}
      </h3>
      <p className="text-sm text-[#555] mt-2 leading-relaxed">{copy.desc}</p>
      <TravelInsuranceLink
        href={href}
        cta={copy.cta}
        cityKo={cityKo}
        countryKo={countryKo}
        lang={lang}
      />
      <p className="text-xs text-[#888] mt-3 leading-tight">{copy.note}</p>
    </section>
  );
}
