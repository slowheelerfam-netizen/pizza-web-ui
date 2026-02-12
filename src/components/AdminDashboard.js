'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OrderEditModal from './OrderEditModal'
import OrderDetailsModal from './OrderDetailsModal'
import { ORDER_STATUS } from '../types/models'

/**
 * CONTRACT (LOCKED)
 * -----------------
 * Status flow: NEW → MONITOR → OVEN → READY
 * - No PREP
 * - No IN_PREP
 * - ADMIN may advance status
 * - REGISTER is read-only
 */

export default function AdminDashboard({
  orders: initialOrders,
  employees = [],
  viewContext = 'ADMIN', // ADMIN | REGISTER
}) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)

  const [editingOrder, setEditingOrder] = useState(null)
  const [detailsOrder, setDetailsOrder] = useState(null)

  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  // ADMIN only: polling refresh
  useEffect(() => {
    if (viewContext === 'REGISTER') return

    const interval = setInterval(() => {
      router.refresh()
    }, 2000)

    return () => clearInterval(interval)
  }, [router, viewContext])

  const handleStatusUpdateAdapter = async (
    orderId,
    newStatus,
    assignedTo
  ) => {
    if (viewContext === 'REGISTER') return

    await fetch('/api/admin/override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        status: newStatus,
        reason: 'Standard Progression',
        comment: 'Admin Action',
        assignedTo,
        explicitOverride: true,
      }),
    })

    router.refresh()
  }

  /** ADMIN VIEW COLUMNS (CANONICAL) */
  const monitorOrders = orders
    .filter((o) => o.status === ORDER_STATUS.MONITOR)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const ovenOrders = orders
    .filter((o) => o.status === ORDER_STATUS.OVEN)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const readyOrders = orders
    .filter((o) => o.status === ORDER_STATUS.READY)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const getCustomerName = (order) => {
    return (
      order.customerName ||
      order.customerSnapshot?.name ||
      'Walk-in'
    )
  }

  const renderOrderCard = (order) => {
    let statusColor = 'bg-indigo-500 text-white'
    let statusLabel = 'MONITOR'

    if (order.status === ORDER_STATUS.OVEN) {
      statusColor = 'bg-orange-500 text-white'
      statusLabel = 'OVEN'
    }

    if (order.status === ORDER_STATUS.READY) {
      statusColor = 'bg-green-500 text-white'
      statusLabel = 'READY'
    }

    return (
      <div
        key={order.id}
        onClick={() => {
          if (viewContext === 'REGISTER') {
            setDetailsOrder(order)
          } else {
            setEditingOrder(order)
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation()
          setEditingOrder(null)
          setDetailsOrder(order)
        }}
        className="mb-2 cursor-pointer rounded-xl border border-white/10 bg-gray-800/40 p-3 shadow-lg backdrop-blur-md transition-all hover:bg-gray-800/60"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-lg font-bold text-white">
            {getCustomerName(order)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-300">
          <span>#{order.displayId}</span>
          <span>${order.totalPrice?.toFixed(2) || '0.00'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col space-y-4">
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        <Column title="📺 Monitor" count={monitorOrders.length}>
          {monitorOrders.map(renderOrderCard)}
        </Column>

        <Column title="🔥 Oven" count={ovenOrders.length}>
          {ovenOrders.map(renderOrderCard)}
        </Column>

        <Column title="✅ Ready" count={readyOrders.length}>
          {readyOrders.map(renderOrderCard)}
        </Column>
      </div>

      {viewContext !== 'REGISTER' && (
        <OrderEditModal
          isOpen={!!editingOrder}
          order={editingOrder}
          viewContext={viewContext}
          employees={employees}
          onStatusUpdate={handleStatusUpdateAdapter}
          onClose={() => setEditingOrder(null)}
        />
      )}

      <OrderDetailsModal
        isOpen={!!detailsOrder}
        order={detailsOrder}
        onClose={() => setDetailsOrder(null)}
      />
    </div>
  )
}

function Column({ title, count, children }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 p-3">
        <h3 className="flex items-center gap-2 font-bold text-white">
          <span>{title}</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
            {count}
          </span>
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
    </div>
  )
}




