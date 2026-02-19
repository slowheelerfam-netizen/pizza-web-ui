'use client'

import { useState, useEffect } from 'react'
import { MENU_ITEMS, PIZZA_SIZES, CRUST_TYPES, TOPPINGS } from '../types/models'

const generateId = () => Date.now() + Math.random()

// This modal is now a full "Create Order" modal
export default function PizzaBuilderModal({
  isOpen,
  onClose,
  onPlaceOrder, // This prop will receive the final list of items
}) {
  // State for the ENTIRE order being built
  const [items, setItems] = useState([])

  // State for the CURRENT pizza being configured
  const [selectedPizza, setSelectedPizza] = useState(MENU_ITEMS[0])
  const [selectedSize, setSelectedSize] = useState(PIZZA_SIZES.MEDIUM)
  const [selectedCrust, setSelectedCrust] = useState(CRUST_TYPES.ORIGINAL)
  const [selectedToppings, setSelectedToppings] = useState(
    new Set(MENU_ITEMS[0].defaultToppings)
  )
  const [itemNotes, setItemNotes] = useState('')

  // Reset the entire modal state when it opens
  useEffect(() => {
    if (isOpen) {
      setItems([])
      resetPizzaConfigurator()
    }
  }, [isOpen])

  const resetPizzaConfigurator = () => {
    const defaultPizza = MENU_ITEMS[0]
    setSelectedPizza(defaultPizza)
    setSelectedSize(PIZZA_SIZES.MEDIUM)
    setSelectedCrust(CRUST_TYPES.ORIGINAL)
    setSelectedToppings(new Set(defaultPizza.defaultToppings))
    setItemNotes('')
  }

  const handlePizzaChange = (pizza) => {
    setSelectedPizza(pizza)
    setSelectedToppings(new Set(pizza.defaultToppings))
  }

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
    let price = selectedPizza.basePrice
    selectedToppings.forEach((toppingId) => {
      const topping = Object.values(TOPPINGS).find((t) => t.id === toppingId)
      if (topping && !selectedPizza.defaultToppings.includes(toppingId)) {
        price += topping.price
      }
    })
    price += selectedCrust.price
    price *= selectedSize.priceMultiplier
    return parseFloat(price.toFixed(2))
  }

  const currentItemPrice = calculatePrice()
  const totalOrderPrice = items.reduce((sum, item) => sum + item.price, 0)

  // Adds the currently configured pizza to the order list
  const handleAddItemToOrder = () => {
    const newItem = {
      id: generateId(),
      name: selectedPizza.name,
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
    setItems([...items, newItem])
    resetPizzaConfigurator() // Reset for next pizza
  }

  const handleRemoveItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  // Finalizes the order and moves to checkout
  const handlePlaceOrderClick = () => {
    if (onPlaceOrder) {
      onPlaceOrder(items)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex-none border-b border-white/10 bg-slate-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Create New Order</h2>
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

        <div className="flex flex-1 overflow-hidden">
          {/* Left Side: Pizza Configurator */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-6">
            <div className="space-y-8">
              <div>
                <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-slate-400">
                  1. Select Base Pizza
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {MENU_ITEMS.map((pizza) => (
                    <button
                      key={pizza.id}
                      type="button"
                      onClick={() => handlePizzaChange(pizza)}
                      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border p-2 text-left transition-all ${
                        selectedPizza.id === pizza.id
                          ? 'border-indigo-500 bg-indigo-600/20 ring-1 ring-indigo-500'
                          : 'border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10'
                      }`}
                    >
                      <img
                        src={pizza.image}
                        alt={pizza.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className={`block truncate text-sm font-bold ${
                            selectedPizza.id === pizza.id
                              ? 'text-indigo-400'
                              : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {pizza.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          ${pizza.basePrice}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-wider text-slate-400">
                    2. Size
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
                    3. Crust
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
                  <span>4. Customize Toppings</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                    {selectedToppings.size} selected
                  </span>
                </label>
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
                  5. Special Instructions
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

          {/* Right Side: Order Summary */}
          <div className="flex w-96 flex-col border-l border-white/10 bg-black/20">
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-bold text-white">Current Order</h3>
              {items.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-slate-500">
                  <p>
                    Your order is empty. <br /> Configure a pizza on the left
                    and click "Add to Order".
                  </p>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between rounded-lg bg-white/5 p-3"
                    >
                      <div>
                        <p className="font-bold text-slate-200">{item.name}</p>
                        <p className="text-xs text-slate-400">
                          {item.details}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">
                          ${item.price.toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex-none border-t border-white/10 bg-slate-900/40 p-6 backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Item Price
                    </p>
                    <p className="text-2xl font-black text-white">
                      ${currentItemPrice.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleAddItemToOrder}
                    className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 active:scale-95"
                  >
                    + Add to Order
                  </button>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between font-bold text-white">
                    <span>Order Total</span>
                    <span>${totalOrderPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrderClick}
                    disabled={items.length === 0}
                    className="mt-4 w-full rounded-xl bg-green-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Place Order ({items.length} items)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
