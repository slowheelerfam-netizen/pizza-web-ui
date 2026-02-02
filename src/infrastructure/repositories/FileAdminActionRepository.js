import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'actions.json')
const TEMP_FILE = `${DATA_FILE}.tmp`

let writeLock = Promise.resolve()

export class FileAdminActionRepository {
  async _read() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      if (error.code === 'ENOENT') return []
      throw error
    }
  }

  async _write(data) {
    await fs.writeFile(TEMP_FILE, JSON.stringify(data, null, 2))
    await fs.rename(TEMP_FILE, DATA_FILE)
  }

  /**
   * Executes an operation with a specialized mutex to ensure
   * only one write transaction occurs at a time.
   */
  async _runWithLock(operation) {
    const result = writeLock.then(operation)
    // Always advance the lock, even if the operation fails
    writeLock = result.catch(() => {})
    return result
  }

  async create(action) {
    return this._runWithLock(async () => {
      const actions = await this._read()
      actions.push(action)
      await this._write(actions)
      return action
    })
  }

  async findByTarget(targetEntityType, targetEntityId) {
    const actions = await this._read()
    return actions.filter(
      (a) =>
        a.targetEntityType === targetEntityType &&
        a.targetEntityId === targetEntityId
    )
  }

  async getAll() {
    return await this._read()
  }
}
