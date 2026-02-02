'use client'

import { useState } from 'react'
import { updateStatusAction, adminOverrideAction } from '../app/actions'
import { ORDER_STATUS } from '../types/models'

export default function AdminDashboard({ orders, warnings, actions }) {
  const [loading, setLoading] = useState(null)

  async function handleAdvance(orderId, currentStatus) {
    let nextStatus = null
    switch (currentStatus) {
      case ORDER_STATUS.CREATED:
        nextStatus = ORDER_STATUS.CONFIRMED
        break
      case ORDER_STATUS.CONFIRMED:
        nextStatus = ORDER_STATUS.IN_PREP
        break
      case ORDER_STATUS.IN_PREP:
        nextStatus = ORDER_STATUS.READY
        break
      case ORDER_STATUS.READY:
        nextStatus = ORDER_STATUS.COMPLETED
        break
      default:
        return
    }

    setLoading(orderId)
    await updateStatusAction(orderId, nextStatus)
    setLoading(null)
  }

  async function handleOverride(orderId) {
    const newStatus = prompt(
      'Enter new status (CREATED, CONFIRMED, IN_PREP, READY, COMPLETED, CANCELLED):'
    )
    if (!newStatus) return

    const comment = prompt('Enter mandatory audit comment:')
    if (!comment) {
      alert('Comment is required for overrides!')
      return
    }

    setLoading(orderId)
    const result = await adminOverrideAction(orderId, newStatus, comment)
    setLoading(null)

    if (!result.success) {
      alert('Error: ' + result.message)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="md:col-span-2">
        <h2 className="mb-4 text-xl font-bold">Active Orders</h2>
        <div className="overflow-hidden rounded bg-white shadow">
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
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                          {order.customerSnapshot?.name ?? 'Walk-in customer'}
                      </div>
                      <div className="text-xs text-gray-400">
                          ID: {order.id.slice(0, 8)}…
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                          order.status === ORDER_STATUS.READY
                            ? 'bg-green-100 text-green-800'
                            : order.status === ORDER_STATUS.CANCELLED
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      ${order.totalPrice}
                    </td>
                    <td className="space-x-2 px-6 py-4 text-sm font-medium">
                      {order.status !== ORDER_STATUS.COMPLETED &&
                        order.status !== ORDER_STATUS.CANCELLED && (
                          <button
                            onClick={() =>
                              handleAdvance(order.id, order.status)
                            }
                            disabled={loading === order.id}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                          >
                            Advance
                          </button>
                        )}
                      <button
                        onClick={() => handleOverride(order.id)}
                        disabled={loading === order.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Override
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-bold">System Warnings</h3>
        <ul className="space-y-2 rounded bg-white p-4 text-sm shadow">
          {warnings.length === 0 && (
            <li className="text-gray-500">No active warnings</li>
          )}
          {warnings.map((w) => (
            <li key={w.id} className="border-l-4 border-yellow-400 pl-2">
              <span className="font-semibold">{w.reason}</span> <br />
              <span className="text-xs text-gray-500">
                Target: {JSON.stringify(w.customerIdentifier)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-bold">Audit Log (Recent)</h3>
        <ul className="max-h-64 space-y-2 overflow-y-auto rounded bg-white p-4 text-sm shadow">
          {actions.length === 0 && (
            <li className="text-gray-500">No actions recorded</li>
          )}
          {actions
            .slice()
            .reverse()
            .map((a) => (
              <li key={a.id} className="border-b pb-2 last:border-0">
                <span className="text-xs font-semibold text-gray-400">
                  {new Date(a.timestamp).toLocaleTimeString()}
                </span>{' '}
                <br />
                <span className="font-medium">{a.actionType}</span> by{' '}
                {a.adminId} <br />
                <span className="text-gray-600 italic">"{a.comment}"</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
