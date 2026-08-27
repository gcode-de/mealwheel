import { useEffect } from "react";

export function registerServiceWorker(serviceWorker) {
  if (!serviceWorker) return Promise.resolve(null);

  return serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none",
  });
}

export default function PwaRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    registerServiceWorker(navigator.serviceWorker).catch((error) => {
      console.error("Service Worker konnte nicht registriert werden:", error);
    });
  }, []);

  return null;
}
