import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Trip OTOBZ privacy policy — data collection, cookies, affiliate disclosure.",
  alternates: {
    canonical: "/en/privacy",
    languages: {
      "x-default": "/privacy",
      ko: "/privacy",
      en: "/en/privacy",
    },
  },
};

export default function PrivacyPageEn() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/en" className="text-base sm:text-xl font-bold text-[#222222] hover:text-sky-600">
            Trip OTOBZ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">Privacy</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#444] leading-7">
        <h1 className="text-3xl font-bold text-[#222] mb-6">Privacy Policy</h1>
        <p className="text-sm text-[#888] mb-8">Last updated: 2026-04-22</p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">1. Information We Collect</h2>
        <p className="mb-4">
          Trip OTOBZ does not require account registration and does not directly collect
          personally identifiable information. The following data may be automatically
          collected for service operation and analytics:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Access IP (for regional content; only the country code is stored in a cookie)</li>
          <li>Browser and device information (User-Agent)</li>
          <li>Page visits and time on page (via Google Analytics 4)</li>
          <li>Outbound link click events (for affiliate attribution)</li>
        </ul>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">2. Cookies</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>tob_geo</strong>: Stores visitor country code for regional content (7-day expiry)</li>
          <li><strong>_ga, _gid</strong>: Google Analytics tracking cookies</li>
          <li><strong>Partner cookies</strong>: Travelpayouts, Klook, MyRealTrip, etc. set cookies when you click affiliate links</li>
        </ul>
        <p className="mb-4">
          You may disable cookies in your browser settings, but some features may not work correctly.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">3. Third-Party Sharing</h2>
        <p className="mb-4">Trip OTOBZ shares data with the following services:</p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Google Analytics (Google LLC) — traffic analytics</li>
          <li>Travelpayouts (UK) — affiliate link tracking</li>
          <li>Cloudflare — CDN and security</li>
        </ul>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">4. Affiliate Disclosure</h2>
        <p className="mb-4">
          When you book hotels, tours, or flights through Trip OTOBZ links, we may earn a
          commission from our partners. <strong>This comes at no additional cost to you.</strong>{" "}
          Content is written independently of commission rates.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">5. Data Retention</h2>
        <p className="mb-4">
          Log data is retained for up to 26 months (Google Analytics default). Since we do
          not collect personally identifiable information, there is no separate deletion process.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">6. Contact</h2>
        <p className="mb-4">
          Privacy questions: <Link href="/en/contact" className="text-sky-600 hover:underline">Contact page</Link>
        </p>

        <div className="mt-10 pt-6 border-t border-gray-200 text-sm">
          <Link href="/privacy" className="text-sky-600 hover:underline" hrefLang="ko">
            한국어 버전 →
          </Link>
        </div>
      </article>
    </main>
  );
}
