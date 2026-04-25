import { coupangSearchUrl, COUPANG_DISCLAIMER } from "@/lib/coupang";
import CoupangAffiliateLink from "./CoupangAffiliateLink";

interface Item {
  tag: string;
  emoji: string;
  label: string;
  keyword: string;
}

const UNIVERSAL: Item[] = [
  { tag: "luggage-28inch", emoji: "🧳", label: "여행 캐리어", keyword: "28인치 대형 캐리어" },
  { tag: "esim-global", emoji: "📱", label: "해외 eSIM", keyword: "해외 eSIM 데이터" },
  { tag: "powerbank-20000", emoji: "🔋", label: "보조배터리", keyword: "보조배터리 20000mAh" },
  { tag: "packing-cube", emoji: "👜", label: "여행 파우치", keyword: "여행 파우치 세트" },
  { tag: "power-adapter-universal", emoji: "🔌", label: "멀티 변환 플러그", keyword: "멀티 변환 플러그 110v 220v" },
  { tag: "neck-pillow", emoji: "💤", label: "여행 목베개", keyword: "여행용 목베개" },
];

const COUNTRY_EXTRA: Record<string, Item[]> = {
  일본: [
    { tag: "power-adapter-japan", emoji: "🔌", label: "일본 110V 플러그", keyword: "일본 여행 변환 플러그 110V" },
    { tag: "luggage-scale", emoji: "⚖️", label: "수하물 저울", keyword: "여행용 전자 저울" },
  ],
  태국: [
    { tag: "esim-thailand", emoji: "📶", label: "태국 eSIM", keyword: "태국 eSIM 데이터" },
    { tag: "sunscreen-travel", emoji: "🧴", label: "선크림", keyword: "여행용 선크림 50ml" },
  ],
  인도네시아: [
    { tag: "waterproof-bag", emoji: "🌊", label: "방수 가방", keyword: "방수팩 휴대폰 비치" },
    { tag: "snorkel-set", emoji: "🤿", label: "스노클 세트", keyword: "스노클링 마스크 세트" },
  ],
  베트남: [
    { tag: "esim-vietnam", emoji: "📶", label: "베트남 eSIM", keyword: "베트남 eSIM" },
    { tag: "raincoat-travel", emoji: "☔", label: "휴대용 우비", keyword: "휴대용 우비 1회용" },
  ],
  필리핀: [
    { tag: "snorkel-set", emoji: "🤿", label: "스노클 세트", keyword: "스노클링 마스크 세트" },
    { tag: "rashguard", emoji: "🏊", label: "래쉬가드", keyword: "여성 래쉬가드 세트" },
  ],
  대만: [
    { tag: "esim-taiwan", emoji: "📶", label: "대만 eSIM", keyword: "대만 eSIM 데이터" },
  ],
  홍콩: [
    { tag: "power-adapter-uk", emoji: "🔌", label: "홍콩 BF 플러그", keyword: "홍콩 영국 BF 변환 플러그" },
  ],
  싱가포르: [
    { tag: "power-adapter-uk", emoji: "🔌", label: "싱가포르 플러그", keyword: "싱가포르 영국 BF 변환 플러그" },
  ],
  말레이시아: [
    { tag: "power-adapter-uk", emoji: "🔌", label: "말레이 BF 플러그", keyword: "말레이시아 BF 변환 플러그" },
  ],
  미국: [
    { tag: "power-adapter-usa", emoji: "🔌", label: "미국 110V 플러그", keyword: "미국 여행 변환 플러그 110V" },
  ],
  하와이: [
    { tag: "power-adapter-usa", emoji: "🔌", label: "하와이 110V 플러그", keyword: "미국 여행 변환 플러그 110V" },
    { tag: "rashguard", emoji: "🏊", label: "래쉬가드", keyword: "여성 래쉬가드 세트" },
  ],
  프랑스: [
    { tag: "power-adapter-eu", emoji: "🔌", label: "유럽 C타입 플러그", keyword: "유럽 C타입 변환 플러그" },
  ],
  영국: [
    { tag: "power-adapter-uk", emoji: "🔌", label: "영국 BF 플러그", keyword: "영국 BF 변환 플러그" },
  ],
};

export interface CoupangAffiliateBoxProps {
  cityKo?: string;
  countryKo?: string;
  limit?: number;
}

export default function CoupangAffiliateBox({
  cityKo,
  countryKo,
  limit = 6,
}: CoupangAffiliateBoxProps) {
  const extras = countryKo ? COUNTRY_EXTRA[countryKo] || [] : [];
  const items: Item[] = [];
  const seen = new Set<string>();
  for (const it of [...extras, ...UNIVERSAL]) {
    if (seen.has(it.tag)) continue;
    seen.add(it.tag);
    items.push(it);
    if (items.length >= limit) break;
  }

  return (
    <section className="mt-10 p-5 sm:p-6 bg-sky-50 rounded-2xl border border-sky-100">
      <h3 className="font-bold text-[#222] text-base sm:text-lg flex items-center gap-2">
        <span>🎒</span>
        <span>여행 준비할 때 챙기면 좋은 것</span>
      </h3>
      <p className="text-sm text-[#666] mt-1 mb-4">
        {cityKo
          ? `${cityKo} 여행 전 미리 준비하면 든든한 필수템.`
          : "여행 전 미리 준비하면 든든한 필수템."}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {items.map((it) => (
          <CoupangAffiliateLink
            key={it.tag}
            href={coupangSearchUrl(it.keyword, `affiliate-box-${it.tag}`)}
            tag={it.tag}
            emoji={it.emoji}
            label={it.label}
            cityKo={cityKo}
            countryKo={countryKo}
          />
        ))}
      </div>
      <p className="text-[11px] text-[#888] mt-4 leading-tight italic">
        {COUPANG_DISCLAIMER.replace(/\*/g, "")}
      </p>
    </section>
  );
}
