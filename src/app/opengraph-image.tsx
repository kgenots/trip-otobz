import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Trip OTOBZ — World Travel Deals Map · 세계 항공권·숙소·투어 최저가 지도";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#0EA5E9",
            marginBottom: 4,
            letterSpacing: "-0.5px",
          }}
        >
          Trip OTOBZ
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#0369A1",
            textAlign: "center",
            maxWidth: 800,
            marginBottom: 14,
            fontWeight: 600,
            letterSpacing: "0.2px",
          }}
        >
          World Travel Deals Map · 세계 여행 최저가 지도
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#222222",
            textAlign: "center",
            maxWidth: 820,
            marginBottom: 4,
          }}
        >
          Click one city. Compare flights, stays, and tours.
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#6a6a6a",
            textAlign: "center",
            maxWidth: 820,
          }}
        >
          세계지도에서 클릭 한 번으로 항공권·숙소·투어 최저가 비교
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 30,
          }}
        >
          {["Flights", "Stays", "Tours"].map((label) => (
            <div
              key={label}
              style={{
                background: "white",
                borderRadius: 20,
                padding: "12px 28px",
                color: "#0EA5E9",
                fontSize: 20,
                fontWeight: 600,
                boxShadow:
                  "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px",
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
