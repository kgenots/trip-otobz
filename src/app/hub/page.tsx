import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "otobz — Travel, productivity, and knowledge tools",
  description:
    "otobz ecosystem: Trip OTOBZ travel deals map, dashboard analytics, and more. Built with open-source infrastructure.",
  alternates: { canonical: "https://otobz.com/" },
  openGraph: {
    title: "otobz",
    description: "Travel, productivity, and knowledge tools.",
    url: "https://otobz.com/",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const services = [
  {
    name: "Trip OTOBZ",
    url: "https://trip.otobz.com",
    tagline: "World travel deals map",
    desc: "Compare flight, hotel, and tour deals across top destinations worldwide. Curated in Korean and English.",
    emoji: "✈️",
    status: "live",
  },
  {
    name: "Dashboard",
    url: "https://dashboard.otobz.com",
    tagline: "Analytics & control tower",
    desc: "AI agent control tower with briefings, content scheduling, and daytrading monitor.",
    emoji: "📊",
    status: "live",
  },
  {
    name: "Outline",
    url: "https://outline.otobz.com",
    tagline: "Knowledge base",
    desc: "Internal wiki and documentation hub.",
    emoji: "📚",
    status: "internal",
  },
];

export default function HubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
      <header className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-[#222]">otobz</h1>
          <nav className="flex items-center gap-4 text-sm text-[#666]">
            <a href="#services" className="hover:text-sky-600">Services</a>
            <a href="#about" className="hover:text-sky-600">About</a>
          </nav>
        </div>
      </header>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
            otobz ecosystem
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#111] leading-tight mb-6">
            Travel, productivity, and knowledge tools.
          </h2>
          <p className="text-base sm:text-lg text-[#555] max-w-2xl mx-auto">
            otobz is a small collection of services built to help with daily
            planning, travel decisions, and personal productivity. Each runs
            independently; all share a common design and data layer.
          </p>
          <div className="mt-8">
            <Link
              href="https://trip.otobz.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-sm font-semibold transition"
            >
              Explore Trip OTOBZ →
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="px-4 sm:px-6 lg:px-8 py-12 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-[#222] mb-8">Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <Link
                key={s.name}
                href={s.url}
                className="group flex flex-col p-6 bg-white rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-md transition"
              >
                <div className="text-3xl mb-3">{s.emoji}</div>
                <h4 className="text-lg font-bold text-[#222] mb-1 group-hover:text-sky-600">
                  {s.name}
                </h4>
                <p className="text-xs text-sky-600 font-medium mb-3 uppercase tracking-wide">
                  {s.tagline}
                </p>
                <p className="text-sm text-[#555] leading-6 mb-4 flex-1">{s.desc}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#888]">
                    {s.status === "live" ? "🟢 Live" : "🔒 Internal"}
                  </span>
                  <span className="text-sky-500 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-[#222] mb-4">About otobz</h3>
          <p className="text-sm sm:text-base text-[#555] leading-7 mb-4">
            otobz runs on a self-hosted Kubernetes (k3s) cluster with
            Cloudflare Tunnel. Infrastructure code is open; services are
            built in TypeScript (Next.js) and Python.
          </p>
          <p className="text-sm text-[#777]">
            Contact:{" "}
            <a href="mailto:contact@otobz.com" className="text-sky-600 hover:underline">
              contact@otobz.com
            </a>
          </p>
        </div>
      </section>

      <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-xs text-[#999] flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} otobz</span>
          <div className="flex gap-4">
            <Link href="https://trip.otobz.com/privacy" className="hover:text-sky-600">
              Privacy
            </Link>
            <Link href="https://trip.otobz.com/terms" className="hover:text-sky-600">
              Terms
            </Link>
            <Link href="https://trip.otobz.com/contact" className="hover:text-sky-600">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
