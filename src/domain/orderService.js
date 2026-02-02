import { ORDER_STATUS } from '../types/models'
import { isValidTransition } from './orderState'
import { handleOrderReadiness } from './orderReadiness'
import { logAdminAction } from './adminActionService'
import crypto from 'crypto'

export class OrderService {
  constructor(
    ordersRepository,
    warningsRepository,
    adminActionRepository,
    notificationsRepository
  ) {
    this.orders = ordersRepository
    this.warnings = warningsRepository
    this.actions = adminActionRepository
    this.notifications = notificationsRepository
  }

  async createOrder(input) {
    console.log('[OrderService.createOrder] input:', input)

    const {
      customerName,
      customerPhone,
      source,
      items,
      totalPrice,
    } = input

    // Invariant: every order must persist a customer snapshot
    console.log('CREATE ORDER INPUT', customerName, customerPhone)

    const customerSnapshot = {
      customerId: null,
      name: customerName || 'Walk-in',
      phone: customerPhone || null,
      isWalkIn: !customerName,
    }

    const order = {
      id: crypto.randomUUID(),
      status: ORDER_STATUS.NEW,
      source,
      items,
      totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      estimatedReadyAt: null,
      actualReadyAt: null,
      completedAt: null,
      isNoContact: false,
      customerSnapshot,
    }

    await this.orders.create(order)
    return order
  }

  async updateStatus(orderId, newStatus, customer = null) {
    const order = await this.orders.findById(orderId)
    if (!order) {
      throw new Error(`Order ${orderId} not found`)
    }

    if (!isValidTransition(order.status, newStatus)) {
      throw new Error(
        `Invalid transition from ${order.status} to ${newStatus}`
      )
    }

    order.status = newStatus
    order.updatedAt = new Date().toISOString()

    if (newStatus === ORDER_STATUS.COMPLETED) {
      order.completedAt = new Date().toISOString()
    }

    await this.orders.update(order)

    if (newStatus === ORDER_STATUS.READY) {
      await handleOrderReadiness(order, customer, this.notifications)
    }

    return order
  }

  async adminOverrideStatus(
    adminId,
    orderId,
    newStatus,
    comment,
    customer = null
  ) {
    const updatedOrder = await this.updateStatus(
      orderId,
      newStatus,
      customer
    )

    const actionLog = logAdminAction(
      adminId,
      'ORDER',
      orderId,
      'STATUS_OVERRIDE',
      comment
    )

    await this.actions.create(actionLog)

    return {
      order: updatedOrder,
      actionLog,
    }
  }
}
