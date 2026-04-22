"use client";

import Link from "next/link";
import type { City } from "@/data/cities";
import BookingBar from "@/components/BookingBar";
import SmartCTA from "@/components/SmartCTA";

interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage?: string;
  coverGradient: string;
  coverEmoji: string;
}

export default function CityClientEn({
  city,
  relatedPosts = [],
}: {
  city: City;
  relatedPosts?: RelatedPost[];
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#222222]">
      <header className="border-b border-gray-100 px-4 sm:px-8 py-3 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/en" className="text-lg font-bold hover:text-sky-500 transition-colors">
            Trip OTOBZ
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/en/blog"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/en"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              Cities
            </Link>
            <Link
              href={`/city/${city.slug}`}
              className="text-xs text-[#888] hover:text-sky-600"
              hrefLang="ko"
            >
              한국어
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <p className="text-sky-500 text-sm font-semibold mb-2">
            {city.emoji} {city.countryKo}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[#222222]">
            {city.cityEn} Travel Guide
          </h1>
          <p className="text-[#6a6a6a] text-lg max-w-2xl">
            Compare hotel deals, find the best tours, and book flights to {city.cityEn} — all in one place.
          </p>
        </div>
      </section>

      {/* 상단 BookingBar — hotel/tour/flight 3종 geo-aware */}
      <section className="bg-gradient-to-b from-sky-50/50 to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
          <BookingBar
            cityEn={city.cityEn}
            cityKo={city.cityKo}
            stage="plan"
            placement="en-city-top"
            lang="en"
            products={["hotel", "tour", "flight"]}
          />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Stays 상세 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Where to stay in {city.cityEn}</h2>
          <p className="text-sm text-[#6a6a6a] mb-4">
            Live prices from top booking sites. Filter by neighborhood, rating, and price on each platform.
          </p>
          <SmartCTA
            cityEn={city.cityEn}
            cityKo={city.cityKo}
            product="hotel"
            stage="book"
            placement="en-city-stays"
            lang="en"
            limit={3}
          />
        </section>

        {/* Tours 상세 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Things to do in {city.cityEn}</h2>
          <p className="text-sm text-[#6a6a6a] mb-4">
            Top-rated tours, day trips, and activities. Free cancellation on most options.
          </p>
          <SmartCTA
            cityEn={city.cityEn}
            cityKo={city.cityKo}
            product="tour"
            stage="book"
            placement="en-city-tours"
            lang="en"
            limit={3}
          />
        </section>

        {/* Flights 상세 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Flights to {city.cityEn}</h2>
          <p className="text-sm text-[#6a6a6a] mb-4">
            Compare flight deals across major search engines. Set alerts for price drops.
          </p>
          <SmartCTA
            cityEn={city.cityEn}
            cityKo={city.cityKo}
            product="flight"
            stage="book"
            placement="en-city-flights"
            lang="en"
            limit={2}
          />
        </section>

        {/* 관련 블로그 */}
        {relatedPosts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">{city.cityEn} travel tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/en/blog/${post.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all group"
                >
                  {post.coverImage ? (
                    <div
                      className="h-36 bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                  ) : (
                    <div
                      className={`h-36 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}
                    >
                      <span className="text-4xl">{post.coverEmoji}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 text-[#222222] group-hover:text-sky-600 transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#6a6a6a] line-clamp-2">{post.description}</p>
                    <p className="text-xs text-[#999] mt-2">{post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 text-center">
          <p className="text-sm text-[#888]">
            Also available in{" "}
            <Link href={`/city/${city.slug}`} className="text-sky-600 hover:underline" hrefLang="ko">
              Korean
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
