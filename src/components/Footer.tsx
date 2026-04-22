"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  const home = isEn ? "/en" : "/";
  const about = isEn ? "/en/about" : "/about";
  const blog = isEn ? "/en/blog" : "/blog";
  const privacy = isEn ? "/en/privacy" : "/privacy";
  const terms = isEn ? "/en/terms" : "/terms";
  const contact = isEn ? "/en/contact" : "/contact";
  const other = isEn ? "/" : "/en";

  const labels = isEn
    ? {
        about: "About",
        blog: "Blog",
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact",
        otherLang: "한국어",
        copy: `© ${new Date().getFullYear()} Trip OTOBZ · World travel deals map`,
        aff: "Trip OTOBZ may earn a commission when you book through our partner links, at no additional cost to you.",
      }
    : {
        about: "소개",
        blog: "블로그",
        privacy: "개인정보",
        terms: "이용약관",
        contact: "연락처",
        otherLang: "EN",
        copy: `© ${new Date().getFullYear()} Trip OTOBZ · 세계 여행 최저가 지도`,
        aff: "Trip OTOBZ는 제휴 링크를 통해 수수료를 받을 수 있으며, 사용자에게 추가 비용은 없습니다.",
      };

  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#666]">
          <Link href={home} className="font-semibold text-[#222] hover:text-sky-600">
            Trip OTOBZ
          </Link>
          <Link href={about} className="hover:text-sky-600">{labels.about}</Link>
          <Link href={blog} className="hover:text-sky-600">{labels.blog}</Link>
          <Link href={privacy} className="hover:text-sky-600">{labels.privacy}</Link>
          <Link href={terms} className="hover:text-sky-600">{labels.terms}</Link>
          <Link href={contact} className="hover:text-sky-600">{labels.contact}</Link>
          <span className="ml-auto">
            <Link href={other} className="text-xs text-[#888] hover:text-sky-600" hrefLang={isEn ? "ko" : "en"}>
              {labels.otherLang}
            </Link>
          </span>
        </div>
        <p className="mt-4 text-xs text-[#999] leading-5">
          {labels.aff}
        </p>
        <p className="mt-1 text-xs text-[#aaa]">
          {labels.copy}
        </p>
      </div>
    </footer>
  );
}
