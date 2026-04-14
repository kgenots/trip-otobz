import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const SITE_URL = "https://trip.otobz.com";
const SITE_NAME = "Trip OTOBZ";
const TITLE = "Trip OTOBZ - 세계 항공권·숙소·투어 최저가 지도";
const DESCRIPTION =
  "SVG 세계지도에서 클릭 한 번으로 전 세계 항공권, 숙소, 투어·티켓 최저가를 비교하세요. 마이리얼트립 기반 실시간 가격 정보.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "항공권 최저가",
    "해외여행",
    "숙소 비교",
    "투어 티켓",
    "마이리얼트립",
    "여행 지도",
    "세계 항공권",
    "최저가 검색",
    "해외 숙소",
    "여행 최저가 비교",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <GoogleAnalytics />
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
