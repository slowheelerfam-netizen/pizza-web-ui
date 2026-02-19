'use client'

import { useState, useEffect, useOptimistic, startTransition } from 'react'
import { MENU_ITEMS } from '../types/models'
import PizzaBuilderModal from './PizzaBuilderModal'
import OrderDetailModal from './OrderDetailModal' // Import the new modal

export default function PublicOrderInterface({
  initialOrders = [],
  employees = [],
  updateStatusAction,
  createOrderAction, // Passed from server component
  markOrderAsPaidAction,
  isRegisterView = false, // Add a prop to identify the Register page view
}) {
  const [cart, setCart] = useState([])
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [selectedPizzaForBuilder, setSelectedPizzaForBuilder] = useState(
    MENU_ITEMS[0]
  )

  // State for the new Order Detail Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Optimistic UI for Orders
  const [optimisticOrders, addOptimisticOrder] = useOptimistic(
    initialOrders,
    (state, newOrUpdatedOrder) => {
      const isExistingOrder = state.some(
        (order) => order.id === newOrUpdatedOrder.id
      )

      if (isExistingOrder) {
        // This is an UPDATE (status, isPaid, etc.) or a CANCELLATION
        if (newOrUpdatedOrder.status === 'CANCELLED') {
          return state.filter((order) => order.id !== newOrUpdatedOrder.id)
        }
        return state.map((order) =>
          order.id === newOrUpdatedOrder.id
            ? { ...order, ...newOrUpdatedOrder }
            : order
        )
      } else {
        // This is a NEW order being added
        return [newOrUpdatedOrder, ...state]
      }
    }
  )

  // Checkout State
  const [isCheckoutMode, setIsCheckoutMode] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('PREPAID')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState(null)

  // Auto-refresh logic could be added here or rely on Next.js router refresh
  // For now, we rely on initialOrders prop updates (from parent re-renders)

  // Filter Orders for Dashboard (Use optimisticOrders instead of initialOrders)
  // Split Column 1 into NEW and PREP for better visual feedback
  const newOrders = optimisticOrders
    .filter((o) => o.status === 'NEW')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const activePrepOrders = optimisticOrders
    .filter((o) => o.status === 'PREP')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const ovenOrders = optimisticOrders
    .filter((o) => o.status === 'OVEN')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const readyOrders = optimisticOrders
    .filter((o) => o.status === 'READY')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  // Helper to render cards
  const renderOrderCard = (order, columnType) => {
    const isNew = order.status === 'NEW'
    return (
      <div
        key={order.id}
        className={`mb-3 rounded-lg border bg-white p-3 shadow-sm transition-all ${
          isNew ? 'border-l-4 border-l-blue-500' : ''
        } ${
          isRegisterView
            ? 'cursor-pointer'
            : ''
        }`}
        onDoubleClick={() => isRegisterView && handleCardClick(order)}
      >
        <div className="flex items-start justify-between">
          <div className="">
            <div className="text-lg font-bold text-gray-900">
              {order.customerSnapshot?.name || 'Guest'}
            </div>
            <div className="text-sm font-black text-gray-800">
              {order.customerSnapshot?.phone || 'No Phone'}
            </div>
            <div className="text-xs text-gray-500">
                #{order.displayId} • ${order.totalPrice.toFixed(2)}
              </div>
            {isNew && (
              <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                NEW
              </span>
            )}
            {order.assignedTo && (
              <div className="mt-1 text-xs font-medium text-indigo-600">
                👨‍🍳 {order.assignedTo}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="mb-1 block text-xs font-bold text-gray-400">
              {order.customerSnapshot?.type}
            </span>
            {/* Action Button based on column */}
            {(columnType === 'PREP' || columnType === 'NEW') && (
              <>
                {order.status === 'NEW' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusChange(order.id, 'PREP')
                    }}
                    className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200"
                  >
                    Start Prep
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusChange(order.id, 'OVEN')
                    }}
                    className="rounded bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700 hover:bg-orange-200"
                  >
                    Send to OVEN
                  </button>
                )}
              </>
            )}
            {columnType === 'OVEN' && (
              <button
                onClick={() => handleStatusChange(order.id, 'READY')}
                className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 hover:bg-green-200"
              >
                Start BOXING
              </button>
            )}
            {columnType === 'READY' && (
        <div className="flex flex-col items-end gap-2">
          {/* For any unpaid order in READY, show Collect Payment button */}
          {!order.isPaid && (
            <button
              onClick={() => handleMarkAsPaid(order.id)}
              className="w-full rounded bg-pink-600 px-2 py-1 text-xs font-bold text-white shadow-sm hover:bg-pink-700"
            >
              Collect Payment
            </button>
          )}

          {/* Complete Order button is disabled if payment is not made */}
          <button
            onClick={() => handleStatusChange(order.id, 'COMPLETED')}
            disabled={!order.isPaid}
            className="w-full rounded bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-60"
          >
            COMPLETE Order
          </button>
        </div>
      )}
    </div>
  </div>

  {/* Order Items Summary */}
  <div className="mt-2 border-t pt-2">
    {order.items.map((item, idx) => (
      <div key={idx} className="text-xs text-gray-600">
        {item.quantity}x {item.name}
      </div>
    ))}
  </div>
</div>
)
}

const handleMarkAsPaid = async (orderId) => {
startTransition(() => {
  addOptimisticOrder({ id: orderId, isPaid: true })
})
if (markOrderAsPaidAction) {
  await markOrderAsPaidAction(orderId)
}
}

const handleStatusChange = async (orderId, newStatus) => {
startTransition(() => {
addOptimisticOrder({ id: orderId, status: newStatus })
})
if (updateStatusAction) {
await updateStatusAction(orderId, newStatus)
}
}

  const handleCardClick = (order) => {
    if (isRegisterView) {
      setSelectedOrder(order)
      setIsDetailModalOpen(true)
    }
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedOrder(null)
  }

  const handleCancelOrder = (orderId) => {
    if (!confirm('Are you sure you want to permanently cancel this order?'))
      return

    handleStatusChange(orderId, 'CANCELLED')
    handleCloseDetailModal()
  }



// Handle placing the order from the modal
  const handlePlaceOrder = (items) => {
    setCart(items)
    setIsBuilderOpen(false)
    setIsCheckoutMode(true)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Prepare data
    const customerSnapshot = {
      name: customerName,
      phone: customerPhone,
      type: 'PICKUP', // All orders from this modal are PICKUP
      address: address,
      isWalkIn: false,
    }

    let result = { success: false, message: 'Failed' }

    // CREATE NEW ORDER
    const formData = new FormData()
    formData.append('customerName', customerName)
    formData.append('customerPhone', customerPhone)
    formData.append('type', 'PICKUP') // Always PICKUP
    formData.append('address', address)
    formData.append('items', JSON.stringify(cart))
    formData.append('totalPrice', cartTotal.toString())
    formData.append('specialInstructions', specialInstructions)
    formData.append('paymentMethod', paymentMethod)

    if (createOrderAction) {
      result = await createOrderAction(null, formData)
    } else {
      console.warn('No createOrderAction provided')
    }

    setOrderResult(result)
    setIsSubmitting(false)

    if (result.success && result.order) {
      // Add the newly created order to the optimistic state
      startTransition(() => {
        addOptimisticOrder(result.order)
      })

      // Now, reset the form and close the checkout modal
      setCart([])
      setCustomerName('')
      setCustomerPhone('')
      setAddress('')
      setPaymentMethod('PREPAID')
      setSpecialInstructions('')
      setIsCheckoutMode(false)
      // Close success message after 3s
      setTimeout(() => setOrderResult(null), 3000)
    }
  }

  // --- CHECKOUT MODAL ---
  if (isCheckoutMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-indigo-600 px-6 py-4 text-white">
            <h2 className="text-xl font-bold">Checkout</h2>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="p-6">
            <div className="mb-4 space-y-3">
              {/* ... Inputs ... */}
              <div>
                <label className="mb-1 block text-sm font-extrabold text-black">
                  Customer Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-2 font-bold text-black shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-extrabold text-black">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-2 font-bold text-black shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(555) 555-5555"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-extrabold text-black">
                  Payment
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 font-bold text-black">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PREPAID"
                      checked={paymentMethod === 'PREPAID'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Pre-paid</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold text-black">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAY_AT_REGISTER"
                      checked={paymentMethod === 'PAY_AT_REGISTER'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Collect Payment</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-4">
              <h3 className="mb-2 font-black text-black">Order Summary</h3>
              <ul className="space-y-1 text-sm font-bold text-gray-800">
                {cart.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {item.quantity || 1}x {item.name}
                    </span>
                    <span>${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-gray-300 pt-2 text-lg font-black text-black">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutMode(false)}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Confirm Order'}
                </button>
              </div>
              {/* Cancel Order Button */}
              <button
                type="button"
                onClick={async () => {
                  // Cancel new order creation (Discard)
                  setCart([])
                  setCustomerName('')
                  setCustomerPhone('')
                  setAddress('')
                  setPaymentMethod('PREPAID')
                  setSpecialInstructions('')
                  setIsCheckoutMode(false)
                }}
                className="w-full rounded-lg border-2 border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
              >
                Discard Order
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // --- MAIN REGISTER DASHBOARD ---
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* Header */}
      <header className="z-10 flex items-center justify-between bg-white px-6 py-3 shadow-sm">
        <h1 className="text-xl font-black tracking-tight text-indigo-900">
          🍕 Don&apos;s Pizza{' '}
          <span className="font-medium text-slate-400">| Register</span>
        </h1>
      </header>

      {/* 3-Column Dashboard */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-3">
          {/* COL 1: PREP (Live Prep Queue) */}
          <div className="flex flex-col rounded-2xl bg-white shadow-xl">
            <div className="rounded-t-2xl border-b border-gray-100 bg-yellow-50 p-4">
              <h2 className="flex items-center justify-between text-lg font-bold text-yellow-900">
                <span>👨‍🍳 Prep</span>
                <span className="rounded-full bg-yellow-200 px-2 py-0.5 text-sm">
                  {newOrders.length + activePrepOrders.length}
                </span>
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
              {/* NEW / INCOMING SECTION */}
              {newOrders.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-black tracking-wider text-blue-600 uppercase">
                    Incoming ({newOrders.length})
                  </h3>
                  {newOrders.map((o) => renderOrderCard(o, 'NEW'))}
                  <div className="my-4 border-t border-dashed border-gray-300"></div>
                </div>
              )}

              {/* ACTIVE PREP SECTION */}
              {activePrepOrders.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-black tracking-wider text-indigo-600 uppercase">
                    In Prep ({activePrepOrders.length})
                  </h3>
                  {activePrepOrders.map((o) => renderOrderCard(o, 'PREP'))}
                </div>
              )}

              {newOrders.length === 0 && activePrepOrders.length === 0 && (
                <div className="py-10 text-center text-gray-400">
                  No orders in Prep
                </div>
              )}
            </div>
          </div>

          {/* COL 2: OVEN */}
          <div className="flex flex-col rounded-2xl bg-white shadow-xl">
            <div className="rounded-t-2xl border-b border-gray-100 bg-orange-50 p-4">
              <h2 className="flex items-center justify-between text-lg font-bold text-orange-900">
                <span>🔥 Oven</span>
                <span className="rounded-full bg-orange-200 px-2 py-0.5 text-sm">
                  {ovenOrders.length}
                </span>
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
              {ovenOrders.map((o) => renderOrderCard(o, 'OVEN'))}
              {ovenOrders.length === 0 && (
                <div className="py-10 text-center text-gray-400">
                  No orders in Oven
                </div>
              )}
            </div>
          </div>

          {/* COL 3: READY */}
          <div className="flex flex-col rounded-2xl bg-white shadow-xl">
            <div className="rounded-t-2xl border-b border-gray-100 bg-green-50 p-4">
              <h2 className="flex items-center justify-between text-lg font-bold text-green-900">
                <span>✅ Ready</span>
                <span className="rounded-full bg-green-200 px-2 py-0.5 text-sm">
                  {readyOrders.length}
                </span>
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
              {readyOrders.map((o) => renderOrderCard(o, 'READY'))}
              {readyOrders.length === 0 && (
                <div className="py-10 text-center text-gray-400">
                  No ready orders
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <footer className="flex items-center justify-center gap-4 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => {
            setIsBuilderOpen(true)
          }}
          className="rounded-lg bg-blue-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:bg-blue-700 active:scale-95"
        >
          Create New Order
        </button>
      </footer>

      {isBuilderOpen && (
        <PizzaBuilderModal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {isRegisterView && (
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          order={selectedOrder}
          onClose={handleCloseDetailModal}
          onCancelOrder={handleCancelOrder}
          isRegisterView={isRegisterView}
        />
      )}
    </div>
  )
}
