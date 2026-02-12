'use client'

import { useState, useEffect, useOptimistic, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import OrderEditModal from './OrderEditModal'
import OrderDetailsModal from './OrderDetailsModal'

export default function MonitorDisplay({ initialOrders, updateStatusAction }) {
  const router = useRouter()

  // Optimistic UI
  const [optimisticOrders, addOptimisticOrder] = useOptimistic(
    initialOrders,
    (state, updatedOrder) => {
      return state.map((o) =>
        o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
      )
    }
  )

  // Interaction State
  const [editingOrder, setEditingOrder] = useState(null)
  const [detailsOrder, setDetailsOrder] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 5000)
    return () => clearInterval(interval)
  }, [router])

  const handleStatusUpdate = async (orderId, newStatus, assignedTo) => {
    startTransition(() => {
      addOptimisticOrder({ id: orderId, status: newStatus, assignedTo })
    })

    if (editingOrder?.id === orderId) {
      setEditingOrder(null)
    }

    if (updateStatusAction) {
      await updateStatusAction(orderId, newStatus, assignedTo)
    }
  }

  const prepOrders = optimisticOrders
    .filter((o) => o.status === 'MONITOR')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const ovenOrders = optimisticOrders
    .filter((o) => o.status === 'OVEN')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const renderCard = (order, color) => (
    <div
      key={order.id}
      onClick={() => setEditingOrder(order)}
      onDoubleClick={(e) => {
        e.stopPropagation()
        setEditingOrder(null)
        setDetailsOrder(order)
      }}
      className={`cursor-pointer rounded-lg border-l-4 p-4 shadow-sm transition-all hover:translate-x-1 ${
        color === 'green'
          ? 'border-green-500 bg-green-50'
          : 'border-orange-500 bg-orange-50'
      }`}
    >
      <div className="flex justify-between">
        <h3 className="font-bold text-gray-900">
          {order.customerSnapshot?.name}
        </h3>
        <span className="text-xs font-bold text-gray-500">{order.status}</span>
      </div>

      {/* Expanded Details: Items & Instructions */}
      <div className="mt-3 border-t border-gray-200 pt-2">
        {order.specialInstructions && (
          <div className="mb-2 rounded bg-yellow-100 p-2 text-sm font-bold text-red-600">
            NOTE: {order.specialInstructions}
          </div>
        )}
        <ul className="space-y-1 text-sm text-gray-800">
          {order.items?.map((item, idx) => (
            <li
              key={idx}
              className="border-b border-gray-100 pb-1 last:border-0"
            >
              <div className="font-bold">
                {item.quantity}x {item.name}{' '}
                <span className="text-xs font-normal text-gray-500">
                  ({item.size})
                </span>
              </div>
              {item.toppings && item.toppings.length > 0 && (
                <div className="pl-4 text-xs text-gray-600">
                  + {item.toppings.join(', ')}
                </div>
              )}
              {item.notes && (
                <div className="pl-4 text-xs text-gray-500 italic">
                  "{item.notes}"
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 text-right text-sm font-bold text-gray-900">
        Total: ${order.totalPrice.toFixed(2)}
      </div>

      {order.assignedTo && (
        <div className="mt-2 text-xs font-medium text-indigo-600">
          👨‍🍳 {order.assignedTo}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <header className="mb-8 flex items-center justify-between border-b border-slate-700 pb-6">
        <h1 className="text-4xl font-black tracking-tight text-white">
          🔪 MONITOR: PREP STATION
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* PREP */}
        <div className="rounded-xl bg-slate-800 p-4">
          <h2 className="mb-4 text-2xl font-bold text-green-400">
            PREP ({prepOrders.length})
          </h2>
          <div className="space-y-4">
            {prepOrders.map((o) => renderCard(o, 'green'))}
          </div>
        </div>

        {/* OVEN */}
        <div className="rounded-xl bg-slate-800 p-4">
          <h2 className="mb-4 text-2xl font-bold text-orange-400">
            OVEN ({ovenOrders.length})
          </h2>
          <div className="space-y-4">
            {ovenOrders.map((o) => renderCard(o, 'orange'))}
          </div>
        </div>
      </div>

      <OrderEditModal
        isOpen={!!editingOrder}
        order={editingOrder}
        viewContext="KITCHEN"
        onStatusUpdate={handleStatusUpdate}
        onClose={() => setEditingOrder(null)}
      />

      <OrderDetailsModal
        isOpen={!!detailsOrder}
        order={detailsOrder}
        onClose={() => setDetailsOrder(null)}
      />
    </div>
  )
}
