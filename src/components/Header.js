"use client"

import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-red-900 bg-opacity-90">
      <nav className="w-full px-4">
        <div className="flex items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white">
            Krusty Pizzeria
          </Link>
        </div>
      </nav>
    </header>
  );
}