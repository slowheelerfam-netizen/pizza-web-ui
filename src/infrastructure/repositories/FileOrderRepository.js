import fs from 'fs/promises'
import { DB_PATHS } from '../../lib/config'

const DATA_FILE = DB_PATHS.ORDERS
const TMP_FILE = `${DATA_FILE}.tmp`

let writeLock = Promise.resolve()

export class FileOrderRepository {
  async _runWithLock(operation) {
    writeLock = writeLock.then(operation, operation)
    return writeLock
  }

  async _readAll() {
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8')
      return JSON.parse(raw)
    } catch (err) {
      if (err.code === 'ENOENT') {
        return []
      }
      throw err
    }
  }

  async _writeAll(orders) {
    await fs.writeFile(TMP_FILE, JSON.stringify(orders, null, 2))
    await fs.rename(TMP_FILE, DATA_FILE)
  }

  async getAll() {
    return this._readAll()
  }

  async findById(orderId) {
    const orders = await this._readAll()
    return orders.find((o) => o.id === orderId) || null
  }

  async create(order) {
    return this._runWithLock(async () => {
      const orders = await this._readAll()
      orders.push(order)
      await this._writeAll(orders)
      return order
    })
  }

  async update(updatedOrder) {
    return this._runWithLock(async () => {
      const orders = await this._readAll()
      const index = orders.findIndex((o) => o.id === updatedOrder.id)

      if (index === -1) {
        throw new Error(`Order ${updatedOrder.id} not found`)
      }

      orders[index] = updatedOrder
      await this._writeAll(orders)
      return updatedOrder
    })
  }
}
