import fs from 'fs/promises'
import path from 'path'
import { DB_PATHS } from '../../lib/config'

const DATA_FILE = DB_PATHS.ORDERS
const TMP_FILE = `${DATA_FILE}.tmp`

let writeLock = Promise.resolve()

export class FileOrderRepository {
  async _ensureDir() {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  }

  async _runWithLock(operation) {
    writeLock = writeLock.then(operation, operation)
    return writeLock
  }

  async _readAll() {
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8')
      const data = JSON.parse(raw)
      // defensive clone to avoid shared-mutation bugs
      return structuredClone(data)
    } catch (err) {
      if (err.code === 'ENOENT') {
        return []
      }
      throw err
    }
  }

  async _writeAll(orders) {
    await this._ensureDir()
    const safe = structuredClone(orders)
    await fs.writeFile(TMP_FILE, JSON.stringify(safe, null, 2))
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
      orders.push(structuredClone(order))
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

      orders[index] = structuredClone(updatedOrder)
      await this._writeAll(orders)
      return updatedOrder
    })
  }
}

