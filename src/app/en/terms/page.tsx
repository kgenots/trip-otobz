import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Trip OTOBZ terms of service.",
  alternates: {
    canonical: "/en/terms",
    languages: {
      "x-default": "/terms",
      ko: "/terms",
      en: "/en/terms",
    },
  },
};

export default function TermsPageEn() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/en" className="text-base sm:text-xl font-bold text-[#222222] hover:text-sky-600">
            Trip OTOBZ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">Terms</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#444] leading-7">
        <h1 className="text-3xl font-bold text-[#222] mb-6">Terms of Service</h1>
        <p className="text-sm text-[#888] mb-8">Last updated: 2026-04-22</p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">1. Service Description</h2>
        <p className="mb-4">
          Trip OTOBZ (the &quot;Service&quot;) is a travel information and affiliate link
          service. Actual bookings, payments, and service delivery are handled by our
          partner companies. Trip OTOBZ is not a booking or payment processor.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">2. Limitation of Liability</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Prices, availability, and schedules change in real time. Booking-time data is authoritative.</li>
          <li>Partner service quality, booking errors, refunds, and flight delays must be resolved directly with the partner.</li>
          <li>Content is for reference only; travel decisions are the user&apos;s responsibility.</li>
        </ul>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">3. Copyright</h2>
        <p className="mb-4">
          Original Trip OTOBZ content (blog posts, guides) is the intellectual property
          of Trip OTOBZ. Unauthorized reproduction or redistribution is prohibited.
          Images and trademarks remain the property of their respective owners.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">4. Changes to Terms</h2>
        <p className="mb-4">
          Trip OTOBZ may update these terms; changes will be posted on this page.
          Continued use constitutes acceptance of the updated terms.
        </p>

        <h2 className="text-xl font-bold text-[#222] mt-8 mb-3">5. Governing Law</h2>
        <p className="mb-4">
          These terms are governed by the laws of the Republic of Korea.
        </p>

        <div className="mt-10 pt-6 border-t border-gray-200 text-sm">
          <Link href="/terms" className="text-sky-600 hover:underline" hrefLang="ko">
            한국어 버전 →
          </Link>
        </div>
      </article>
    </main>
  );
}
