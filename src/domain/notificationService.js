import crypto from 'crypto'

// Mock SMS Provider (internal helper)
async function sendSms(phone, message) {
  console.log(`[SMS → ${phone}]: ${message}`)
}

export async function notifyCustomer(order, type) {
  if (!order?.customerSnapshot?.phone) return null

  let message = ''

  if (type === 'READY') {
    message = `Your order ${order.id.slice(0, 6)} is ready for pickup!`
  }

  if (!message) return null

  await sendSms(order.customerSnapshot.phone, message)

  return {
    id: crypto.randomUUID(),
    orderId: order.id,
    channel: 'SMS',
    message,
    sentAt: new Date().toISOString(),
  }
}
