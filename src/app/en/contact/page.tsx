import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Trip OTOBZ team.",
  alternates: {
    canonical: "/en/contact",
    languages: {
      "x-default": "/contact",
      ko: "/contact",
      en: "/en/contact",
    },
  },
};

export default function ContactPageEn() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/en" className="text-base sm:text-xl font-bold text-[#222222] hover:text-sky-600">
            Trip OTOBZ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">Contact</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#444] leading-7">
        <h1 className="text-3xl font-bold text-[#222] mb-6">Contact</h1>

        <p className="mb-6 text-lg">
          Reach out to the Trip OTOBZ team through the channels below.
        </p>

        <div className="space-y-6 mb-8">
          <div className="p-5 bg-sky-50 rounded-xl border border-sky-100">
            <h2 className="font-bold text-[#222] mb-2">General Inquiries · Partnership</h2>
            <p className="text-[#444]">
              Email:{" "}
              <a href="mailto:contact@otobz.com" className="text-sky-600 hover:underline">
                contact@otobz.com
              </a>
            </p>
            <p className="text-sm text-[#666] mt-2">
              We typically respond within 3 business days.
            </p>
          </div>

          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="font-bold text-[#222] mb-2">Affiliate & Advertising</h2>
            <p className="text-[#444]">
              For partnership inquiries (hotels, tours, flights), email us with
              subject line &quot;Affiliate Inquiry&quot;.
            </p>
          </div>

          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="font-bold text-[#222] mb-2">Content Correction Requests</h2>
            <p className="text-[#444]">
              Report content errors or request edits via the email above.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 text-sm">
          <Link href="/contact" className="text-sky-600 hover:underline" hrefLang="ko">
            한국어 버전 →
          </Link>
        </div>
      </article>
    </main>
  );
}
