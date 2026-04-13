"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "./Tooltip";
import { cityCountryMap, getCountryCities, getCountryName } from "@/data/city-country-map";
import type { FlightPrice } from "@/lib/api";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO numeric → ISO alpha-2 매핑 (주요국)
const numericToAlpha2: Record<string, string> = {
  "392": "JP", "156": "CN", "158": "TW", "344": "HK", "446": "MO",
  "764": "TH", "704": "VN", "702": "SG", "458": "MY", "608": "PH",
  "360": "ID", "116": "KH", "104": "MM", "418": "LA", "356": "IN",
  "144": "LK", "524": "NP", "784": "AE", "792": "TR", "376": "IL",
  "634": "QA", "398": "KZ", "860": "UZ", "250": "FR", "826": "GB",
  "380": "IT", "724": "ES", "276": "DE", "528": "NL", "756": "CH",
  "040": "AT", "203": "CZ", "348": "HU", "616": "PL", "620": "PT",
  "300": "GR", "246": "FI", "208": "DK", "578": "NO", "752": "SE",
  "372": "IE", "056": "BE", "191": "HR", "642": "RO", "100": "BG",
  "643": "RU", "840": "US", "316": "GU", "580": "MP", "124": "CA",
  "484": "MX", "076": "BR", "604": "PE", "152": "CL", "170": "CO",
  "032": "AR", "036": "AU", "554": "NZ", "242": "FJ", "818": "EG",
  "710": "ZA", "404": "KE", "231": "ET", "504": "MA", "788": "TN",
  "834": "TZ", "480": "MU", "410": "KR",
};

interface WorldMapProps {
  flightData: FlightPrice[];
  onCountryClick: (countryCode: string, countryName: string, cities: { code: string; name: string; price: number }[]) => void;
}

export default function WorldMap({ flightData, onCountryClick }: WorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 국가별 최저가 집계 - 해당 국가의 모든 도시들
  const countryData = useMemo(() => {
    const map: Record<string, { cities: { code: string; name: string; price: number }[]; lowestPrice: number }> = {};

    for (const flight of flightData) {
      const cityInfo = cityCountryMap[flight.toCity];
      if (!cityInfo) continue;
      const cc = cityInfo.country;

      if (!map[cc]) {
        map[cc] = { cities: [], lowestPrice: Infinity };
      }

      // 도시 추가 (중복 체크)
      const existing = map[cc].cities.find(c => c.code === flight.toCity);
      if (!existing) {
        map[cc].cities.push({
          code: flight.toCity,
          name: cityInfo.cityKo,
          price: flight.totalPrice,
        });
      } else if (flight.totalPrice < existing.price) {
        existing.price = flight.totalPrice;
      }

      if (flight.totalPrice < map[cc].lowestPrice) {
        map[cc].lowestPrice = flight.totalPrice;
      }
    }

    // 도시별 가격 정렬 (낮은 순)
    for (const cc in map) {
      map[cc].cities.sort((a, b) => a.price - b.price);
    }

    return map;
  }, [flightData]);

  // 가격 → 색상 (초록=저렴, 노랑=중간, 빨강=비쌈)
  const priceToColor = useCallback((price: number) => {
    const prices = Object.values(countryData).map(d => d.lowestPrice);
    if (prices.length === 0) return "#1e293b";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const ratio = max === min ? 0 : (price - min) / (max - min);

    // 초록(0) → 노랑(0.5) → 빨강(1)
    if (ratio <= 0.5) {
      const t = ratio * 2;
      const r = Math.round(34 + t * (234 - 34));
      const g = Math.round(197 + t * (179 - 197));
      const b = Math.round(94 + t * (8 - 94));
      return `rgb(${r},${g},${b})`;
    } else {
      const t = (ratio - 0.5) * 2;
      const r = Math.round(234 + t * (239 - 234));
      const g = Math.round(179 - t * 179);
      const b = Math.round(8 + t * (68 - 8));
      return `rgb(${r},${g},${b})`;
    }
  }, [countryData]);

  const formatPrice = (price: number) =>
    `₩${price.toLocaleString("ko-KR")}`;

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [0, 20] }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={8}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numericId = geo.id;
                const alpha2 = numericToAlpha2[numericId];
                const priceData = alpha2 ? countryData[alpha2] : null;
                const isKorea = alpha2 === "KR";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => {
                      const name = getCountryName(alpha2 || "") || geo.properties.name;
                      if (priceData && priceData.cities.length > 0) {
                        const cheapest = priceData.cities[0];
                        setTooltipContent(
                          `${name} · ${cheapest.name} ${formatPrice(cheapest.price)}~`
                        );
                      } else if (!isKorea) {
                        setTooltipContent(name || "");
                      }
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setTooltipContent("")}
                    onClick={() => {
                      if (priceData && priceData.cities.length > 0 && alpha2) {
                        const name = getCountryName(alpha2) || geo.properties.name;
                        onCountryClick(alpha2, name, priceData.cities);
                      }
                    }}
                    style={{
                      default: {
                        fill: isKorea
                          ? "#3b82f6"
                          : priceData && priceData.cities.length > 0
                            ? priceToColor(priceData.lowestPrice)
                            : "#1e293b",
                        stroke: "#334155",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: priceData && priceData.cities.length > 0 ? "pointer" : "default",
                        transition: "fill 0.3s ease",
                      },
                      hover: {
                        fill: isKorea
                          ? "#60a5fa"
                          : priceData && priceData.cities.length > 0
                            ? "#f59e0b"
                            : "#334155",
                        stroke: "#94a3b8",
                        strokeWidth: 0.75,
                        outline: "none",
                        cursor: priceData && priceData.cities.length > 0 ? "pointer" : "default",
                      },
                      pressed: {
                        fill: "#f59e0b",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltipContent && (
        <Tooltip content={tooltipContent} x={tooltipPos.x} y={tooltipPos.y} />
      )}
    </div>
  );
}
