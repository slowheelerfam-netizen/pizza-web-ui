import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OrderService } from './orderService'
import { ORDER_STATUS } from '../types/models'

describe('OrderService', () => {
  let orderService
  let mockOrdersRepo
  let mockWarningsRepo
  let mockActionsRepo
  let mockNotificationsRepo

  beforeEach(() => {
    mockOrdersRepo = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      getAll: vi.fn().mockResolvedValue([]),
    }

    mockWarningsRepo = {}
    mockActionsRepo = { create: vi.fn() }
    mockNotificationsRepo = {}

    orderService = new OrderService(
      mockOrdersRepo,
      mockWarningsRepo,
      mockActionsRepo,
      mockNotificationsRepo
    )
  })

  it('should create an order successfully', async () => {
    const input = {
      customerName: 'John Doe',
      customerPhone: '555-0123',
      source: 'web',
      items: [{ id: 'p1', name: 'Pizza', quantity: 1 }],
      totalPrice: 20,
    }

    mockOrdersRepo.create.mockResolvedValue(true)

    const result = await orderService.createOrder(input)

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.status).toBe(ORDER_STATUS.NEW)
    expect(result.customerSnapshot.name).toBe('John Doe')
    expect(result.customerSnapshot.phone).toBe('555-0123')
    expect(result.items).toEqual(input.items)
    expect(result.totalPrice).toBe(20)

    expect(mockOrdersRepo.getAll).toHaveBeenCalledTimes(1)
    expect(mockOrdersRepo.create).toHaveBeenCalledWith(result)
  })

  it('should throw an error if repository fails', async () => {
    const input = {
      customerName: 'Jane Doe',
      totalPrice: 10,
    }

    const error = new Error('Database error')
    mockOrdersRepo.create.mockRejectedValue(error)

    await expect(orderService.createOrder(input)).rejects.toThrow(
      'Database error'
    )
  })

  it('should set ovenEnteredAt when status changes to OVEN', async () => {
    const orderId = 'test-order-id'
    const initialOrder = {
      id: orderId,
      status: ORDER_STATUS.MONITOR, // VALID transition → OVEN
      customerSnapshot: { name: 'Test' },
      items: [],
    }

    mockOrdersRepo.findById.mockResolvedValue({ ...initialOrder })
    mockOrdersRepo.update.mockResolvedValue(true)

    const updatedOrder = await orderService.updateStatus(
      orderId,
      ORDER_STATUS.OVEN
    )

    expect(updatedOrder.status).toBe(ORDER_STATUS.OVEN)
    expect(updatedOrder.ovenEnteredAt).toBeDefined()
  })

  it('should update assignedTo when provided', async () => {
    const orderId = 'test-assign-id'
    const initialOrder = {
      id: orderId,
      status: ORDER_STATUS.NEW,
      customerSnapshot: { name: 'Test' },
      items: [],
    }

    mockOrdersRepo.findById.mockResolvedValue({ ...initialOrder })
    mockOrdersRepo.update.mockResolvedValue(true)

    const updatedOrder = await orderService.updateStatus(
      orderId,
      ORDER_STATUS.IN_PREP,
      null,
      'Chef David'
    )

    expect(updatedOrder.status).toBe(ORDER_STATUS.IN_PREP)
    expect(updatedOrder.assignedTo).toBe('Chef David')
  })
})
