"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface PricePoint {
  date: string;
  price: number;
}

export default function PriceChart({ city }: { city: string }) {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/price-history?city=${city}&days=90`)
      .then((r) => r.json())
      .then((json) => setData(json.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100" style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.03) 0px 1px 3px" }}>
        <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100 text-center" style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.03) 0px 1px 3px" }}>
        <p className="text-[#6a6a6a] text-sm">가격 추이 데이터 수집 중...</p>
        <p className="text-gray-400 text-xs mt-1">매일 자동 수집되며 곧 그래프가 표시됩니다</p>
      </div>
    );
  }

  const formatPrice = (v: number) => `₩${(v / 10000).toFixed(0)}만`;
  const formatPriceFull = (v: number) => `₩${v.toLocaleString("ko-KR")}`;
  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (data.length === 1) {
    return (
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100" style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.03) 0px 1px 3px" }}>
        <h3 className="text-[#6a6a6a] text-xs mb-2 font-medium">최저가 추이 (최근 90일)</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sky-600 text-xl font-bold">{formatPriceFull(data[0].price)}</span>
          <span className="text-gray-400 text-xs">{formatDate(data[0].date)} 기준</span>
        </div>
        <p className="text-gray-400 text-xs mt-1">데이터가 쌓이면 그래프가 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100" style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.03) 0px 1px 3px" }}>
      <h3 className="text-[#6a6a6a] text-xs mb-3 font-medium">최저가 추이 (최근 90일)</h3>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#9ca3af"
            fontSize={10}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatPrice}
            stroke="#9ca3af"
            fontSize={10}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: 12,
              boxShadow: "rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.08) 0px 4px 8px",
            }}
            labelFormatter={(label) => formatDate(String(label))}
            formatter={(value) => [`₩${Number(value).toLocaleString("ko-KR")}`, "최저가"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#0EA5E9"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#0EA5E9" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
