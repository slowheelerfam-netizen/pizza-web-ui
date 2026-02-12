'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ORDER_STATUS } from '../types/models'

/**
 * CONTRACT (LOCKED)
 * -----------------
 * Status flow: NEW → MONITOR → OVEN → READY
 * - PREP does NOT exist
 * - REGISTER can only advance NEW → MONITOR
 * - KITCHEN advances MONITOR → OVEN → READY
 */

export default function OrderEditModal({
  order,
  isOpen,
  onClose,
  viewContext = 'REGISTER',
  onStatusUpdate,
  onPriorityToggle,
  onPrint,
  employees = [],
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [assignment, setAssignment] = useState('')
  const [shouldPrint, setShouldPrint] = useState(false)
  const [isPriority, setIsPriority] = useState(false)
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false)

  useEffect(() => {
    if (!order || !isOpen) return
    setAssignment(order.assignedTo || '')
    setIsPriority(Boolean(order.isPriority))
  }, [order, isOpen])

  if (!isOpen || !order) return null

  const handleWorkflowAction = (nextStatus) => {
    if (!onStatusUpdate) return

    startTransition(async () => {
      if (shouldPrint && onPrint) onPrint(order)

      // IMPORTANT:
      // - REGISTER uses assignment
      // - KITCHEN must NOT pass assignment (was breaking MONITOR → OVEN)
      if (viewContext === 'REGISTER') {
        await onStatusUpdate(order.id, nextStatus, assignment || null)
      } else {
        await onStatusUpdate(order.id, nextStatus)
      }

      router.refresh()
      onClose()
    })
  }

  const renderWorkflowActions = () => {
    /** REGISTER */
    if (viewContext === 'REGISTER') {
      const available = employees.filter((e) => e.isOnDuty === true)

      return (
        <div className="space-y-6 rounded-xl bg-blue-50 p-4">
          <h3 className="text-sm font-bold uppercase text-blue-900">
            Register Actions
          </h3>

          <label className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm">
            <input
              type="checkbox"
              checked={isPriority}
              disabled={isUpdatingPriority}
              onChange={async (e) => {
                const v = e.target.checked
                setIsPriority(v)
                setIsUpdatingPriority(true)
                await onPriorityToggle?.(order.id, v)
                setIsUpdatingPriority(false)
                router.refresh()
              }}
            />
            <span className="text-lg font-black">High Priority</span>
          </label>

          <select
            value={assignment}
            onChange={(e) => setAssignment(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 p-2"
          >
            <option value="">Assign Staff (optional)</option>
            {available.map((e) => (
              <option key={e.id} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>

          {order.status === ORDER_STATUS.NEW && (
            <button
              onClick={() => handleWorkflowAction(ORDER_STATUS.MONITOR)}
              disabled={isPending}
              className="w-full rounded-lg bg-green-600 py-3 font-bold text-white disabled:opacity-50"
            >
              Send to KITCHEN
            </button>
          )}
        </div>
      )
    }

    /** KITCHEN */
    if (viewContext === 'KITCHEN') {
      return (
        <div className="space-y-4 rounded-xl bg-indigo-50 p-4">
          {order.status === ORDER_STATUS.MONITOR && (
            <button
              onClick={() => handleWorkflowAction(ORDER_STATUS.OVEN)}
              disabled={isPending}
              className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white disabled:opacity-50"
            >
              Move to OVEN
            </button>
          )}

          {order.status === ORDER_STATUS.OVEN && (
            <button
              onClick={() => handleWorkflowAction(ORDER_STATUS.READY)}
              disabled={isPending}
              className="w-full rounded-lg bg-green-600 py-3 font-bold text-white disabled:opacity-50"
            >
              Mark READY
            </button>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex justify-between border-b pb-4">
          <h2 className="text-2xl font-black">
            Order: {order.customerSnapshot?.name || 'Walk-in'}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2" />
          <div>{renderWorkflowActions()}</div>
        </div>
      </div>
    </div>
  )
}







