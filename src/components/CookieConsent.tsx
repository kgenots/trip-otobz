"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tob_cookie_consent";

interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void;
}

function updateConsent(value: "granted" | "denied") {
  if (typeof window === "undefined") return;
  const w = window as WindowWithGtag;
  w.gtag?.("consent", "update", {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

export interface CookieConsentProps {
  lang?: "ko" | "en" | "auto";
}

export default function CookieConsent({ lang = "auto" }: CookieConsentProps) {
  const [show, setShow] = useState(false);
  const [detectedLang, setDetectedLang] = useState<"ko" | "en">("ko");

  useEffect(() => {
    try {
      const choice = localStorage.getItem(STORAGE_KEY);
      if (!choice) setShow(true);
    } catch {
      setShow(true);
    }
    if (lang === "auto") {
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      setDetectedLang(path.startsWith("/en") ? "en" : "ko");
    } else {
      setDetectedLang(lang);
    }
  }, [lang]);

  function handle(value: "granted" | "denied") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    updateConsent(value);
    setShow(false);
  }

  if (!show) return null;

  const isKo = detectedLang === "ko";
  const privacyHref = isKo ? "/privacy" : "/en/privacy";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isKo ? "쿠키 동의" : "Cookie consent"}
      className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 bg-white shadow-lg"
    >
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-[#444] leading-relaxed flex-1">
          {isKo
            ? "trip.otobz는 사용자 경험 개선과 광고 맞춤화를 위해 쿠키를 사용합니다. "
            : "trip.otobz uses cookies to improve your experience and personalize ads. "}
          <a
            href={privacyHref}
            className="underline text-sky-600 hover:text-sky-700"
          >
            {isKo ? "개인정보 처리방침" : "Privacy Policy"}
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handle("denied")}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-[#666] hover:bg-gray-50"
          >
            {isKo ? "거부" : "Reject"}
          </button>
          <button
            type="button"
            onClick={() => handle("granted")}
            className="px-4 py-2 text-sm font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            {isKo ? "동의" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
