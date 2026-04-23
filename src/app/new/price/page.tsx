"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface PricePoint {
  date: string;
  price: number;
  period: number;
  city: string;
}

interface RouteInfo {
  code: string;
  display: string;
  city: string;
  sort: number;
}

interface PredictionResult {
  route: string;
  prediction: number | null;
  current: number;
  change: number;
  changePercent: number;
  direction: "up" | "down" | "flat";
  dataPoints: number;
  insufficientData?: boolean;
}

interface AlertResult {
  alert: { id: number; route_code: string; user_email: string; user_name: string | null; target_price: number; is_active: boolean };
  message: string;
}

const ROUTES: RouteInfo[] = [
  { code: "BKK", display: "Bangkok", city: "bangkok", sort: 1 },
  { code: "NRT", display: "Tokyo", city: "tokyo", sort: 2 },
  { code: "CNX", display: "Chiang Mai", city: "chiang mai", sort: 3 },
  { code: "SGN", display: "Ho Chi Minh City", city: "ho chi minh", sort: 4 },
  { code: "KUL", display: "Kuala Lumpur", city: "kuala lumpur", sort: 5 },
  { code: "RGN", display: "Yangon", city: "yangon", sort: 6 },
  { code: "MNL", display: "Manila", city: "manila", sort: 7 },
  { code: "TPE", display: "Taipei", city: "taipei", sort: 8 },
  { code: "SIN", display: "Singapore", city: "singapore", sort: 9 },
  { code: "PEK", display: "Beijing", city: "beijing", sort: 10 },
];

const DEFAULT_ROUTE = "BKK";

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR");
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = base64String.replace(/-/g, "+").replace(/_/g, "/") + padding;
  const decoded = decodeURIComponent(escape(atob(base64)));
  return new Uint8Array([...decoded].map((c) => c.charCodeAt(0)));
}

export default function PricePage() {
  const [selectedRoute, setSelectedRoute] = useState<string>(DEFAULT_ROUTE);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");

  // Alert form state
  const [alertEmail, setAlertEmail] = useState("");
  const [alertName, setAlertName] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState("");
  const [alertError, setAlertError] = useState("");

  // Load routes list once
  useEffect(() => {
    fetch("/api/price")
      .then((r) => r.json())
      .then((data) => {
        if (data.routes) setRoutes(data.routes);
      })
      .catch(() => {});
  }, []);

  // Load history + prediction for selected route
  useEffect(() => {
    if (!selectedRoute) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/price/search?route=${encodeURIComponent(selectedRoute)}`, { signal: controller.signal }).then((r) => r.json()),
      fetch(`/api/price/predict?route=${encodeURIComponent(selectedRoute)}`, { signal: controller.signal }).then((r) => r.json()),
    ])
      .then(([searchData, predData]) => {
        const s = searchData as { history: PricePoint[]; error?: string };
        if (s.error) {
          setError(s.error);
        } else {
          setHistory(s.history || []);
        }
        const p = predData as PredictionResult & { error?: string };
        if (!p.error) {
          setPrediction(p);
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Failed to load data");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [selectedRoute]);

  const filteredHistory = history.filter((h) => {
    const days = timeRange === "7" ? 7 : timeRange === "30" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(h.date) >= cutoff;
  });

  const chartData = filteredHistory.map((h) => ({
    date: h.date,
    price: h.price,
  }));

  async function registerPushSubscription(routeCode: string) {
    const key = process.env.NEXT_PUBLIC_PUSH_API_KEY;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!key || !vapidKey || !("serviceWorker" in navigator)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const p256dh = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh"))));
      const auth = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth"))));

      await fetch(`/api/push/register?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: btoa(alertEmail).slice(0, 100),
          subscription: { endpoint: subscription.endpoint, keys: { p256dh, auth } },
          routeCode,
        }),
      });
    } catch {
      // Non-blocking — push failure does not break alert
    }
  }

  const targetPriceNum = alertPrice ? Number(alertPrice) : null;
  const currentPrice = prediction?.current || null;

  async function handleAlertSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlertError("");
    setAlertSuccess("");

    if (!alertEmail || !targetPriceNum || !currentPrice) {
      setAlertError("Enter your email and target price.");
      return;
    }

    if (targetPriceNum >= currentPrice) {
      setAlertError("Target price should be below current price.");
      return;
    }

    setAlertLoading(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route: selectedRoute,
          email: alertEmail,
          name: alertName || undefined,
          targetPrice: targetPriceNum,
        }),
      });
      const data = (await res.json()) as AlertResult;
      if (data.alert) {
        setAlertEmail("");
        setAlertName("");
        setAlertPrice("");
        registerPushSubscription(selectedRoute);
      } else {
        setAlertError(data.error || "Could not save alert. Try again.");
      }
    } catch {
      setAlertError("Network error.");
    } finally {
      setAlertLoading(false);
    }
  }

  const directionColor = prediction?.direction === "down" ? "#16a34a" : prediction?.direction === "up" ? "#dc2626" : "#6b7280";
  const directionLabel = prediction?.direction === "down" ? "Falling" : prediction?.direction === "up" ? "Rising" : "Stable";
  const directionEmoji = prediction?.direction === "down" ? "↓" : prediction?.direction === "up" ? "↑" : "→";
  const minPrice = history.length > 0 ? Math.min(...history.map((h) => h.price)) : null;
  const maxPrice = history.length > 0 ? Math.max(...history.map((h) => h.price)) : null;
  const avgPrice = history.length > 0 ? Math.round(history.reduce((s, h) => s + h.price, 0) / history.length) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <a href="/" className="text-sm text-gray-400 hover:text-[#ff385c] transition-colors">
            ← Trip OTOBZ
          </a>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
            Price Pulse
          </h1>
          <p className="mt-1 text-sm text-[#6a6a6a]">
            Seoul departure flight prices · Real-time tracking + prediction
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Route Chips */}
        <div className="mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {routes.map((r) => (
              <button
                key={r.code}
                onClick={() => setSelectedRoute(r.code)}
                aria-selected={r.code === selectedRoute}
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  r.code === selectedRoute
                    ? "bg-[#222222] text-white"
                    : "bg-gray-100 text-[#6a6a6a] hover:bg-gray-200"
                }`}
              >
                {r.display}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          /* Skeleton Loading */
          <div className="space-y-6 animate-pulse">
            <div className="h-[300px] bg-gray-100 rounded-2xl" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-gray-100 rounded-xl" />
              <div className="h-16 bg-gray-100 rounded-xl" />
              <div className="h-16 bg-gray-100 rounded-xl" />
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-16">
            <p className="text-[#6a6a6a]">We couldn't fetch current prices right now.</p>
            <p className="text-xs text-gray-400 mt-1">Our scraper usually updates once per day.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-sm font-medium bg-[#ff385c] text-white rounded-lg hover:bg-[#e00b41] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Time Range Selector */}
            <div className="flex items-center gap-2 mb-4">
              {(["7", "30", "90"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setTimeRange(d)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    timeRange === d
                      ? "bg-[#222222] text-white"
                      : "bg-gray-100 text-[#6a6a6a] hover:bg-gray-200"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>

            {/* Price Chart */}
            <div
              className="rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6"
              style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#222222]">
                  {routes.find((r) => r.code === selectedRoute)?.display || selectedRoute}
                </h2>
                {prediction && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: directionColor }}>
                      {directionEmoji}
                    </span>
                    <span className="text-sm font-medium" style={{ color: directionColor }}>
                      {directionLabel} {Math.abs(prediction.changePercent)}%
                    </span>
                  </div>
                )}
              </div>

              {filteredHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#9497a9" }}
                      tickFormatter={(v: string) => v.slice(5)}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9497a9" }}
                      tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                      width={50}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        fontSize: "13px",
                      }}
                      formatter={(value) => [`₩${Number(value).toLocaleString()}`, "Price"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                    {prediction?.prediction && (
                      <Line
                        type="monotone"
                        dataKey="prediction"
                        stroke={directionColor}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-sm">No price data available yet.</p>
                  <p className="text-xs mt-1">We are collecting data for this route.</p>
                </div>
              )}
            </div>

            {/* Stats Row */}
            {minPrice !== null && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div
                  className="rounded-xl border border-gray-200 p-3 sm:p-4"
                  style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px" }}
                >
                  <div className="text-xs text-[#9497a9]">Lowest</div>
                  <div className="mt-1 text-lg sm:text-xl font-semibold text-[#222222]">
                    ₩{formatPrice(minPrice)}
                  </div>
                </div>
                <div
                  className="rounded-xl border border-gray-200 p-3 sm:p-4"
                  style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px" }}
                >
                  <div className="text-xs text-[#9497a9]">Average</div>
                  <div className="mt-1 text-lg sm:text-xl font-semibold text-[#222222]">
                    ₩{formatPrice(avgPrice || 0)}
                  </div>
                </div>
                <div
                  className="rounded-xl border border-gray-200 p-3 sm:p-4"
                  style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px" }}
                >
                  <div className="text-xs text-[#9497a9]">Predicted</div>
                  <div className="mt-1 text-lg sm:text-xl font-semibold" style={{ color: directionColor }}>
                    {prediction?.prediction ? `₩${formatPrice(prediction.prediction)}` : "—"}
                  </div>
                </div>
              </div>
            )}

            {/* Alert Setup Form */}
            <div
              className="rounded-2xl border border-gray-200 p-4 sm:p-6"
              style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px" }}
            >
              <h2 className="text-lg font-semibold text-[#222222] mb-1">Set Price Alert</h2>
              <p className="text-sm text-[#6a6a6a] mb-4">
                No alerts yet. Set one below — we'll notify you when prices drop.
              </p>

              {alertSuccess && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-800 text-sm">
                  {alertSuccess}
                </div>
              )}

              {alertError && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-800 text-sm">
                  {alertError}
                </div>
              )}

              <form onSubmit={handleAlertSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label htmlFor="alert-name" className="sr-only">Name (optional)</label>
                    <input
                      id="alert-name"
                      type="text"
                      value={alertName}
                      onChange={(e) => setAlertName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="alert-email" className="sr-only">Email</label>
                    <input
                      id="alert-email"
                      type="email"
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      placeholder="Your email"
                      required
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label htmlFor="alert-price" className="block text-xs text-[#6a6a6a] mb-1">
                      Target price (won)
                    </label>
                    <input
                      id="alert-price"
                      type="number"
                      value={alertPrice}
                      onChange={(e) => setAlertPrice(e.target.value)}
                      placeholder={currentPrice ? `Current: ₩${formatPrice(currentPrice)}` : "Enter target price"}
                      required
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={alertLoading || !targetPriceNum}
                      className="px-6 py-2.5 text-sm font-medium bg-[#222222] text-white rounded-lg hover:bg-[#111] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ minHeight: "44px" }}
                    >
                      {alertLoading ? "Setting..." : "Set Alert"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Insufficient Data Warning */}
            {prediction?.insufficientData && (
              <div className="mt-4 px-4 py-3 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
                Not enough data for prediction. Need at least 7 days of price history.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
