
'use client'

import { useState } from 'react'
import { MENU_ITEMS } from '../types/models'
import PizzaBuilderModal from './PizzaBuilderModal'

export default function CustomerOrderForm({
  createOrderAction,
  checkCustomerWarningAction,
}) {
  const [cart, setCart] = useState([])
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [selectedPizzaForBuilder, setSelectedPizzaForBuilder] = useState(
    MENU_ITEMS[0]
  )

  // Form State
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('PREPAID')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState(null)

  const handleAddToCart = (item) => {
    setCart([...cart, item])
    setIsBuilderOpen(false)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.')
      return
    }
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('customerName', customerName)
    formData.append('customerPhone', customerPhone)
    formData.append('type', 'PICKUP') // All online orders are for pickup
    formData.append('address', address)
    formData.append('items', JSON.stringify(cart))
    formData.append('totalPrice', cartTotal.toString())
    formData.append('specialInstructions', specialInstructions)
    formData.append('paymentMethod', paymentMethod)
    formData.append('source', 'WEB') // Source is the web

    let result = { success: false, message: 'Failed to create order.' }
    if (createOrderAction) {
      result = await createOrderAction(null, formData)
    }

    setOrderResult(result)
    setIsSubmitting(false)

    if (result.success) {
      // Don't reset cart immediately, show it in the confirmation
    }
  }

  const startNewOrder = () => {
    setCart([])
    setCustomerName('')
    setCustomerPhone('')
    setAddress('')
    setPaymentMethod('PREPAID')
    setSpecialInstructions('')
    setOrderResult(null)
  }

  // If order is successfully placed, show confirmation
  if (orderResult && orderResult.success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl">
          <h2 className="text-3xl font-black text-green-600">Order Placed!</h2>
          <p className="mt-2 text-gray-600">
            Your order has been successfully submitted.
          </p>
          <p className="mt-4 text-lg font-bold text-black">
            Order ID: #{orderResult.order.displayId}
          </p>
          <div className="my-6 rounded-lg border border-gray-200 bg-gray-100 p-4 text-left">
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
          <button
            onClick={startNewOrder}
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  // Main order form
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {isBuilderOpen && (
        <PizzaBuilderModal
          pizza={selectedPizzaForBuilder}
          onClose={() => setIsBuilderOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      <header className="z-10 flex items-center justify-between bg-white px-6 py-3 shadow-sm">
        <h1 className="text-xl font-black tracking-tight text-indigo-900">
          🍕 Don&apos;s Pizza - Order Online
        </h1>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Side: Menu */}
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">Menu</h2>
              <div className="space-y-3">
                {MENU_ITEMS.map((pizza) => (
                  <div
                    key={pizza.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <h3 className="font-bold">{pizza.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${pizza.basePrice.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPizzaForBuilder(pizza)
                        setIsBuilderOpen(true)
                      }}
                      className="rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Cart & Checkout */}
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Your Order
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Cart */}
                <div className="mb-6 min-h-[100px] rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-2 font-black text-black">Cart</h3>
                  {cart.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                      Your cart is empty.
                    </p>
                  ) : (
                    <>
                      <ul className="space-y-2 text-sm font-bold text-gray-800">
                        {cart.map((item, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span>
                              {item.quantity || 1}x {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span>${item.price.toFixed(2)}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newCart = [...cart]
                                  newCart.splice(i, 1)
                                  setCart(newCart)
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                &times;
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex justify-between border-t border-gray-300 pt-3 text-lg font-black text-black">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Customer Details */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-extrabold text-black">
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-2 font-bold text-black shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name"
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
                  {/* Special Instructions */}
                  <div>
                    <label
                      htmlFor="specialInstructions"
                      className="mb-1 block text-sm font-extrabold text-black"
                    >
                      Special Instructions
                    </label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      rows="2"
                      className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-2 font-bold text-black shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500"
                      value={specialInstructions}
                      onChange={(e) =>
                        setSpecialInstructions(e.target.value)
                      }
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-lg font-bold text-white shadow-lg hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Placing Order...' : `Place Order: $${cartTotal.toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
