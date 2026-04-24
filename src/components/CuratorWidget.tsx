"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { flightOutbound, hotelOutbound } from "@/lib/outbound";
import { loadDates, defaultDates, type TripDates } from "@/lib/trip-prefs";

const PREFS_KEY = "trip.curator";

type Companion = "solo" | "friends";
type Budget = "budget" | "mid" | "premium";
type Duration = "short" | "mid" | "long";

type Pick = {
  deal: {
    slug: string;
    cityKo: string;
    emoji: string;
    minPrice: number;
    period: number;
    collectedAt: string;
    dropPct: number | null;
    daysAgo: number;
  };
  reason: string;
  score: number;
};

type Result = {
  picks: Pick[];
  filters: { companion: Companion; budget: Budget; duration: Duration };
};

function fmtKrw(n: number) {
  return "₩" + n.toLocaleString("ko-KR");
}

const COMP_OPTS: { value: Companion; label: string; emoji: string }[] = [
  { value: "solo", label: "혼자", emoji: "🧍" },
  { value: "friends", label: "친구·커플", emoji: "👯" },
];

const BUDGET_OPTS: { value: Budget; label: string; hint: string }[] = [
  { value: "budget", label: "~40만원", hint: "가까운 아시아" },
  { value: "mid", label: "~80만원", hint: "동남아·괌" },
  { value: "premium", label: "제한 없음", hint: "전 세계" },
];

const DUR_OPTS: { value: Duration; label: string }[] = [
  { value: "short", label: "1-3박" },
  { value: "mid", label: "4-6박" },
  { value: "long", label: "7박+" },
];

export default function CuratorWidget() {
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<TripDates>(defaultDates);

  useEffect(() => {
    setDates(loadDates());
    try {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.companion) setCompanion(parsed.companion);
      if (parsed?.budget) setBudget(parsed.budget);
      if (parsed?.duration) setDuration(parsed.duration);
    } catch {}
  }, []);

  const canSubmit = companion && budget && duration && !loading;

  async function onSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      try {
        window.localStorage.setItem(
          PREFS_KEY,
          JSON.stringify({ companion, budget, duration })
        );
      } catch {}
      const res = await fetch("/api/curate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ companion, budget, duration }),
      });
      if (!res.ok) {
        setError("추천을 받지 못했어요. 잠시 후 다시 시도해주세요.");
        return;
      }
      const data: Result = await res.json();
      setResult(data);
    } catch {
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
  }

  return (
    <section className="bg-gradient-to-br from-sky-50 to-rose-50 border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-[#222222] mb-1">
            나에게 맞는 여행지 찾기
          </h3>
          <p className="text-sm text-[#6a6a6a]">
            3가지만 알려주면 당장 떠날 수 있는 최저가 조합 추천해드려요
          </p>
        </div>

        {!result ? (
          <div className="space-y-5">
            <Question label="1. 누구랑 가요?">
              <div className="grid grid-cols-2 gap-2">
                {COMP_OPTS.map((o) => (
                  <Choice
                    key={o.value}
                    active={companion === o.value}
                    onClick={() => setCompanion(o.value)}
                  >
                    <span className="text-2xl mr-2">{o.emoji}</span>
                    {o.label}
                  </Choice>
                ))}
              </div>
            </Question>

            <Question label="2. 예산은?">
              <div className="grid grid-cols-3 gap-2">
                {BUDGET_OPTS.map((o) => (
                  <Choice
                    key={o.value}
                    active={budget === o.value}
                    onClick={() => setBudget(o.value)}
                  >
                    <div className="font-semibold">{o.label}</div>
                    <div className="text-[11px] text-[#6a6a6a] mt-0.5">{o.hint}</div>
                  </Choice>
                ))}
              </div>
            </Question>

            <Question label="3. 며칠?">
              <div className="grid grid-cols-3 gap-2">
                {DUR_OPTS.map((o) => (
                  <Choice
                    key={o.value}
                    active={duration === o.value}
                    onClick={() => setDuration(o.value)}
                  >
                    {o.label}
                  </Choice>
                ))}
              </div>
            </Question>

            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold transition-colors text-sm sm:text-base"
            >
              {loading ? "추천 찾는 중…" : "추천 받기"}
            </button>

            {error && (
              <p className="text-center text-xs text-rose-500">{error}</p>
            )}
          </div>
        ) : result.picks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#6a6a6a] mb-4">
              조건에 맞는 추천이 없어요. 다른 조건으로 시도해보세요.
            </p>
            <button
              onClick={reset}
              className="text-sm text-sky-500 hover:text-sky-600 font-semibold"
            >
              다시 선택하기 →
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-wider text-[#6a6a6a] mb-3 font-semibold text-center">
              맞춤 추천 TOP {result.picks.length}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {result.picks.map((p, i) => {
                const flight = flightOutbound({ slug: p.deal.slug, depart: dates.depart, return: dates.return });
                const hotel = hotelOutbound({ slug: p.deal.slug, depart: dates.depart, return: dates.return });
                return (
                  <div
                    key={p.deal.slug}
                    className="group relative bg-white rounded-xl border border-gray-200 hover:border-rose-400 hover:shadow-md transition-all p-4 text-left flex flex-col"
                  >
                    <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-rose-500 rounded-full px-2 py-0.5">
                      #{i + 1}
                    </span>
                    <Link href={`/city/${p.deal.slug}`} className="block">
                      <div className="text-2xl mb-1">{p.deal.emoji}</div>
                      <div className="text-sm font-semibold text-[#222222] group-hover:text-rose-600">
                        {p.deal.cityKo}
                      </div>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-rose-500">{fmtKrw(p.deal.minPrice)}</span>
                        <span className="text-xs text-[#6a6a6a]">부터</span>
                      </div>
                      <p className="text-[11px] text-[#6a6a6a] mt-2 leading-snug">{p.reason}</p>
                    </Link>
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      {flight && (
                        <a
                          href={flight}
                          target="_blank"
                          rel="nofollow noopener sponsored"
                          className="text-[11px] font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-lg py-1.5 text-center transition-colors"
                        >
                          🛫 항공
                        </a>
                      )}
                      {hotel && (
                        <a
                          href={hotel}
                          target="_blank"
                          rel="nofollow noopener sponsored"
                          className="text-[11px] font-semibold text-sky-600 hover:bg-sky-50 border border-sky-300 rounded-lg py-1.5 text-center transition-colors"
                        >
                          🏨 호텔
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={reset}
              className="block mx-auto text-sm text-sky-500 hover:text-sky-600 font-semibold"
            >
              다른 조건으로 다시 추천 받기 →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#222222] mb-2">{label}</p>
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-xl border text-sm transition-all ${
        active
          ? "border-rose-400 bg-white text-[#222222] shadow-sm ring-2 ring-rose-100"
          : "border-gray-200 bg-white text-[#6a6a6a] hover:border-rose-200"
      }`}
    >
      {children}
    </button>
  );
}
