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

  const [isPending, startTransition] = useTransition()

  const cartTotal = items.reduce((sum, item) => sum + item.price, 0)

  const handlePhoneBlur = async () => {
    if (!customerPhone) return
    const result = await checkCustomerWarningAction(customerPhone)
    setWarning(result?.hasWarning ? result.warning : null)
    setOverrideWarning(false)
  }

  const handleSubmit = () => {
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



