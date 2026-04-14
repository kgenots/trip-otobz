"use client";

import { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { cityCountryMap } from "@/data/city-country-map";
import type { FlightPrice } from "@/lib/api";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// 도시별 좌표 (경도, 위도) - 지도 레이아웃에서 정확한 위치 표시용
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // 일본
  NRT: { lat: 35.7720, lng: 140.3929 },
  TYO: { lat: 35.6762, lng: 139.6503 },
  HND: { lat: 35.5494, lng: 139.7798 },
  KIX: { lat: 34.6517, lng: 135.1600 },
  FUK: { lat: 33.5904, lng: 130.4017 },
  CTS: { lat: 43.0642, lng: 141.3469 },
  NGO: { lat: 35.1815, lng: 136.9066 },
  OKA: { lat: 26.2124, lng: 127.6790 },
  // 중국
  PEK: { lat: 39.9042, lng: 116.4074 },
  PVG: { lat: 31.2304, lng: 121.4737 },
  CAN: { lat: 23.1291, lng: 113.2644 },
  SZX: { lat: 22.7067, lng: 114.0428 },
  CTU: { lat: 30.5728, lng: 104.0668 },
  HGH: { lat: 30.2741, lng: 120.1551 },
  CSX: { lat: 28.2282, lng: 112.9388 },
  TAO: { lat: 36.0986, lng: 120.3719 },
  DLC: { lat: 38.9140, lng: 121.6147 },
  // 대만
  TPE: { lat: 25.0330, lng: 121.5654 },
  KHH: { lat: 22.6273, lng: 120.3014 },
  // 홍콩/마카오
  HKG: { lat: 22.3193, lng: 114.1694 },
  MFM: { lat: 22.1987, lng: 113.5439 },
  // 동남아
  BKK: { lat: 13.7563, lng: 100.5018 },
  CNX: { lat: 18.7883, lng: 98.9853 },
  HKT: { lat: 7.9519, lng: 98.3381 },
  SGN: { lat: 10.8231, lng: 106.6297 },
  HAN: { lat: 21.0285, lng: 105.8542 },
  DAD: { lat: 16.0544, lng: 108.2022 },
  SIN: { lat: 1.3521, lng: 103.8198 },
  KUL: { lat: 3.1390, lng: 101.6869 },
  BKI: { lat: 5.9804, lng: 116.0675 },
  MNL: { lat: 14.5995, lng: 120.9842 },
  CEB: { lat: 10.3157, lng: 123.8854 },
  CGK: { lat: -6.2088, lng: 106.8456 },
  DPS: { lat: -8.7467, lng: 115.1669 },
  PNH: { lat: 11.5564, lng: 104.9282 },
  REP: { lat: 13.3671, lng: 103.8448 },
  RGN: { lat: 16.8661, lng: 96.1951 },
  VTE: { lat: 17.9757, lng: 102.6331 },
  // 남아시아
  DEL: { lat: 28.6139, lng: 77.2090 },
  BOM: { lat: 19.0760, lng: 72.8777 },
  CMB: { lat: 6.9271, lng: 79.8612 },
  KTM: { lat: 27.7172, lng: 85.3240 },
  // 중앙아시아/중동
  DXB: { lat: 25.2048, lng: 55.2708 },
  AUH: { lat: 24.4539, lng: 54.3773 },
  IST: { lat: 41.0082, lng: 28.9784 },
  TLV: { lat: 32.0853, lng: 34.7818 },
  DOH: { lat: 25.2854, lng: 51.5310 },
  NQZ: { lat: 51.1603, lng: 71.4791 },
  ALA: { lat: 43.2220, lng: 76.8512 },
  TAS: { lat: 41.2995, lng: 69.2401 },
  // 몰디브
  MLE: { lat: 4.1755, lng: 73.5093 },
  // 유럽
  CDG: { lat: 48.8566, lng: 2.3522 },
  LHR: { lat: 51.5074, lng: -0.1278 },
  FCO: { lat: 41.9028, lng: 12.4964 },
  MXP: { lat: 45.4642, lng: 9.1900 },
  BCN: { lat: 41.3851, lng: 2.1734 },
  MAD: { lat: 40.4168, lng: -3.7038 },
  FRA: { lat: 50.1109, lng: 8.6821 },
  MUC: { lat: 48.1351, lng: 11.5820 },
  AMS: { lat: 52.3676, lng: 4.9041 },
  ZRH: { lat: 47.3769, lng: 8.5417 },
  VIE: { lat: 48.2082, lng: 16.3738 },
  PRG: { lat: 50.0755, lng: 14.4378 },
  BUD: { lat: 47.4979, lng: 19.0402 },
  WAW: { lat: 52.2297, lng: 21.0122 },
  LIS: { lat: 38.7223, lng: -9.1393 },
  ATH: { lat: 37.9838, lng: 23.7275 },
  HEL: { lat: 60.1699, lng: 24.9384 },
  CPH: { lat: 55.6761, lng: 12.5683 },
  OSL: { lat: 59.9139, lng: 10.7522 },
  ARN: { lat: 59.3293, lng: 18.0686 },
  DUB: { lat: 53.3498, lng: -6.2603 },
  BRU: { lat: 50.8503, lng: 4.3517 },
  ZAG: { lat: 45.8150, lng: 15.9819 },
  OTP: { lat: 44.4268, lng: 26.1025 },
  SOF: { lat: 42.6977, lng: 23.3219 },
  // 러시아/CIS
  SVO: { lat: 55.7558, lng: 37.6173 },
  LED: { lat: 59.9311, lng: 30.3609 },
  // 북미
  LAX: { lat: 34.0522, lng: -118.2437 },
  JFK: { lat: 40.7128, lng: -74.0060 },
  SFO: { lat: 37.7749, lng: -122.4194 },
  HNL: { lat: 21.3099, lng: -157.8581 },
  LAS: { lat: 36.1699, lng: -115.1398 },
  SEA: { lat: 47.6062, lng: -122.3321 },
  ORD: { lat: 41.8781, lng: -87.6298 },
  ATL: { lat: 33.7490, lng: -84.3880 },
  DFW: { lat: 32.7767, lng: -96.7970 },
  GUM: { lat: 13.4443, lng: 144.7937 },
  SPN: { lat: 15.1965, lng: 145.7350 },
  YVR: { lat: 49.2827, lng: -123.1207 },
  YYZ: { lat: 43.6532, lng: -79.3832 },
  // 중남미
  CUN: { lat: 21.1619, lng: -86.8515 },
  MEX: { lat: 19.4326, lng: -99.1332 },
  GRU: { lat: -23.5505, lng: -46.6333 },
  LIM: { lat: -12.0464, lng: -77.0428 },
  SCL: { lat: -33.4489, lng: -70.6693 },
  BOG: { lat: 4.7110, lng: -74.0721 },
  EZE: { lat: -34.6037, lng: -58.3816 },
  // 오세아니아
  SYD: { lat: -33.8688, lng: 151.2093 },
  MEL: { lat: -37.8136, lng: 144.9631 },
  BNE: { lat: -27.4698, lng: 153.0251 },
  AKL: { lat: -36.8485, lng: 174.7633 },
  NAN: { lat: -17.7995, lng: 177.4165 },
  // 아프리카
  CAI: { lat: 30.0444, lng: 31.2357 },
  CPT: { lat: -33.9249, lng: 18.4241 },
  JNB: { lat: -26.2041, lng: 28.0473 },
  NBO: { lat: -1.2921, lng: 36.8219 },
  ADD: { lat: 9.0054, lng: 38.7636 },
  CMN: { lat: 33.5731, lng: -7.5898 },
  TUN: { lat: 36.8065, lng: 10.1815 },
  DAR: { lat: -6.7924, lng: 39.2083 },
  MRU: { lat: -20.1609, lng: 57.5089 },
  // 한국
  ICN: { lat: 37.4602, lng: 126.4407 },
  TAE: { lat: 35.8714, lng: 128.6011 },
  PUS: { lat: 35.1796, lng: 129.0756 },
};

interface WorldMapProps {
  flightData: FlightPrice[];
  onCityClick: (cityCode: string, cityName: string, price: number) => void;
}

export default function WorldMap({ flightData, onCityClick }: WorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [zoom, setZoom] = useState(1);

  // 도시별 최저가 집계
  const cityData = useMemo(() => {
    const map: Record<string, { name: string; country: string; price: number }> = {};

    for (const flight of flightData) {
      const cityInfo = cityCountryMap[flight.toCity];
      if (!cityInfo) continue;

      const existing = map[flight.toCity];
      if (!existing) {
        map[flight.toCity] = {
          name: cityInfo.cityKo,
          country: cityInfo.countryKo,
          price: flight.totalPrice,
        };
      } else if (flight.totalPrice < existing.price) {
        existing.price = flight.totalPrice;
      }
    }

    return map;
  }, [flightData]);

  const formatPrice = (price: number) =>
    `₩${price.toLocaleString("ko-KR")}`;

  const shortPrice = (price: number) => {
    if (price >= 10000) return `${Math.round(price / 10000)}만`;
    return `${price.toLocaleString()}`;
  };

  // 줌 < 2: 마커 dot만, 줌 2~4: 도시 이름, 줌 4+: 이름 + 가격
  const showLabel = zoom >= 2;
  const showPrice = zoom >= 4;

  const citiesList = Object.entries(cityData).map(([code, data]) => {
    const coords = cityCoordinates[code];
    if (!coords) return null;

    const formattedPrice = formatPrice(data.price);

    const markerR = 3.5 / zoom;
    const markerStroke = 1.2 / zoom;

    return (
      <Marker key={code} coordinates={[coords.lng, coords.lat]}>
        <g
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setTooltipContent(`${data.name} (${data.country}) - ${formattedPrice}~`)}
          onMouseLeave={() => setTooltipContent("")}
          onTouchStart={(e: any) => {
            e.preventDefault();
            setTooltipContent(`${data.name} (${data.country}) - ${formattedPrice}~`);
          }}
          onTouchEnd={(e: any) => {
            e.preventDefault();
            onCityClick(code, data.name, data.price);
          }}
          onClick={() => onCityClick(code, data.name, data.price)}
        >
          <circle
            r={markerR}
            fill="#0EA5E9"
            stroke="#ffffff"
            strokeWidth={markerStroke}
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}
          />
          {showLabel && (
            <text
              y={-(5 / zoom)}
              textAnchor="middle"
              style={{
                fontSize: `${3 / zoom}px`,
                fontWeight: 600,
                fill: "#222222",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                paintOrder: "stroke",
                stroke: "white",
                strokeWidth: `${1 / zoom}px`,
                strokeLinejoin: "round",
              }}
            >
              {showPrice ? `${data.name} ${shortPrice(data.price)}` : data.name}
            </text>
          )}
        </g>
      </Marker>
    );
  }).filter(Boolean);

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: "#f0f7fc" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [0, 20] }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={8} onMoveEnd={({ zoom: z }) => setZoom(z)}>
          {/* 배경 지도 */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: "#e2e8f0",
                      stroke: "#cbd5e1",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#cbd5e1",
                      stroke: "#94a3b8",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#94a3b8",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {/* 도시 포인트 */}
          {citiesList}
        </ZoomableGroup>
      </ComposableMap>

      {/* 툴팁 */}
      {tooltipContent && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 py-2.5 bg-white text-[#222222] text-sm rounded-2xl whitespace-nowrap font-medium transition-opacity duration-150"
          style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px" }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}
