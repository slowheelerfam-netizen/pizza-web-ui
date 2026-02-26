"use client";

import { useState, useEffect } from "react";

export default function KitchenTooltip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log("KitchenTooltip mounted, setting visible in 1 second");
    setTimeout(() => {
      console.log("Setting visible to true now");
      setVisible(true);
    }, 1000);
  }, []);

  console.log("KitchenTooltip render, visible:", visible);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "100px",
      right: "100px",
      background: "red",
      color: "white",
      padding: "20px",
      zIndex: 9999,
      fontSize: "24px",
    }}>
      TOOLTIP TEST
    </div>
  );
}