import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관",
  description: "Trip OTOBZ 이용약관.",
  alternates: {
    canonical: "/terms",
    languages: {
      "x-default": "/terms",
      ko: "/terms",
      en: "/en/terms",
    },
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-base sm:text-xl font-bold text-[#222222] hover:text-sky-600">
            Trip OTOBZ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">이용약관</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#444] leading-7">
        <h1 className="text-3xl font-bold text-[#222] mb-6">이용약관</h1>
        <p className="text-sm text-[#888] mb-8">최종 갱신: 2026-04-22</p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">1. 서비스 설명</h2>
        <p className="mb-4">
          Trip OTOBZ(이하 &quot;서비스&quot;)는 여행 정보 검색 및 제휴사 링크 제공을
          목적으로 하는 정보 제공 서비스입니다. 실제 예약, 결제, 서비스 이행은
          제휴 파트너사가 담당하며, Trip OTOBZ는 예약·결제 주체가 아닙니다.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">2. 책임 제한</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>가격·일정·재고는 실시간 변동되며 실제 예약 시점의 정보가 우선합니다.</li>
          <li>제휴사 서비스 품질, 예약 오류, 환불, 항공 지연 등은 해당 제휴사와 직접 해결해야 합니다.</li>
          <li>콘텐츠는 참고용이며 여행 결정은 사용자 책임입니다.</li>
        </ul>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">3. 저작권</h2>
        <p className="mb-4">
          Trip OTOBZ의 원본 콘텐츠(블로그, 가이드)는 Trip OTOBZ의 저작물입니다. 무단
          복제·재배포를 금합니다. 이미지·상표는 각 저작권자에 귀속됩니다.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">4. 약관 변경</h2>
        <p className="mb-4">
          Trip OTOBZ는 필요 시 이 약관을 수정할 수 있으며, 변경 사항은 본 페이지에
          게시됩니다. 지속 이용은 변경된 약관에 동의한 것으로 간주합니다.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">5. 준거법</h2>
        <p className="mb-4">
          본 약관은 대한민국 법률에 따라 해석됩니다.
        </p>

        <div className="mt-10 pt-6 border-t border-gray-200 text-sm">
          <Link href="/en/terms" className="text-sky-600 hover:underline" hrefLang="en">
            English version →
          </Link>
        </div>
      </article>
    </main>
  );
}
