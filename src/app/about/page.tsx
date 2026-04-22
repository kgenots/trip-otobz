import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Trip OTOBZ — 세계 여행 최저가 지도",
  description:
    "Trip OTOBZ는 전 세계 인기 도시의 항공권·숙소·투어 최저가를 한 화면에서 비교하는 여행 정보 서비스입니다. 실제 여행자 관점에서 큐레이션한 정보를 제공합니다.",
  alternates: {
    canonical: "/about",
    languages: {
      "x-default": "/about",
      ko: "/about",
      en: "/en/about",
    },
  },
  openGraph: {
    title: "About Trip OTOBZ",
    description: "세계 여행 최저가 지도. 실제 여행자 관점 큐레이션.",
    url: "https://trip.otobz.com/about",
    locale: "ko_KR",
    alternateLocale: ["en_US"],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="text-base sm:text-xl font-bold text-[#222222] hover:text-sky-600 transition-colors"
          >
            Trip OTOBZ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">소개</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-6">
          Trip OTOBZ 소개
        </h1>

        <p className="text-[#444] leading-7 mb-6 text-lg">
          Trip OTOBZ는 전 세계 인기 도시의 항공권·숙소·투어 최저가를 한 화면에서
          비교하는 여행 정보 서비스입니다.
        </p>

        <h2 className="text-xl font-bold text-[#222222] mt-10 mb-4">
          무엇을 제공하나요
        </h2>
        <ul className="list-disc list-inside space-y-2 text-[#444] leading-7">
          <li>세계 주요 70+ 도시의 여행 가이드 (도쿄·방콕·파리·뉴욕 등)</li>
          <li>항공권 최저가 비교 (Skyscanner, Trip.com 등)</li>
          <li>호텔 실시간 가격 비교 (Booking.com, Agoda 등)</li>
          <li>현지 투어·액티비티·티켓 (Klook, GetYourGuide, Viator 등)</li>
          <li>도시별 여행 꿀팁 블로그 (한국어 · 영어)</li>
        </ul>

        <h2 className="text-xl font-bold text-[#222222] mt-10 mb-4">
          정보 출처
        </h2>
        <p className="text-[#444] leading-7 mb-4">
          Trip OTOBZ는 공개된 여행 정보와 파트너사의 API를 기반으로 큐레이션한
          콘텐츠를 제공합니다. 가격 정보는 각 제휴 사이트의 실시간 데이터를
          참조하며, 실제 예약 가격은 환율·시점·이벤트에 따라 달라질 수 있습니다.
        </p>

        <h2 className="text-xl font-bold text-[#222222] mt-10 mb-4">
          수익 모델
        </h2>
        <p className="text-[#444] leading-7 mb-4">
          Trip OTOBZ의 링크를 통해 호텔·투어·항공권을 예약하시면 Trip OTOBZ가
          제휴사로부터 수수료를 받을 수 있습니다. 이는 <strong>사용자에게 추가
          비용 없이</strong> 운영에 도움이 되며, 콘텐츠 선정은 수수료와 무관하게
          품질·가격·사용자 가치를 기준으로 합니다.
        </p>
        <p className="text-[#444] leading-7 mb-4">
          제휴 관계가 있는 주요 파트너: Travelpayouts 네트워크(Booking.com, Agoda,
          Skyscanner, Trip.com, Airalo 등), Klook, MyRealTrip.
        </p>

        <h2 className="text-xl font-bold text-[#222222] mt-10 mb-4">
          연락처
        </h2>
        <p className="text-[#444] leading-7">
          문의·피드백: <Link href="/contact" className="text-sky-600 hover:underline">연락처 페이지</Link>
        </p>

        <div className="mt-10 pt-6 border-t border-gray-200 text-sm">
          <Link href="/en/about" className="text-sky-600 hover:underline" hrefLang="en">
            English version →
          </Link>
        </div>
      </article>
    </main>
  );
}
