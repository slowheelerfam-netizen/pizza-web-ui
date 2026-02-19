'use client'

import { useState, useEffect } from 'react'
import { PIZZA_SIZES, CRUST_TYPES, TOPPINGS } from '../types/models'

// This modal is for configuring a single pizza and adding it to the cart.
export default function PizzaBuilderModal({
  isOpen,
  onClose,
  onAddToCart, // Renamed from onPlaceOrder
  pizza, // The base pizza to configure
}) {
  // State for the CURRENT pizza being configured
  const [selectedSize, setSelectedSize] = useState(PIZZA_SIZES.MEDIUM)
  const [selectedCrust, setSelectedCrust] = useState(CRUST_TYPES.ORIGINAL)
  const [selectedToppings, setSelectedToppings] = useState(new Set())
  const [itemNotes, setItemNotes] = useState('')

  // When the modal opens or the pizza prop changes, reset the state
  useEffect(() => {
    if (isOpen && pizza) {
      setSelectedSize(PIZZA_SIZES.MEDIUM)
      setSelectedCrust(CRUST_TYPES.ORIGINAL)
      setSelectedToppings(new Set(pizza.defaultToppings))
      setItemNotes('')
    }
  }, [isOpen, pizza])

  const toggleTopping = (toppingId) => {
    const newToppings = new Set(selectedToppings)
    if (newToppings.has(toppingId)) {
      newToppings.delete(toppingId)
    } else {
      newToppings.add(toppingId)
    }
    setSelectedToppings(newToppings)
  }

  const calculatePrice = () => {
    if (!pizza) return 0
    let price = pizza.basePrice
    selectedToppings.forEach((toppingId) => {
      const topping = Object.values(TOPPINGS).find((t) => t.id === toppingId)
      if (topping && !pizza.defaultToppings.includes(toppingId)) {
        price += topping.price
      }
    })
    price += selectedCrust.price
    price *= selectedSize.priceMultiplier
    return parseFloat(price.toFixed(2))
  }

  const currentItemPrice = calculatePrice()

  // Calls the onAddToCart prop with the configured pizza
  const handleAddToCartClick = () => {
    const cartItem = {
      id: Date.now() + Math.random(), // Unique ID for the cart item
      name: pizza.name,
      size: selectedSize.label,
      crust: selectedCrust.label,
      toppings: Array.from(selectedToppings).map(
        (id) => Object.values(TOPPINGS).find((t) => t.id === id)?.label
      ),
      price: currentItemPrice,
      notes: itemNotes,
      details: `${selectedSize.label} | ${selectedCrust.label}`,
      quantity: 1,
    }
    if (onAddToCart) {
      onAddToCart(cartItem)
    }
    onClose() // Close modal after adding
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-full max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex-none border-b border-white/10 bg-slate-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Customize {pizza.name}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>

        {/* Pizza Configurator */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-6">
          <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-slate-400">
                  1. Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(PIZZA_SIZES).map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                        selectedSize.id === size.id
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-slate-400">
                  2. Crust
                </label>
                <div className="relative">
                  <select
                    value={selectedCrust.id}
                    onChange={(e) =>
                      setSelectedCrust(
                        Object.values(CRUST_TYPES).find(
                          (c) => c.id === e.target.value
                        )
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {Object.values(CRUST_TYPES).map((crust) => (
                      <option
                        key={crust.id}
                        value={crust.id}
                        className="bg-slate-900 text-white"
                      >
                        {crust.label}{' '}
                        {crust.price > 0 && `(+$${crust.price})`}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-4 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-slate-400">
                <span>3. Customize Toppings</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                  {selectedToppings.size} selected
                </span>
              </label>
              <p className="text-slate-400 text-xs mb-4">Designed pizzas all have unique spices</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.values(TOPPINGS).map((topping) => {
                  const isSelected = selectedToppings.has(topping.id)
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => toggleTopping(topping.id)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all ${
                        isSelected
                          ? 'border-indigo-500/50 bg-indigo-600/20 text-indigo-300'
                          : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                      }`}
                    >
                      <span>{topping.label}</span>
                      {isSelected && (
                        <svg
                          className="h-4 w-4 text-indigo-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-slate-400">
                4. Special Instructions
              </label>
              <textarea
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="e.g. Extra crispy, no onions, ranch dressing on side..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer with Add to Cart button */}
        <div className="flex-none border-t border-white/10 bg-slate-900/40 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500">Item Price</p>
              <p className="text-2xl font-black text-white">
                ${currentItemPrice.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleAddToCartClick}
              className="rounded-xl bg-green-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:bg-green-500 active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
