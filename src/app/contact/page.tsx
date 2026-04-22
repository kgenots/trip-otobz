import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "연락처",
  description: "Trip OTOBZ 운영팀에 연락하세요.",
  alternates: {
    canonical: "/contact",
    languages: {
      "x-default": "/contact",
      ko: "/contact",
      en: "/en/contact",
    },
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-base sm:text-xl font-bold text-[#222222] hover:text-sky-600">
            Trip OTOBZ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">연락처</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#444] leading-7">
        <h1 className="text-3xl font-bold text-[#222] mb-6">연락처</h1>

        <p className="mb-6 text-lg">
          Trip OTOBZ에 문의·피드백을 주시려면 아래 채널을 이용해주세요.
        </p>

        <div className="space-y-6 mb-8">
          <div className="p-5 bg-sky-50 rounded-xl border border-sky-100">
            <h2 className="font-bold text-[#222] mb-2">일반 문의 · 협업 제안</h2>
            <p className="text-[#444]">
              이메일: <a href="mailto:contact@otobz.com" className="text-sky-600 hover:underline">
                contact@otobz.com
              </a>
            </p>
            <p className="text-sm text-[#666] mt-2">
              답변까지 최대 3영업일 소요될 수 있습니다.
            </p>
          </div>

          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="font-bold text-[#222] mb-2">제휴 · 광고 문의</h2>
            <p className="text-[#444]">
              호텔·투어·항공권 등 여행 서비스 제휴 문의는 위 이메일로 &quot;제휴 문의&quot;
              제목으로 연락 부탁드립니다.
            </p>
          </div>

          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="font-bold text-[#222] mb-2">개인정보·콘텐츠 수정 요청</h2>
            <p className="text-[#444]">
              콘텐츠 오류·수정 요청도 위 이메일로 받습니다.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 text-sm">
          <Link href="/en/contact" className="text-sky-600 hover:underline" hrefLang="en">
            English version →
          </Link>
        </div>
      </article>
    </main>
  );
}
