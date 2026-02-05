import { OrderService } from '../domain/orderService'
import { FileOrderRepository } from '../infrastructure/repositories/FileOrderRepository'
import { FileWarningRepository } from '../infrastructure/repositories/FileWarningRepository'
import { FileAdminActionRepository } from '../infrastructure/repositories/FileAdminActionRepository'
import { FileNotificationRepository } from '../infrastructure/repositories/FileNotificationRepository'
import { FileEmployeeRepository } from '../infrastructure/repositories/FileEmployeeRepository'

// Instantiate Persistence Repositories
const ordersRepository = new FileOrderRepository()
const warningsRepository = new FileWarningRepository()
const adminActionRepository = new FileAdminActionRepository()
const notificationsRepository = new FileNotificationRepository()
export const employeeRepository = new FileEmployeeRepository()

// Instantiate the Singleton Service with Repositories
export const orderService = new OrderService(
  ordersRepository,
  warningsRepository,
  adminActionRepository,
  notificationsRepository
)

// Export direct accessors for "Read" operations (CQRS-lite)
// These now use the async repository methods
export const getOrders = async () => await ordersRepository.getAll()
export const getWarnings = async () => await warningsRepository.getAll()
export const getActions = async () => await adminActionRepository.getAll()
export const getEmployees = async () => await employeeRepository.getAll()
