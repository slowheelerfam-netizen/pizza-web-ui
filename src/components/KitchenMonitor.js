'use client'

import { useState, useEffect } from 'react'

export default function KitchenMonitor({ initialOrders = [] }) {
  const [orders, setOrders] = useState(initialOrders)

  // This is a simplified example. In a real-world scenario, you'd use
  // websockets or a library like SWR/React Query for real-time updates.
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/orders?active=true')
        if (res.ok) {
          const freshOrders = await res.json()
          const activeOrders = freshOrders.filter(
            (o) => o.status === 'PREP' || o.status === 'OVEN'
          )
          setOrders(activeOrders)
        }
      } catch (error) {
        console.error('Failed to refresh orders:', error)
      }
    }, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const prepOrders = orders
    .filter((o) => o.status === 'PREP')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const ovenOrders = orders
    .filter((o) => o.status === 'OVEN')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const renderOrderCard = (order) => (
    <div
      key={order.id}
      className="mb-4 rounded-xl border-2 border-slate-200 bg-white p-4 shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-extrabold text-slate-800">
            {order.customerSnapshot?.name || 'Guest'}
          </div>
          <div className="text-sm font-bold text-slate-500">
            #{order.displayId}
          </div>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            order.status === 'PREP'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-orange-100 text-orange-800'
          }`}
        >
          {order.status}
        </div>
      </div>
      <div className="mt-4 border-t-2 border-dashed border-slate-200 pt-4">
        <ul className="space-y-2">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-700">
                {item.quantity}x {item.name}
              </span>
              {item.toppings && item.toppings.length > 0 && (
                <div className="text-xs text-slate-500">
                  {item.toppings.join(', ')}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-800 p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Kitchen Monitor
        </h1>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* PREP Column */}
        <div className="rounded-2xl bg-slate-700/50 p-6 shadow-2xl">
          <h2 className="mb-6 flex items-center justify-between text-3xl font-bold text-yellow-300">
            <span>👨‍🍳 PREP</span>
            <span className="rounded-full bg-yellow-300/20 px-3 py-1 text-xl font-semibold">
              {prepOrders.length}
            </span>
          </h2>
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {prepOrders.length > 0 ? (
              prepOrders.map(renderOrderCard)
            ) : (
              <div className="py-16 text-center text-lg font-medium text-slate-400">
                No orders to prepare.
              </div>
            )}
          </div>
        </div>

        {/* OVEN Column */}
        <div className="rounded-2xl bg-slate-700/50 p-6 shadow-2xl">
          <h2 className="mb-6 flex items-center justify-between text-3xl font-bold text-orange-300">
            <span>🔥 OVEN</span>
            <span className="rounded-full bg-orange-300/20 px-3 py-1 text-xl font-semibold">
              {ovenOrders.length}
            </span>
          </h2>
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {ovenOrders.length > 0 ? (
              ovenOrders.map(renderOrderCard)
            ) : (
              <div className="py-16 text-center text-lg font-medium text-slate-400">
                No orders in the oven.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
