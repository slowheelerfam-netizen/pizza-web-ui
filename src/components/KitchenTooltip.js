"use client";

import { useState, useEffect } from "react";

export default function KitchenTooltip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const tooltipSeen = sessionStorage.getItem("kitchenTooltipSeen");
    if (tooltipSeen) return;

    const handler = () => {
      setTimeout(() => setVisible(true), 300);
    };
    window.addEventListener("kitchenModalClosed", handler);

    const modalSeen = sessionStorage.getItem("kitchenModalSeen");
    if (modalSeen) {
      setTimeout(() => setVisible(true), 500);
    }

    return () => window.removeEventListener("kitchenModalClosed", handler);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("kitchenTooltipSeen", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed z-40 flex flex-col items-end gap-2"
      style={{ bottom: "80px", right: "24px" }}
    >
      <div className="relative max-w-xs rounded-xl bg-blue-600 px-4 py-3 text-white shadow-xl">
        <p className="text-sm font-bold">👆 Start here!</p>
        <p className="mt-1 text-xs text-blue-100">
          Click <strong>Start Prep</strong> on a new order to begin cooking.
        </p>
        <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 bg-blue-600" />
        <button
          onClick={handleDismiss}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600 shadow"
        >
          ✕
        </button>
      </div>

      <div className="relative flex h-4 w-4 items-center justify-center self-end mr-6">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
      </div>
    </div>
  );
}