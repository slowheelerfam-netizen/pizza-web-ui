import Link from 'next/link'
import PublicOrderInterface from '../../components/PublicOrderInterface'

export const metadata = {
  title: "Order Pizza | Don's Pizza Shop",
  description: 'Order the best pizza in town online.',
}

export default function OrderPage() {
  return (
    <main className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 px-4 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-white/10 px-6 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Register
            </Link>
            <Link
              href="/kitchen"
              className="rounded-full bg-white/10 px-6 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Kitchen
            </Link>
            <Link
              href="/oven"
              className="rounded-full bg-white/10 px-6 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Oven
            </Link>
            <Link
              href="/monitor"
              className="rounded-full bg-white/10 px-6 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Monitor
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1600px] px-4 py-12 lg:px-8">
          <PublicOrderInterface />
        </div>
      </div>
    </main>
  )
}
