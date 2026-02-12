import { NextResponse } from 'next/server'
import { createServerServices } from '@/server'

export const runtime = 'nodejs'

export async function POST(req) {
  let payload

  try {
    payload = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const {
    orderId,
    status,
    reason,
    comment,
    assignedTo,
    explicitOverride,
  } = payload

  if (explicitOverride !== true) {
    return NextResponse.json(
      {
        success: false,
        message: 'Admin override requires explicitOverride=true',
      },
      { status: 400 }
    )
  }

  if (!orderId || !status) {
    return NextResponse.json(
      { success: false, message: 'Missing orderId or status' },
      { status: 400 }
    )
  }

  const { orderService } = createServerServices()

  try {
    // Single atomic transition + audit log
    const result = await orderService.adminOverrideStatus(
      'admin-api',
      orderId,
      status,
      reason || 'Manual override',
      comment || null
    )

    // Assignment is a mutation, apply once after status is valid
    if (assignedTo) {
      await orderService.updateOrderDetails(orderId, { assignedTo })
    }

    return NextResponse.json({ success: true, order: result.order })
  } catch (error) {
    console.error('[ADMIN_OVERRIDE_FAILED]', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

