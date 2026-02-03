'use client'

import { useState } from 'react'
import { ORDER_STATUS } from '../types/models'
import { OVERRIDE_REASONS } from '../types/adminOverrideReasons'
import OrderEditModal from './OrderEditModal'
import React from 'react'

export default function AdminDashboard({ orders }) {
  const [loading, setLoading] = useState(null)
  const [overrideOrder, setOverrideOrder] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  async function handleOverride(orderId, status, reason, comment) {
    setLoading(orderId)
    await fetch('/api/admin/override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        newStatus: status,
        reason,
        comment,
      }),
    })
    setLoading(null)
    setOverrideOrder(null)
    setReason('')
    setComment('')
  }

  return (
    <div className="space-y-6">
      {/* ===== Edit Order Modal ===== */}
      <OrderEditModal
        order={editingOrder}
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
      />

      {/* ===== Delete / Override Modal ===== */}
      {overrideOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-red-600">
              Delete Order #{overrideOrder.id.slice(0, 8)}
            </h3>
            <p className="mb-6 text-sm font-medium text-gray-900">
              Are you sure you want to delete this order? This action cannot be
              undone. The order status will be set to{' '}
              <strong className="text-red-600">CANCELLED</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-900">
                  Reason for Deletion
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 p-2.5 font-medium text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select reason</option>
                  {Object.values(OVERRIDE_REASONS).map((r) => (
                    <option key={r} value={r}>
                      {r.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-900">
                  Comment {reason === 'OTHER' && '(required)'}
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 p-2.5 font-medium text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add details..."
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
                disabled={
                  !reason ||
                  (reason === 'OTHER' && !comment) ||
                  loading === overrideOrder.id
                }
                onClick={() =>
                  handleOverride(
                    overrideOrder.id,
                    ORDER_STATUS.CANCELLED,
                    reason,
                    comment
                  )
                }
              >
                {loading === overrideOrder.id
                  ? 'Deleting...'
                  : 'Confirm Delete'}
              </button>

              <button
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setOverrideOrder(null)
                  setReason('')
                  setComment('')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Orders Table ===== */}
      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
        <div className="border-b border-indigo-100 bg-indigo-50/50 px-6 py-4">
          <h2 className="text-lg font-bold text-indigo-900">
            Active Orders Queue
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  ID / Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-8 w-8 text-gray-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                        />
                      </svg>
                      <span className="font-medium">No active orders</span>
                      <span className="text-xs">
                        New orders will appear here
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr
                      className="group cursor-pointer hover:bg-gray-50/50"
                      onClick={() => toggleExpand(order.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {order.customerSnapshot?.name ?? 'Walk-in customer'}
                        </div>
                        <div className="font-mono text-xs text-gray-400">
                          #{order.id.slice(0, 8)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === ORDER_STATUS.NEW
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === ORDER_STATUS.CONFIRMED
                                ? 'bg-purple-100 text-purple-800'
                                : order.status === ORDER_STATUS.IN_PREP
                                  ? 'bg-orange-100 text-orange-800'
                                  : order.status === ORDER_STATUS.READY
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        ${order.totalPrice}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingOrder(order)
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="text-sm font-medium text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOverrideOrder(order)
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-indigo-50/30">
                        <td colSpan="4" className="px-6 py-4">
                          <div className="rounded-lg border border-indigo-100 bg-white p-4 shadow-sm">
                            <div className="mb-4 grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                  Customer Details
                                </h4>
                                <p className="text-sm font-medium text-gray-900">
                                  {order.customerSnapshot?.phone || 'No phone'}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                  Order Type
                                </h4>
                                <p className="text-sm font-medium text-gray-900">
                                  {order.customerSnapshot?.type === 'DELIVERY'
                                    ? '🚚 Delivery'
                                    : '🛍️ Pickup'}
                                </p>
                                {order.customerSnapshot?.type ===
                                  'DELIVERY' && (
                                  <p className="text-sm text-gray-600">
                                    {order.customerSnapshot?.address}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                              <div className="mb-2 flex items-center justify-between">
                                <h4 className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                  Order Items
                                </h4>
                                <button
                                  className="rounded border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingOrder(order)
                                  }}
                                >
                                  Edit Order
                                </button>
                              </div>
                              <ul className="space-y-3">
                                {order.items?.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex flex-col gap-1 rounded-md bg-gray-50 p-2 text-sm"
                                  >
                                    <div className="flex items-center justify-between font-medium text-gray-900">
                                      <span>
                                        {item.name} ({item.size})
                                      </span>
                                      <span>${item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {item.crust} Crust •{' '}
                                      {item.toppings?.join(', ') ||
                                        'No toppings'}
                                    </div>
                                    {item.notes && (
                                      <div className="mt-1 inline-block rounded border border-amber-100 bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-600">
                                        Note: {item.notes}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
