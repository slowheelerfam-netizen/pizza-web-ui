'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MENU_ITEMS, TOPPINGS } from '../app/types/models'

// ─── Live elapsed timer ────────────────────────────────────────────────────────
function useElapsed(createdAt) {
  const getSeconds = useCallback(
    () => Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000),
    [createdAt]
  )
  const [elapsed, setElapsed] = useState(getSeconds)

  useEffect(() => {
    setElapsed(getSeconds())
    const id = setInterval(() => setElapsed(getSeconds()), 1000)
    return () => clearInterval(id)
  }, [getSeconds])

  return elapsed
}

function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function timerColor(seconds) {
  if (seconds < 300) return { ring: '#22c55e', text: '#16a34a', bg: '#f0fdf4' } // < 5 min  green
  if (seconds < 600) return { ring: '#f59e0b', text: '#b45309', bg: '#fffbeb' } // < 10 min amber
  return { ring: '#ef4444', text: '#b91c1c', bg: '#fef2f2' }                    // ≥ 10 min red
}

// ─── Ingredient helpers ────────────────────────────────────────────────────────
function getFullIngredients(item) {
  const menuItem = MENU_ITEMS.find((m) => m.name === item.name)
  const toppingLabels = new Set(Object.values(TOPPINGS).map((t) => t.label))
  const baseIngredients =
    menuItem?.ingredients?.filter((ing) => !toppingLabels.has(ing)) || []
  const selectedToppings = item.toppings || []
  return [...new Set([...baseIngredients, ...selectedToppings])]
}

// ─── Single order card ─────────────────────────────────────────────────────────
function PrepCard({ order }) {
  const elapsed = useElapsed(order.createdAt)
  const colors = timerColor(elapsed)
  const timeStr = formatElapsed(elapsed)
  const isUrgent = elapsed >= 600

  return (
    <div
      style={{ borderColor: colors.ring }}
      className="flex flex-col rounded-2xl border-4 bg-white shadow-lg overflow-hidden"
    >
      {/* ── Header bar ── */}
      <div
        style={{ background: colors.bg, borderBottomColor: colors.ring }}
        className="flex items-center justify-between gap-4 border-b-4 px-5 py-3"
      >
        {/* Timer — dominant element */}
        <div className="flex flex-col items-start leading-none">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            ELAPSED
          </span>
          <span
            className={`font-black tabular-nums ${isUrgent ? 'animate-pulse' : ''}`}
            style={{ color: colors.text, fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', lineHeight: 1 }}
          >
            {timeStr}
          </span>
        </div>

        {/* Order # */}
        <div className="flex flex-col items-center leading-none">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            ORDER
          </span>
          <span className="font-black text-gray-900" style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)', lineHeight: 1 }}>
            #{order.displayId}
          </span>
        </div>

        {/* Customer name */}
        <div className="flex flex-col items-end leading-none min-w-0">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            CUSTOMER
          </span>
          <span className="truncate font-black text-gray-900 text-right" style={{ fontSize: 'clamp(1.25rem, 2vw, 2rem)', lineHeight: 1 }}>
            {order.customerSnapshot?.name || 'Guest'}
          </span>
          {order.customerSnapshot?.phone && (
            <span className="text-sm font-semibold text-gray-400 mt-0.5">
              {order.customerSnapshot.phone}
            </span>
          )}
        </div>

        {/* Cook name if assigned */}
        {order.assignedTo && (
          <div className="flex flex-col items-end leading-none min-w-0">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
              COOK
            </span>
            <span className="truncate font-black text-indigo-700" style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.75rem)', lineHeight: 1 }}>
              👨‍🍳 {order.assignedTo}
            </span>
          </div>
        )}
      </div>

      {/* ── Special instructions ── */}
      {order.specialInstructions && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3">
          <span className="text-2xl leading-none">⚠️</span>
          <p className="font-black text-red-700 leading-snug" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.4rem)' }}>
            {order.specialInstructions}
          </p>
        </div>
      )}

      {/* ── Pizza items ── */}
      <div className="flex flex-1 flex-col gap-0 px-4 pb-4 pt-3 divide-y-2 divide-gray-100">
        {order.items?.map((item, idx) => {
          const ingredients = getFullIngredients(item)
          return (
            <div key={idx} className="pt-3 pb-3 first:pt-0">
              {/* Pizza identity */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className="font-black text-gray-900 uppercase leading-none"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}
                >
                  {item.quantity}×
                </span>
                <span
                  className="font-black text-gray-900 leading-none"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}
                >
                  {item.name}
                </span>
                <span
                  className="font-bold text-gray-400 uppercase leading-none"
                  style={{ fontSize: 'clamp(1rem, 1.6vw, 1.75rem)' }}
                >
                  {item.size.split(' (')[0]}
                </span>
              </div>

              {/* Ingredients — pill tags, big & clear */}
              {ingredients.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-gray-900 px-3 py-1 font-black text-white uppercase tracking-wide"
                      style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.15rem)' }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              )}

              {/* Item notes */}
              {item.notes && (
                <p className="mt-2 font-bold text-indigo-600 italic" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.2rem)' }}>
                  "{item.notes}"
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main display ──────────────────────────────────────────────────────────────
export default function MonitorDisplay({ initialOrders }) {
  const router = useRouter()

  // Server-side refresh every 5 s to pick up new/completed orders
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 5000)
    return () => clearInterval(id)
  }, [router])

  const displayOrders = initialOrders
    .filter((o) => o.status === 'PREP')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  // Dynamic grid: 1 col ≤ 1 order, 2 col for 2-4, 3 col for 5+
  const gridClass =
    displayOrders.length === 1
      ? 'grid grid-cols-1 max-w-2xl mx-auto'
      : displayOrders.length <= 4
        ? 'grid grid-cols-2'
        : 'grid grid-cols-3'

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      {/* ── Header ── */}
      <header className="flex items-center justify-between bg-gray-900 px-6 py-3 border-b border-gray-700">
        <h1 className="text-2xl font-black tracking-tight text-white">
          🍕 <span className="text-indigo-400">LIVE PREP QUEUE</span>
          <span className="ml-3 text-base font-medium text-gray-500">Kitchen Display</span>
        </h1>
        <div className="flex items-center gap-4">
          <LiveClock />
          <span className="rounded-full bg-indigo-600 px-4 py-1 text-base font-black text-white">
            {displayOrders.length} ORDER{displayOrders.length !== 1 ? 'S' : ''}
          </span>
        </div>
      </header>

      {/* ── Cards ── */}
      <div className="flex-1 overflow-y-auto p-5">
        {displayOrders.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-5xl font-black text-gray-700 tracking-tight uppercase">
              No Active Orders
            </p>
          </div>
        ) : (
          <div className={`${gridClass} gap-5 w-full`}>
            {displayOrders.map((o) => (
              <PrepCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Wall clock in header ──────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  )
  useEffect(() => {
    const id = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        ),
      1000
    )
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-lg font-bold text-gray-400">{time}</span>
}