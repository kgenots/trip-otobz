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
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-800">
        <div className="animate-pulse h-32 bg-gray-800 rounded" />
      </div>
    );
  }

  if (data.length < 2) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-800 text-center">
        <p className="text-gray-500 text-sm">📈 가격 추이 데이터 수집 중...</p>
        <p className="text-gray-600 text-xs mt-1">매일 자동 수집되며 곧 그래프가 표시됩니다</p>
      </div>
    );
  }

  const formatPrice = (v: number) => `₩${(v / 10000).toFixed(0)}만`;
  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-800">
      <h3 className="text-gray-400 text-xs mb-3">📈 최저가 추이 (최근 90일)</h3>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#6b7280"
            fontSize={10}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatPrice}
            stroke="#6b7280"
            fontSize={10}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: 12,
            }}
            labelFormatter={(label) => formatDate(String(label))}
            formatter={(value) => [`₩${Number(value).toLocaleString("ko-KR")}`, "최저가"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#10b981" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
