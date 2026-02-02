'use server'

import { revalidatePath } from 'next/cache'
import {
  orderService,
  getOrders,
  getWarnings,
  getActions,
} from '../lib/services'

// --- Query Actions (Reads) ---

export async function fetchDashboardData() {
  const [orders, warnings, actions] = await Promise.all([
    getOrders(),
    getWarnings(),
    getActions(),
  ])

  return {
    orders: orders.map((o) => ({ ...o })),
    warnings: warnings.map((w) => ({ ...w })),
    actions: actions.map((a) => ({ ...a })),
  }
}

export async function createOrderAction(prevState, formData) {
  try {
    const customerName = formData.get('customerName')
    const customerPhone = formData.get('customerPhone')
    const itemsJson = formData.get('items')
    const totalPrice = parseFloat(formData.get('totalPrice'))

    if (!customerName || !customerPhone || !itemsJson) {
      return { success: false, message: 'Missing required fields' }
    }

    const items = JSON.parse(itemsJson)

    const input = {
      customerName,
      customerPhone,
      source: 'CALL_IN', // ✅ explicit, no enum import
      items,
      totalPrice,
    }

    await orderService.createOrder(input)

    revalidatePath('/')
    return {
      success: true,
      message: 'Order created successfully',
    }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export async function updateStatusAction(orderId, newStatus) {
  try {
    await orderService.updateStatus(orderId, newStatus)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export async function adminOverrideAction(
  orderId,
  newStatus,
  comment,
  adminId = 'admin-user'
) {
  try {
    await orderService.adminOverrideStatus(adminId, orderId, newStatus, comment)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, message: error.message }
  }
}
