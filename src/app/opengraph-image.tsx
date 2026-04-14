import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Trip OTOBZ - 세계 항공권·숙소·투어 최저가 지도";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>✈️🗺️</div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            marginBottom: 16,
          }}
        >
          Trip OTOBZ
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          세계지도에서 클릭 한 번으로
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          항공권·숙소·투어 최저가 비교
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
          }}
        >
          {["✈️ 항공권", "🏨 숙소", "🎫 투어"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(59,130,246,0.2)",
                border: "1px solid rgba(59,130,246,0.4)",
                borderRadius: 12,
                padding: "12px 24px",
                color: "#60a5fa",
                fontSize: 22,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
