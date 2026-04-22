import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const SITE_URL = "https://trip.otobz.com";
const SITE_NAME = "Trip OTOBZ";
const TITLE =
  "Trip OTOBZ — 세계 여행 최저가 지도 | World Travel Deals Map (Flights · Stays · Tours)";
const DESCRIPTION =
  "세계지도에서 클릭 한 번으로 항공권·숙소·투어 최저가를 비교. 도쿄·방콕·파리·뉴욕 등 인기 도시의 베스트 액티비티와 예약 정보를 한 곳에서. Global travel deals map: compare flights, hotels, and tours across Tokyo, Bangkok, Paris, New York and more — built for travelers worldwide.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "여행지에서 뭐하지",
    "도시 액티비티",
    "해외여행 할 것",
    "투어 추천",
    "여행 액티비티",
    "해외 투어 티켓",
    "여행지 체험",
    "베스트 액티비티",
    "마이리얼트립",
    "여행 최저가 비교",
    "things to do in tokyo",
    "things to do in bangkok",
    "world travel deals",
    "cheap flights hotels tours",
    "travel activities guide",
    "best city tours",
    "global travel map",
    "budget travel planner",
    "asia travel guide",
    "europe travel deals",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "x-default": "/",
      ko: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    alternateLocale: ["en_US"],
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
      <head>
        <meta name="agd-partner-manual-verification" />
        <meta name="naver-site-verification" content="1a0fd44740cba0ba4b2912712da898b0857aa430" />
        <link rel="alternate" type="text/plain" href="https://trip.otobz.com/llms.txt" title="LLMs.txt" />
        {/* Travelpayouts 트래커 */}
        <script
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          data-no-defer="1"
          dangerouslySetInnerHTML={{
            __html: `(function () { var script = document.createElement("script"); script.async = 1; script.src = 'https://tpembars.com/NTIxMzk5.js?t=521399'; document.head.appendChild(script); })();`,
          }}
        />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
