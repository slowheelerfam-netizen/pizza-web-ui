'use client'

import React, { useState, useOptimistic, startTransition } from 'react'
import { ORDER_STATUS } from '../types/models'
import OrderEditModal from './OrderEditModal'

/**
 * CONTRACT (LOCKED)
 * -----------------
 * Status flow: NEW → MONITOR → OVEN → READY
 *
 * KITCHEN VIEW:
 * - Responsible ONLY for: MONITOR → OVEN
 * - Does NOT operate on NEW or READY
 */

export default function ChefDisplay({
  orders = [],
  employees = [],
  updateStatusAction,
  viewContext = 'KITCHEN',
}) {
  const [editingOrder, setEditingOrder] = useState(null)

  // Optimistic UI for Orders
  const [optimisticOrders, addOptimisticOrder] = useOptimistic(
    orders,
    (state, updatedOrder) => {
      return state.map((o) =>
        o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
      )
    }
  )

  const monitorOrders = optimisticOrders
    .filter((o) => o.status === ORDER_STATUS.MONITOR)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const ovenOrders = optimisticOrders
    .filter((o) => o.status === ORDER_STATUS.OVEN)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const handleStatusUpdate = async (orderId, newStatus, assignedTo) => {
    startTransition(() => {
      addOptimisticOrder({ id: orderId, status: newStatus, assignedTo })
    })
    if (updateStatusAction) {
      await updateStatusAction(orderId, newStatus, assignedTo)
    }
  }

  const renderOrderCard = (order, colorClass) => (
    <div
      key={order.id}
      onClick={() => setEditingOrder(order)}
      className={`mb-3 cursor-pointer rounded-lg border p-3 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${colorClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="max-w-[150px] truncate text-lg font-bold text-white">
            {order.customerSnapshot?.name || 'Walk-in'}
          </span>
          {order.assignedTo && (
            <span className="text-xs font-medium text-yellow-300">
              👨‍🍳 {order.assignedTo}
            </span>
          )}
        </div>
        <span className="rounded bg-black/30 px-2 py-1 text-xs font-bold whitespace-nowrap text-white">
          {order.status}
        </span>
      </div>
      <div className="mt-2 text-xs text-white/80">
        {order.items?.length || 0} items • ${order.totalPrice || '0.00'}
      </div>
    </div>
  )

  return (
    <>
      <div className="grid h-[calc(100vh-140px)] grid-cols-1 gap-4 overflow-hidden md:grid-cols-2">
        {/* PREP (formerly MONITOR) */}
        <Column title="PREP" color="green" count={monitorOrders.length}>
          {monitorOrders.map((o) =>
            renderOrderCard(o, 'bg-green-600 border-green-400')
          )}
        </Column>

        {/* OVEN */}
        <Column title="OVEN" color="orange" count={ovenOrders.length}>
          {ovenOrders.map((o) =>
            renderOrderCard(o, 'bg-orange-600 border-orange-400')
          )}
        </Column>
      </div>

      <OrderEditModal
        isOpen={!!editingOrder}
        order={editingOrder}
        viewContext={viewContext}
        employees={employees}
        onStatusUpdate={handleStatusUpdate}
        onClose={() => setEditingOrder(null)}
      />
    </>
  )
}

function Column({ title, count, color, children }) {
  const colorMap = {
    green: 'text-green-400 bg-green-500/20 text-green-300',
    orange: 'text-orange-400 bg-orange-500/20 text-orange-300',
  }

  return (
    <div className="flex flex-col rounded-xl bg-gray-800/50 p-4 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-2">
        <h2 className={`text-xl font-black ${colorMap[color]?.split(' ')[0]}`}>
          {title}
        </h2>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${colorMap[color]}`}
        >
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto pr-1">
        {children}
        {count === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">No orders</p>
        )}
      </div>
    </div>
  )
}
