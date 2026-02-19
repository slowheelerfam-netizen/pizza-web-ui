'use client'

import { useState } from 'react'
import { MENU_ITEMS } from '../types/models'

export default function SimpleOrderForm({ createOrderAction, checkCustomerWarningAction }) {
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState(null)

  const handleAddToCart = (pizza) => {
    // For simplicity, we'll add the item with its base price.
    const cartItem = { ...pizza, price: pizza.basePrice, quantity: 1 }
    setCart([...cart, cartItem])
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Please add a pizza to your order first.')
      return
    }
    setIsSubmitting(true)

    if (checkCustomerWarningAction) {
      const warning = await checkCustomerWarningAction(customerPhone)
      if (warning && !confirm(warning)) {
        setIsSubmitting(false)
        return
      }
    }

    const formData = new FormData()
    formData.append('customerName', customerName)
    formData.append('customerPhone', customerPhone)
    formData.append('type', 'PICKUP')
    formData.append('items', JSON.stringify(cart))
    formData.append('totalPrice', cartTotal.toString())
    formData.append('paymentMethod', 'PREPAID')
    formData.append('source', 'WEB')

    let result = { success: false, message: 'Failed to create order.' }
    if (createOrderAction) {
      result = await createOrderAction(null, formData)
    }

    setOrderResult(result)
    setIsSubmitting(false)

    if (result.success) {
      setCart([]) // Clear cart on success
      setCustomerName('')
      setCustomerPhone('')
    }
  }

  if (orderResult && orderResult.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center">
        <div className="max-w-md rounded-lg bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm">
          <h2 className="text-3xl font-black text-green-600">Order Placed!</h2>
          <p className="mt-2 text-gray-700">Your order #{orderResult.order.displayId} has been successfully submitted.</p>
          <button
            onClick={() => setOrderResult(null)}
            className="mt-6 w-full rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gray-900 bg-cover bg-center p-8 text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1920&auto=format&fit=crop')",
      }}
    >
      <div className="mx-auto max-w-4xl rounded-lg bg-black/70 p-8 backdrop-blur-sm">
        <h1 className="mb-6 text-center text-4xl font-extrabold">Krusty Pizzeria</h1>
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {MENU_ITEMS.map((pizza) => (
              <div key={pizza.id} className="rounded-lg bg-gray-800/80 p-4 shadow-lg">
                <h3 className="text-xl font-bold">{pizza.name}</h3>
                <p className="text-sm text-gray-300">{pizza.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold">${pizza.basePrice.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(pizza)}
                    className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold">Your Order</h2>
              <ul className="mt-4 space-y-2">
                {cart.map((item, index) => (
                  <li key={index} className="flex justify-between rounded bg-gray-700/80 p-2">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-gray-500 pt-4 text-xl font-bold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4 rounded-lg bg-gray-800/80 p-6">
            <h2 className="text-2xl font-bold">Your Details</h2>
            <div>
              <label htmlFor="customerName" className="block text-sm font-bold text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700/80 p-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-bold text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700/80 p-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="rounded-lg bg-green-600 px-10 py-4 text-xl font-bold text-white shadow-lg hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
