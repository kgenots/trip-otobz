import { ImageResponse } from "next/og";
import { cityBySlug } from "@/data/cities";

export const runtime = "edge";
export const alt = "Trip OTOBZ - 도시별 베스트 액티비티";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = cityBySlug[slug];
  const cityName = city?.cityKo ?? slug;
  const emoji = city?.emoji ?? "🌍";
  const country = city?.countryKo ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 8 }}>{emoji}</div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#0EA5E9",
            marginBottom: 8,
          }}
        >
          {cityName}
        </div>
        {country && (
          <div style={{ fontSize: 28, color: "#6a6a6a", marginBottom: 24 }}>
            {country}
          </div>
        )}
        <div
          style={{
            fontSize: 24,
            color: "#222222",
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          {cityName}에서 뭐하지? 베스트 투어 · 액티비티 추천
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#0EA5E9",
            marginTop: 24,
            fontWeight: 600,
          }}
        >
          Trip OTOBZ
        </div>
      </div>
    ),
    { ...size },
  );
}
