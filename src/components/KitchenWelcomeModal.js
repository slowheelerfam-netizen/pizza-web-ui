"use client";

import { useState, useEffect } from "react";

export default function KitchenWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("kitchenModalSeen");
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("kitchenModalSeen", "true");
    setIsOpen(false);
    // Tell the tooltip to show
    window.dispatchEvent(new CustomEvent("kitchenModalClosed"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 text-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-red-800">
        <h2 className="text-2xl font-bold text-red-500 mb-4">👨‍🍳 Kitchen View</h2>
        <p className="text-gray-300 mb-6">Move orders through each stage as you work:</p>
        <ol className="space-y-3 text-gray-300 mb-6">
          <li><span className="text-red-400 font-bold">1. Prep</span> — New order received. Review the ticket and start gathering ingredients.</li>
          <li><span className="text-red-400 font-bold">2. Oven</span> — Pizza is actively cooking. Click to move it when it goes in.</li>
          <li><span className="text-red-400 font-bold">3. Boxing</span> — Out of the oven. Slice, box, and verify the order.</li>
          <li><span className="text-red-400 font-bold">4. Ready</span> — Boxed and waiting for pickup. Front of house is notified.</li>
          <li><span className="text-red-400 font-bold">5. Close Out</span> — Order handed off. Cash orders require payment before closing.</li>
        </ol>
        <button
          onClick={handleClose}
          className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition"
        >
          Let's cook! 👨‍🍳
        </button>
      </div>
    </div>
  );
}
