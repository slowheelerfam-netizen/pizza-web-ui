import 'server-only'

import { PrismaOrderRepository } from '@/infrastructure/repositories/PrismaOrderRepository'
import { FileNotificationRepository } from '@/infrastructure/repositories/FileNotificationRepository'
import { FileAdminActionRepository } from '@/infrastructure/repositories/FileAdminActionRepository'
import { FileWarningRepository } from '@/infrastructure/repositories/FileWarningRepository'
import { FileEmployeeRepository } from '@/infrastructure/repositories/FileEmployeeRepository'
import { OrderService } from '@/server/domain/orderService'

export function createServerServices() {
  const repositories = {
    order: new PrismaOrderRepository(),
    notification: new FileNotificationRepository(),
    adminAction: new FileAdminActionRepository(),
    warning: new FileWarningRepository(),
    employee: new FileEmployeeRepository(),
  }

  const orderService = new OrderService(
    repositories.order,
    repositories.warning,
    repositories.adminAction,
    repositories.notification
  )

  return {
    orderService,
    repositories,
  }
}
