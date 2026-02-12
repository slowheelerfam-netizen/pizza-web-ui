import 'server-only'
import { FileOrderRepository } from '../infrastructure/repositories/FileOrderRepository'
import { FileNotificationRepository } from '../infrastructure/repositories/FileNotificationRepository'
import { FileAdminActionRepository } from '../infrastructure/repositories/FileAdminActionRepository'
import { FileWarningRepository } from '../infrastructure/repositories/FileWarningRepository'
import { FileEmployeeRepository } from '../infrastructure/repositories/FileEmployeeRepository'

import { OrderService } from '../domain/orderService'

export function createServerServices() {
  const orderRepository = new FileOrderRepository()
  const notificationRepository = new FileNotificationRepository()
  const adminActionRepository = new FileAdminActionRepository()
  const warningRepository = new FileWarningRepository()
  const employeeRepository = new FileEmployeeRepository()

  const orderService = new OrderService(
    orderRepository,
    warningRepository,
    adminActionRepository,
    notificationRepository
  )

  return {
    orderService,
    orderRepository,
    notificationRepository,
    adminActionRepository,
    warningRepository,
    employeeRepository,
  }
}

