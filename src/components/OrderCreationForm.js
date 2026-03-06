'use client'

import { useState, useTransition } from 'react'
import { createOrderAction, checkCustomerWarningAction } from '../app/actions'
import { MENU_ITEMS } from '../types/models'
import PizzaBuilderModal from './PizzaBuilderModal'

export default function OrderCreationForm() {
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('(805)')
  const [isWalkIn, setIsWalkIn] = useState(false)
  const [orderType, setOrderType] = useState('PICKUP')
  const [address, setAddress] = useState('')
  const [assumeChefRole, setAssumeChefRole] = useState(false)
  const [isPriority, setIsPriority] = useState(false)

  const [warning, setWarning] = useState(null)
  const [overrideWarning, setOverrideWarning] = useState(false)

  // ── Validation popup state ───────────────────────────────────────────────
  const [emptyPizzaAlert, setEmptyPizzaAlert] = useState(false)         // 0 ingredients
  const [overloadedPizzas, setOverloadedPizzas] = useState([])          // 5+ toppings
  const [overloadConfirmPending, setOverloadConfirmPending] = useState(false)

  const [isPending, startTransition] = useTransition()

  const cartTotal = items.reduce((sum, item) => sum + item.price, 0)

  const handlePhoneBlur = async () => {
    if (!customerPhone) return
    const result = await checkCustomerWarningAction(customerPhone)
    setWarning(result?.hasWarning ? result.warning : null)
    setOverrideWarning(false)
  }

  // ── Validation logic ─────────────────────────────────────────────────────
  const validateItems = () => {
    // Check for any pizza with 0 ingredients/toppings
    const hasEmpty = items.some((item) => {
      const toppings = item.toppings || []
      const menuItem = MENU_ITEMS.find((m) => m.name === item.name)
      const baseIngredients = menuItem?.ingredients || []
      return toppings.length === 0 && baseIngredients.length === 0
    })

    if (hasEmpty) {
      setEmptyPizzaAlert(true)
      return false
    }

    // Check for pizzas with 5+ toppings
    const overloaded = items.filter((item) => (item.toppings || []).length >= 5)
    if (overloaded.length > 0) {
      setOverloadedPizzas(overloaded)
      setOverloadConfirmPending(true)
      return false
    }

    return true
  }

  const submitOrder = () => {
    const formData = new FormData()
    formData.append('customerName', customerName)
    formData.append('customerPhone', customerPhone)
    formData.append('type', orderType)
    formData.append('address', address)
    formData.append('isWalkIn', String(isWalkIn))
    formData.append('assumeChefRole', String(assumeChefRole))
    formData.append('isPriority', String(isPriority))
    formData.append('items', JSON.stringify(items))
    formData.append('totalPrice', String(cartTotal))

    startTransition(async () => {
      const result = await createOrderAction(null, formData)
      console.log('[ORDER CREATE RESULT]', result)

      if (result?.success) {
        setItems([])
        setCustomerName('')
        setCustomerPhone('(805)')
        setAddress('')
        setOrderType('PICKUP')
        setIsWalkIn(false)
        setAssumeChefRole(false)
        setIsPriority(false)
      }
    })
  }

  const handleSubmit = () => {
    const valid = validateItems()
    if (valid) submitOrder()
  }

  return (
    <>
      <div className="relative z-10 rounded-3xl bg-white p-4 shadow-lg space-y-3">
        <input
          type="text"
          className="w-full rounded-xl border p-2"
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          type="text"
          className="w-full rounded-xl border p-2"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          onBlur={handlePhoneBlur}
        />

        <button
          type="button"
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
          onClick={() => setIsModalOpen(true)}
        >
          Add Items
        </button>

        {items.length > 0 && (
          <button
            type="button"
            className="w-full rounded-xl bg-indigo-600 p-3 text-white"
            disabled={isPending}
            onClick={handleSubmit}
          >
            Place Order (${cartTotal.toFixed(2)})
          </button>
        )}
      </div>

      {/* ── Modal: Empty pizza warning (hard block) ── */}
      {emptyPizzaAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center space-y-4">
            <div className="text-5xl">🚫</div>
            <h2 className="text-2xl font-black text-red-600">Empty Pizza!</h2>
            <p className="text-gray-600 font-medium">
              One or more pizzas have <span className="font-black text-red-500">no ingredients</span>.
              Please go back and add toppings before placing this order.
            </p>
            <button
              className="w-full rounded-xl bg-red-500 py-3 text-white font-black"
              onClick={() => setEmptyPizzaAlert(false)}
            >
              Go Back & Fix It
            </button>
          </div>
        </div>
      )}

      {/* ── Modal: Too many toppings disclaimer (can override) ── */}
      {overloadConfirmPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-2xl font-black text-orange-500">Too Many Toppings!</h2>
            <p className="text-gray-600 font-medium">
              {overloadedPizzas.length === 1
                ? 'A pizza in this order'
                : `${overloadedPizzas.length} pizzas in this order`}{' '}
              {overloadedPizzas.length === 1 ? 'has' : 'have'}{' '}
              <span className="font-black text-orange-500">5 or more toppings</span>.
              Overloaded pizzas may not cook evenly and could come out undercooked.
            </p>
            <ul className="text-left text-sm text-gray-500 font-semibold space-y-1">
              {overloadedPizzas.map((p, i) => (
                <li key={i}>
                  • {p.name} ({(p.toppings || []).length} toppings:{' '}
                  {(p.toppings || []).join(', ')})
                </li>
              ))}
            </ul>
            <div className="flex gap-3 pt-2">
              <button
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-black text-gray-700"
                onClick={() => {
                  setOverloadConfirmPending(false)
                  setOverloadedPizzas([])
                }}
              >
                Go Back
              </button>
              <button
                className="flex-1 rounded-xl bg-orange-500 py-3 font-black text-white"
                onClick={() => {
                  setOverloadConfirmPending(false)
                  setOverloadedPizzas([])
                  submitOrder()
                }}
              >
                Place Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <PizzaBuilderModal
          isOpen
          onClose={() => setIsModalOpen(false)}
          onAdd={(item) => {
            setItems((prev) => [...prev, item])
            setIsModalOpen(false)
          }}
          initialPizza={MENU_ITEMS[0]}
        />
      )}
    </>
  )
}