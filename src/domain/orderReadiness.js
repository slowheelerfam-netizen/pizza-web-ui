import { ORDER_STATUS } from '../types/models'
import { notifyCustomer } from './notificationService'

export async function handleOrderReadiness(
  order,
  customer,
  notificationRepo
) {
  if (order.status !== ORDER_STATUS.READY) {
    return null
  }

  const phone = order.customerSnapshot?.phone

  if (!phone) {
    return null
  }

  try {
    const notification = await notifyCustomer(order, 'READY')

    if (notification && notificationRepo?.create) {
      await notificationRepo.create(notification)
    }

    return notification
  } catch (error) {
    console.error('Failed to initiate notification:', error)
    return null
  }
}
