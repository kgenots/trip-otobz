"use client";

const PUSH_API_KEY = process.env.NEXT_PUBLIC_PUSH_API_KEY;

export function usePush() {
  async function registerPush(routeCode: string) {
    if (!("serviceWorker" in navigator) || !PUSH_API_KEY) return false;

    try {
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return false;

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      });

      const userId = navigator.userAgent.slice(0, 100);

      await fetch(`/api/push/register?key=${PUSH_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription, userId, routeCode }),
      });

      return true;
    } catch {
      return false;
    }
  }

  return { registerPush };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = base64String.replace(/-/g, "+").replace(/_/g, "/") + padding;
  const decoded = decodeURIComponent(escape(atob(base64)));
  return new Uint8Array([...decoded].map((c) => c.charCodeAt(0)));
}
