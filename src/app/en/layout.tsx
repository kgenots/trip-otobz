import type { Metadata } from "next";

const SITE_URL = "https://trip.otobz.com";
const SITE_NAME = "Trip OTOBZ";
const TITLE = "Trip OTOBZ — World Travel Deals Map (Flights · Stays · Tours)";
const DESCRIPTION =
  "Click one city on the world map. Compare flights, hotels, and tours across Tokyo, Bangkok, Paris, New York, and more. Built for global travelers looking for the best deals and things to do.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "things to do in tokyo",
    "things to do in bangkok",
    "things to do in paris",
    "things to do in new york",
    "world travel deals",
    "cheap flights hotels tours",
    "travel activities guide",
    "best city tours",
    "global travel map",
    "budget travel planner",
    "asia travel guide",
    "europe travel deals",
    "southeast asia itinerary",
    "japan travel tips",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/en",
    languages: {
      "x-default": "/",
      ko: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en`,
    siteName: SITE_NAME,
    locale: "en_US",
    alternateLocale: ["ko_KR"],
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
};

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div lang="en">{children}</div>;
}
