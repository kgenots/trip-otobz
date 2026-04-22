import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "Trip OTOBZ 개인정보 처리방침 — 수집 정보, 쿠키 사용, 제휴 공시.",
  alternates: {
    canonical: "/privacy",
    languages: {
      "x-default": "/privacy",
      ko: "/privacy",
      en: "/en/privacy",
    },
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-base sm:text-xl font-bold text-[#222222] hover:text-sky-600">
            Trip OTOBZ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">개인정보 처리방침</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#444] leading-7">
        <h1 className="text-3xl font-bold text-[#222] mb-6">개인정보 처리방침</h1>
        <p className="text-sm text-[#888] mb-8">최종 갱신: 2026-04-22</p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">1. 수집 정보</h2>
        <p className="mb-4">
          Trip OTOBZ는 별도의 회원가입 없이 제공되며, 개인 식별 정보를 직접
          수집하지 않습니다. 아래 정보는 서비스 운영 및 분석 목적으로 자동 수집될 수
          있습니다:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>접속 IP (지역 분석 목적, 쿠키로 국가 코드만 저장)</li>
          <li>브라우저/기기 정보 (User-Agent)</li>
          <li>방문 페이지·체류 시간 (Google Analytics 4 기반)</li>
          <li>외부 링크 클릭 이벤트 (제휴사 귀속 추적)</li>
        </ul>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">2. 쿠키 사용</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>tob_geo</strong>: 방문자 국가 코드 저장 (지역별 콘텐츠 제공, 7일 만료)</li>
          <li><strong>_ga, _gid</strong>: Google Analytics 분석 쿠키</li>
          <li><strong>제휴사 추적 쿠키</strong>: Travelpayouts, Klook, MyRealTrip 등 제휴 링크 클릭 시 해당 사의 쿠키 저장</li>
        </ul>
        <p className="mb-4">
          브라우저 설정에서 쿠키를 비활성화할 수 있으나, 일부 기능이 제한될 수 있습니다.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">3. 제3자 공유</h2>
        <p className="mb-4">
          Trip OTOBZ는 다음 서비스에 데이터를 전송합니다:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Google Analytics (구글 LLC) — 트래픽 분석</li>
          <li>Travelpayouts (영국) — 제휴 링크 추적</li>
          <li>클라우드플레어 — CDN, 보안</li>
        </ul>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">4. 제휴 마케팅 공시</h2>
        <p className="mb-4">
          Trip OTOBZ 링크로 호텔·투어·항공권을 예약하시면 제휴사로부터 수수료를 받을
          수 있습니다. <strong>사용자에게 추가 비용은 발생하지 않으며</strong>, 콘텐츠는
          수수료와 무관하게 작성됩니다. (쿠팡 파트너스 활동 시 별도 고지 예정)
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">5. 데이터 보관</h2>
        <p className="mb-4">
          수집된 로그 데이터는 최대 26개월 보관됩니다 (Google Analytics 기본 설정).
          개인 식별 정보는 수집하지 않으므로 별도 삭제 요청 절차는 없습니다.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">6. 문의</h2>
        <p className="mb-4">
          개인정보 관련 문의: <Link href="/contact" className="text-sky-600 hover:underline">연락처 페이지</Link>
        </p>

        <div className="mt-10 pt-6 border-t border-gray-200 text-sm">
          <Link href="/en/privacy" className="text-sky-600 hover:underline" hrefLang="en">
            English version →
          </Link>
        </div>
      </article>
    </main>
  );
}
