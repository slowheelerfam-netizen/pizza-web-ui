import fs from 'fs/promises'
import { DB_PATHS } from '../../lib/config'

const DATA_PATH = DB_PATHS.WARNINGS
const TMP_PATH = `${DATA_PATH}.tmp`

let writeLock = Promise.resolve()

export class FileWarningRepository {
  async _runWithLock(operation) {
    writeLock = writeLock.then(operation, operation)
    return writeLock
  }

  async _safeReadAll() {
    try {
      const raw = await fs.readFile(DATA_PATH, 'utf-8')
      if (!raw.trim()) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch (err) {
      if (err.code === 'ENOENT') return []
      console.warn('[FileWarningRepository] Corrupt warnings.json — resetting')
      return []
    }
  }

  async _atomicWrite(allWarnings) {
    const json = JSON.stringify(allWarnings, null, 2)
    await fs.writeFile(TMP_PATH, json)
    await fs.rename(TMP_PATH, DATA_PATH)
  }

  async create(warning) {
    return this._runWithLock(async () => {
      const all = await this._safeReadAll()
      all.push(warning)
      await this._atomicWrite(all)
      return warning
    })
  }

  async deactivate(warningId) {
    return this._runWithLock(async () => {
      const all = await this._safeReadAll()
      const idx = all.findIndex((w) => w.id === warningId)
      if (idx === -1) return null
      all[idx] = { ...all[idx], isActive: false }
      await this._atomicWrite(all)
      return all[idx]
    })
  }

  // ✅ Added to match server action usage
  async findActiveByPhone(phone) {
    const all = await this._safeReadAll()
    return all.find(
      (w) =>
        w.isActive !== false &&
        w.customerIdentifier?.phone === phone
    ) || null
  }

  async findActiveByIdentifiers({ phone, name, paymentId }) {
    const all = await this._safeReadAll()

    return all.filter((w) => {
      if (w.isActive === false) return false
      if (phone && w.customerIdentifier?.phone === phone) return true
      if (
        name &&
        w.customerIdentifier?.name &&
        w.customerIdentifier.name.toLowerCase() === name.toLowerCase()
      )
        return true
      if (paymentId && w.customerIdentifier?.paymentId === paymentId) return true
      return false
    })
  }

  async getAll() {
    return this._safeReadAll()
  }
}

