'use client'

import { useState, useEffect, useOptimistic, startTransition } from 'react'
import { MENU_ITEMS } from '../types/models'
import PizzaBuilderModal from './PizzaBuilderModal'
import OrderDetailModal from './OrderDetailModal'
import KitchenWelcomeModal from './KitchenWelcomeModal'
import KitchenTooltip from './KitchenTooltip'

export default function PublicOrderInterface({
  initialOrders = [],
  employees = [],
  updateStatusAction,
  createOrderAction,
  markOrderAsPaidAction,
  isRegisterView = false,
  showKitchenModals = false,
}) {
  const [cart, setCart] = useState([])
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [selectedPizzaForBuilder, setSelectedPizzaForBuilder] = useState(MENU_ITEMS[0])
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const [optimisticOrders, addOptimisticOrder] = useOptimistic(
    initialOrders,
    (state, newOrUpdatedOrder) => {
      const isExistingOrder = state.some((order) => order.id === newOrUpdatedOrder.id)
      if (isExistingOrder) {
        if (newOrUpdatedOrder.status === 'CANCELLED') {
          return state.filter((order) => order.id !== newOrUpdatedOrder.id)
        }
        return state.map((order) =>
          order.id === newOrUpdatedOrder.id ? { ...order, ...newOrUpdatedOrder } : order
        )
      } else {
        return [newOrUpdatedOrder, ...state]
      }
    }
  )

  const [isCheckoutMode, setIsCheckoutMode] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [orderSource, setOrderSource] = useState('WALK-IN')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [paymentScreen, setPaymentScreen] = useState(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const activeOrders = optimisticOrders.filter(
    (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
  )

  const newOrders = activeOrders
    .filter((o) => o.status === 'NEW' && isRegisterView)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const activePrepOrders = activeOrders
    .filter((o) => o.status === 'PREP')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const ovenOrders = activeOrders
    .filter((o) => o.status === 'OVEN')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const readyOrders = activeOrders
    .filter((o) => o.status === 'READY')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const getElapsedTime = (createdAt) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMs = now - created
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    if (diffHours > 0) return `${diffHours}h ${mins}m`
    return `${diffMins}m`
  }

  const getElapsedColor = (createdAt) => {
    const diffMins = Math.floor((new Date() - new Date(createdAt)) / 60000)
    if (diffMins >= 20) return 'text-red-600 font-black'
    if (diffMins >= 10) return 'text-orange-500 font-bold'
    return 'text-green-600 font-bold'
  }

  const getSourceBadge = (source) => {
    switch (source) {
      case 'REGISTER': return 'bg-indigo-100 text-indigo-700'
      case 'ONLINE': return 'bg-blue-100 text-blue-700'
      case 'WALK-IN': return 'bg-green-100 text-green-700'
      case 'PHONE': return 'bg-yellow-100 text-yellow-700'
      case 'INTERNAL': return 'bg-gray-100 text-gray-700'
      default: return 'bg-indigo-100 text-indigo-700'
    }
  }

  const renderOrderCard = (order, columnType) => {
    const isNew = order.status === 'NEW'
    return (
      <div
        key={order.id}
        className={`mb-3 rounded-lg border bg-white p-3 shadow-sm transition-all ${
          isNew ? 'border-l-4 border-l-blue-500' : ''
        } ${isRegisterView ? 'cursor-pointer' : ''}`}
        onDoubleClick={() => isRegisterView && handleCardClick(order)}
      >
        <div className="flex items-start justify-between">
          <div className="">
            <div className="text-lg font-bold text-gray-900">
              {order.customerSnapshot?.name || 'Guest'}
            </div>
            {order.source && (
              <div className={`text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded inline-block ${getSourceBadge(order.source)}`}>
                {order.source}
              </div>
            )}
            <div className="text-sm font-black text-gray-800">
              {order.customerSnapshot?.phone || 'No Phone'}
            </div>
            <div className="text-xs text-gray-500">
              #{order.displayId} • ${order.totalPrice.toFixed(2)}
            </div>
            <div className={`text-xs mt-1 ${getElapsedColor(order.createdAt)}`}>
              ⏱ {getElapsedTime(order.createdAt)}
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

            {isRegisterView && (
              <div className="h-9">
                {order.isPaid ? (
                  <span className="mb-2 inline-block w-full rounded bg-green-100 px-2 py-1 text-center text-xs font-bold text-green-800">
                    PAID
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkAsPaid(order.id)}
                    disabled={order.status !== 'READY'}
                    className="mb-2 w-full rounded bg-pink-600 px-2 py-1 text-xs font-bold text-white shadow-sm hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50"
                  >
                    Collect Payment
                  </button>
                )}
              </div>
            )}

            {order.status === 'NEW' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStatusChange(order.id, 'PREP')
                }}
                className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200"
              >
                Start Prep
              </button>
            )}
            {order.status === 'PREP' && (
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
            {order.status === 'OVEN' && (
              <button
                onClick={() => handleStatusChange(order.id, 'READY')}
                className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 hover:bg-green-200"
              >
                Send to BOXING
              </button>
            )}
            {order.status === 'READY' && (
              <div className="flex flex-col items-end gap-2">
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
    if (!confirm('Are you sure you want to permanently cancel this order?')) return
    handleStatusChange(orderId, 'CANCELLED')
    handleCloseDetailModal()
  }

  const handlePlaceOrder = (items) => {
    setCart(items)
    setIsBuilderOpen(false)
    setIsCheckoutMode(true)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

const handleCheckoutSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    let result = { success: false, message: 'Failed' }

    const formData = new FormData()
    formData.append('customerName', customerName)
    formData.append('customerPhone', customerPhone)
    formData.append('type', 'PICKUP')
    formData.append('address', address)
    formData.append('items', JSON.stringify(cart))
    formData.append('totalPrice', cartTotal.toString())
    formData.append('specialInstructions', specialInstructions)
    formData.append('paymentMethod', paymentMethod)
    formData.append('source', orderSource)

    if (createOrderAction) {
      result = await createOrderAction(null, formData)
    } else {
      console.warn('No createOrderAction provided')
    }

    setOrderResult(result)
    setIsSubmitting(false)

    if (result.success && result.order) {
      startTransition(() => {
        addOptimisticOrder(result.order)
      })

      setPaymentScreen({
        method: paymentMethod,
        total: cartTotal,
        orderId: result.order.id,
      })
      setCart([])
      setCustomerName('')
      setCustomerPhone('')
      setAddress('')
      setPaymentMethod('CASH')
      setOrderSource('WALK-IN')
      setSpecialInstructions('')
      setIsCheckoutMode(false)
      setTimeout(() => setOrderResult(null), 3000)
    }
  }

// --- PAYMENT SCREEN ---
  if (paymentScreen) {
    const paymentDetails = {
      CASH: { icon: '💵', label: 'Collect Cash Payment', instruction: 'Count and collect cash from customer.' },
      CREDIT_CARD: { icon: '💳', label: 'Process Credit Card', instruction: 'Present card reader to customer.' },
      DEBIT_CARD: { icon: '💳', label: 'Process Debit Card', instruction: 'Present card reader to customer.' },
      APPLE_PAY: { icon: '📱', label: 'Apple Pay', instruction: 'Present reader for tap payment.' },
      GOOGLE_PAY: { icon: '📱', label: 'Google Pay', instruction: 'Present reader for tap payment.' },
    }
    const details = paymentDetails[paymentScreen.method] || paymentDetails.CASH

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
        <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="bg-indigo-600 px-6 py-5 text-center text-white">
            <div className="text-5xl mb-2">{details.icon}</div>
            <h2 className="text-xl font-bold">{details.label}</h2>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Amount Due</p>
            <p className="text-5xl font-black text-gray-900 mb-4">
              ${paymentScreen.total.toFixed(2)}
            </p>
            <p className="text-sm font-medium text-gray-500 mb-8">
              {details.instruction}
            </p>
            <button
              onClick={() => setPaymentScreen(null)}
              className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white shadow-lg hover:bg-green-500 active:scale-95 transition-all"
            >
              ✓ Payment Received
            </button>
          </div>
        </div>
      </div>
    )
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
                  Order Source
                </label>
                <select
                  value={orderSource}
                  onChange={(e) => setOrderSource(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-2 font-bold text-black shadow-sm focus:border-indigo-500 focus:bg-white"
                >
                  <option value="WALK-IN">Walk-In</option>
                  <option value="PHONE">Phone</option>
                  <option value="INTERNAL">Internal</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-extrabold text-black">
                  Payment
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-2 font-bold text-black shadow-sm focus:border-indigo-500 focus:bg-white"
                >
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="APPLE_PAY">Apple Pay</option>
                  <option value="GOOGLE_PAY">Google Pay</option>
                </select>
              </div>

            </div>

            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-4">
              <h3 className="mb-2 font-black text-black">Order Summary</h3>
              <ul className="space-y-1 text-sm font-bold text-gray-800">
                {cart.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.quantity || 1}x {item.name}</span>
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
              <button
                type="button"
                onClick={() => {
                  setCart([])
                  setCustomerName('')
                  setCustomerPhone('')
                  setAddress('')
                  setPaymentMethod('CASH')
                  setOrderSource('WALK-IN')
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
    <>
      {showKitchenModals && <KitchenWelcomeModal />}
      {showKitchenModals && <KitchenTooltip />}
      <div className="flex min-h-screen flex-col bg-slate-100">
        <header className="z-10 flex items-center justify-between bg-white px-6 py-3 shadow-sm">
          <h1 className="text-xl font-black tracking-tight text-indigo-900">
            🍕 Krusty&apos;s Pizza{' '}
            <span className="font-medium text-slate-400">
              {showKitchenModals ? '| Kitchen' : '| Register'}
            </span>
          </h1>
          {!showKitchenModals && (
            <nav className="flex items-center gap-4">
              <a href="/" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Home</a>
            </nav>
          )}
        </header>

        <div className="flex-1 overflow-hidden p-6">
          <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-3">

            {/* COL 1: PREP */}
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
                {newOrders.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-xs font-black tracking-wider text-blue-600 uppercase">
                      Incoming ({newOrders.length})
                    </h3>
                    {newOrders.map((o) => renderOrderCard(o, 'NEW'))}
                    <div className="my-4 border-t border-dashed border-gray-300"></div>
                  </div>
                )}
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

          <footer className="flex items-center justify-between gap-4 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3">
              <a href="/register" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Register</a>
              <a href="/kitchen" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Kitchen</a>
              <a href="/oven" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Oven</a>
              <a href="/monitor" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Monitor</a>
            </div>
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="rounded-lg bg-blue-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:bg-blue-700 active:scale-95"
            >
              Create New Order
            </button>
          </footer>

        {isBuilderOpen && (
          <PizzaBuilderModal
            isOpen={isBuilderOpen}
            onClose={() => setIsBuilderOpen(false)}
            onAddToCart={(item) => handlePlaceOrder([item])}
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
    </>
  )
}