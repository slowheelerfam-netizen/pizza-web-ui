"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomeWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("homeModalSeen");
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("homeModalSeen", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 text-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-red-800">
        <h2 className="text-2xl font-bold text-red-500 mb-4">🍕 Welcome to Krusty Pizzeria!</h2>
        <p className="text-gray-300 mb-6">Here's how to experience the full restaurant system:</p>
        <ol className="space-y-3 text-gray-300 mb-6">
          <li><span className="text-red-400 font-bold">1.</span> Browse the menu, click a pizza, customize and place your order</li>
          <li><span className="text-red-400 font-bold">2.</span> Visit the <Link href="/oven" onClick={handleClose} className="text-red-400 underline hover:text-red-300">Register</Link> to see your order come in — click <strong>Start Prep</strong> to send it to the kitchen</li>
          <li><span className="text-red-400 font-bold">3.</span> Visit the <Link href="/monitor" onClick={handleClose} className="text-red-400 underline hover:text-red-300">Monitor</Link> to see the read-only kitchen display</li>
          <li><span className="text-red-400 font-bold">4.</span> Visit the <Link href="/kitchen" onClick={handleClose} className="text-red-400 underline hover:text-red-300">Kitchen</Link> to move your order through Prep → Oven → Boxing → Ready</li>
          <li><span className="text-red-400 font-bold">5.</span> Once Ready, the order closes out automatically (cash orders require payment first)</li>
        </ol>
        <button
          onClick={handleClose}
          className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition"
        >
          Got it, let's order! 🍕
        </button>
      </div>
    </div>
  );
}