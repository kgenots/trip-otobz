import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trip OTOBZ - 세계 항공권·숙소·투어 최저가 지도",
  description: "SVG 세계지도에서 클릭 한 번으로 항공권, 숙소, 투어·티켓 최저가를 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
