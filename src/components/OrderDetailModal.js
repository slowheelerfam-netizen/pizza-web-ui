'use client'

import { Fragment } from 'react'

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onCancelOrder,
  isRegisterView,
}) {
  if (!isOpen || !order) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-gray-100 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">
            Order #{order.displayId}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold text-gray-500">Customer</p>
              <p className="text-gray-900">
                {order.customerSnapshot?.name || 'Guest'}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-500">Phone</p>
              <p className="text-gray-900">
                {order.customerSnapshot?.phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-500">Status</p>
              <p className="font-mono text-lg font-bold text-indigo-600">
                {order.status}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-500">Payment</p>
              <p
                className={`font-mono text-lg font-bold ${
                  order.isPaid ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {order.isPaid ? (
                  'PAID'
                ) : (
                  <span className="text-red-600">UNPAID</span>
                )}{' '}
                <span className="text-xs text-gray-500">
                  (
                  {order.paymentMethod === 'PAY_AT_REGISTER'
                    ? 'Pay at Register'
                    : 'Pre-paid'}
                  )
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="mb-2 font-bold text-gray-500">Order Items</h3>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                >
                  <div>
                    <span className="font-bold text-gray-800">
                      {item.quantity}x {item.name}
                    </span>
                    {item.notes && (
                      <p className="text-xs text-gray-500">Notes: {item.notes}</p>
                    )}
                  </div>
                  <span className="font-mono font-bold text-gray-800">
                    ${item.price.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex justify-between border-t pt-4 text-xl font-bold">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>

          {isRegisterView && (
            <div className="mt-6 border-t pt-6">
              <button
                onClick={() => onCancelOrder(order.id)}
                className="w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white shadow-md hover:bg-red-700 disabled:opacity-50"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
