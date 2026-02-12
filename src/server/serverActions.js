'use server'

import { createServerServices } from '@/server'
import { revalidatePath } from 'next/cache'

/* -------------------------------------------
   UPDATE STATUS
------------------------------------------- */
export async function updateStatusAction(orderId, status, assignedTo = null) {
  const { orderService } = createServerServices()

  const order = await orderService.updateStatus(
    orderId,
    status,
    assignedTo
  )

  revalidatePath('/')
  revalidatePath('/kitchen')

  return { success: true, order }
}
