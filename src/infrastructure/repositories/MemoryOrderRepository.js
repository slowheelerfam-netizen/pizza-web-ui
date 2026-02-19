import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class PrismaOrderRepository {
  async getAll() {
    try {
      return await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
      })
    } catch (err) {
      console.error('PrismaOrderRepository.getAll error:', err)
      return []
    }
  }

  async findById(id) {
    try {
      return await prisma.order.findUnique({ where: { id } })
    } catch (err) {
      console.error(`PrismaOrderRepository.findById(${id}) error:`, err)
      return null
    }
  }

  async create(order) {
    try {
      return await prisma.order.create({ data: order })
    } catch (err) {
      console.error('PrismaOrderRepository.create error:', err)
      throw err
    }
  }

  async update(order) {
    try {
      return await prisma.order.update({
        where: { id: order.id },
        data: order,
      })
    } catch (err) {
      console.error(`PrismaOrderRepository.update(${order.id}) error:`, err)
      throw err
    }
  }

  async updateStatus(orderId, nextStatus) {
    try {
      const data = { status: nextStatus }
      if (nextStatus === 'OVEN') data.ovenEnteredAt = new Date()
      if (nextStatus === 'READY') data.actualReadyAt = new Date()

      return await prisma.order.update({
        where: { id: orderId },
        data,
      })
    } catch (err) {
      console.error(`PrismaOrderRepository.updateStatus(${orderId}) error:`, err)
      throw err
    }
  }
}
