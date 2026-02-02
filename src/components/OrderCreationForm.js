'use client'

import { useState } from 'react'
import { createOrderAction } from '../app/actions'

const MENU_ITEMS = [
  { name: 'Margherita', price: 10 },
  { name: 'Pepperoni', price: 12 },
  { name: 'Veggie', price: 11 },
]

export default function OrderCreationForm() {
  const [items, setItems] = useState([])
  const [lastResult, setLastResult] = useState(null)

  const addItem = (item) => {
    setItems([...items, { ...item, id: Date.now() }])
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

  async function handleSubmit(formData) {
    formData.append('items', JSON.stringify(items))
    formData.append('totalPrice', totalPrice.toString())

    const result = await createOrderAction(null, formData)
    setLastResult(result)

    if (result.success) {
      setItems([])
    }
  }

  return (
    <div className="mb-8 rounded border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">New Order</h2>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            name="customerName"
            type="text"
            required
            className="mt-1 block w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            name="customerPhone"
            type="text"
            required
            placeholder="555-0199"
            className="mt-1 block w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Items ({items.length}) - Total: ${totalPrice}
          </label>
          <div className="flex gap-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => addItem(item)}
                className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
              >
                + {item.name} (${item.price})
              </button>
            ))}
          </div>
          <ul className="mt-2 text-sm text-gray-600">
            {items.map((item, idx) => (
              <li key={idx}>• {item.name}</li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Order
        </button>
      </form>

      {lastResult && (
        <div
          className={`mt-4 rounded p-3 ${lastResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
        >
          <p className="font-bold">{lastResult.message}</p>
          {lastResult.warnings && lastResult.warnings.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-yellow-800">
                ⚠️ Advisory Warnings:
              </p>
              <ul className="list-disc pl-5 text-sm text-yellow-700">
                {lastResult.warnings.map((w, i) => (
                  <li key={i}>{w.reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
