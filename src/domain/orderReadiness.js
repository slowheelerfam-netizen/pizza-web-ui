import { ORDER_STATUS } from '../types/models'
import crypto from 'crypto'

export async function handleOrderReadiness(order, customer, notificationRepo) {
  if (order.status !== ORDER_STATUS.READY) {
    return null
  }

  const phone = order.customerSnapshot?.phone

  if (!phone) {
    return null
  }

  try {
    // Simulate notification creation
    const notification = {
      id: crypto.randomUUID(),
      orderId: order.id,
      customerName: order.customerSnapshot.name,
      phone: phone,
      type: 'SMS',
      status: 'SENT',
      message: `Hello ${order.customerSnapshot.name}, your order is READY!`,
      sentAt: new Date().toISOString(),
    }

    if (notification && notificationRepo?.create) {
      await notificationRepo.create(notification)
    }

    return notification
  } catch (error) {
    console.error('Failed to initiate notification:', error)
    return null
  }
}
