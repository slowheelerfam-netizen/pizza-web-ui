'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MENU_ITEMS, TOPPINGS } from '../types/models'

// ── Elapsed timer hook ───────────────────────────────────────────────────────

function getElapsed(createdAt) {
  const ms = Date.now() - new Date(createdAt).getTime()
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return { min, display: `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}` }
}

function useElapsed(createdAt) {
  const [elapsed, setElapsed] = useState(() => getElapsed(createdAt))
  useEffect(() => {
    const id = setInterval(() => setElapsed(getElapsed(createdAt)), 1000)
    return () => clearInterval(id)
  }, [createdAt])
  return elapsed
}

function timerColors(min) {
  if (min < 8)  return { text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200', blink: false }
  if (min < 15) return { text: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', blink: false }
  return              { text: 'text-red-600',     bg: 'bg-red-50',    border: 'border-red-200',    blink: true  }
}

// ── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order, getFullIngredients }) {
  const elapsed = useElapsed(order.createdAt)
  const colors  = timerColors(elapsed.min)

  return (
    <div className="flex flex-col rounded-lg border-2 border-gray-300 bg-white shadow-sm overflow-hidden">

      {/* Header */}
      <div className={`grid grid-cols-2 gap-2 border-b-2 border-gray-200 px-4 py-3 ${colors.bg}`}>
        <div>
          <h3 className="text-2xl font-black text-gray-900 leading-tight">
            {order.customerSnapshot?.name || 'Guest'}
          </h3>
          <p className="text-sm font-bold text-gray-500">
            {order.customerSnapshot?.phone || 'No Phone'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-3xl font-black text-gray-800">
            #{order.displayId}
          </span>
          <span className={`font-mono text-2xl font-black tabular-nums ${colors.text} ${colors.blink ? 'animate-pulse' : ''}`}>
            {elapsed.display}
          </span>
        </div>
      </div>

      {/* Special instructions */}
      {order.specialInstructions && (
        <div className="mx-3 mt-3 rounded-lg border-2 border-red-200 bg-red-50 px-3 py-2 text-base font-black text-red-600">
          ⚠️ {order.specialInstructions}
        </div>
      )}

      {/* Items */}
      <div className="flex-1 px-4 py-3">
        <ul className="flex flex-col gap-3">
          {order.items?.map((item, idx) => {
            const ingredients = getFullIngredients(item)
            return (
              <li key={idx} className="border-b-2 border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-700 leading-none">
                    {item.quantity}×
                  </span>
                  <div>
                    <span className="block text-lg font-black text-gray-500 uppercase leading-tight">
                      {item.size.split(' (')[0]}
                    </span>
                    <span className="block text-2xl font-black text-gray-900 leading-tight">
                      {item.name}
                    </span>
                  </div>
                </div>

                {ingredients.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-0.5 pl-1">
                    {ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 text-lg font-semibold text-gray-600">
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                )}

                {item.notes && (
                  <div className="mt-2 text-base font-bold italic text-indigo-600">
                    "{item.notes}"
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className={`border-t-2 ${colors.border} ${colors.bg} px-4 py-2 text-center`}>
        <span className={`text-sm font-black tracking-widest uppercase ${colors.text}`}>
          In Prep
        </span>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function MonitorDisplay({ initialOrders }) {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 5000)
    return () => clearInterval(interval)
  }, [router])

  const displayOrders = initialOrders
    .filter((o) => o.status === 'PREP')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const getFullIngredients = (item) => {
    const menuItem = MENU_ITEMS.find((m) => m.name === item.name)
    const toppingLabels = new Set(Object.values(TOPPINGS).map((t) => t.label))
    const baseIngredients =
      menuItem?.ingredients?.filter((ing) => !toppingLabels.has(ing)) || []
    const selectedToppings = item.toppings || []
    return [...new Set([...baseIngredients, ...selectedToppings])]
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-8 py-3 shadow-sm">
        <h1 className="text-4xl font-black text-indigo-900">
          📺 LIVE PREP QUEUE{' '}
          <span className="text-2xl font-medium text-slate-400">| Kitchen Display</span>
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> &lt; 8 min
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-orange-400" /> &lt; 15 min
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> 15+ min
            </span>
          </div>
          <div className="text-2xl font-black text-gray-800">
            {displayOrders.length} ORDER{displayOrders.length !== 1 ? 'S' : ''} IN PREP
          </div>
        </div>
      </header>

      {/* Grid: 5 columns × 3 rows */}
      <div className="flex-1 overflow-y-auto p-6">
        {displayOrders.length === 0 ? (
          <div className="flex h-full items-center justify-center text-4xl font-black text-gray-300">
            NO ACTIVE ORDERS
          </div>
        ) : (
          <div className="grid gap-4 auto-rows-fr" 
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {displayOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                getFullIngredients={getFullIngredients}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}