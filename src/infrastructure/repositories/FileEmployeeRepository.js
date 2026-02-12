import fs from 'fs'
import path from 'path'
import { DB_PATHS } from '../../lib/config'

const DATA_FILE = DB_PATHS.EMPLOYEES

export class FileEmployeeRepository {
  async getAll() {
    if (!fs.existsSync(DATA_FILE)) {
      return []
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  }

  async saveAll(employees) {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(employees, null, 2), 'utf-8')
  }
}
