import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const FILE_PATH = path.join(DATA_DIR, 'notifications.json')
const TMP_PATH = `${FILE_PATH}.tmp`

let writeLock = Promise.resolve()

function withWriteLock(operation) {
  writeLock = writeLock.then(operation, operation)
  return writeLock
}

async function safeReadNotifications() {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf-8')
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      console.warn(
        '[FileNotificationRepository] notifications.json is not an array. Resetting to empty.'
      )
      return []
    }

    return parsed
  } catch (err) {
    if (err.code === 'ENOENT') {
      return []
    }

    console.warn(
      '[FileNotificationRepository] Failed to read or parse notifications.json. Using empty fallback.',
      err
    )
    return []
  }
}

async function atomicWrite(data) {
  const serialized = JSON.stringify(data, null, 2)
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(TMP_PATH, serialized)
  await fs.rename(TMP_PATH, FILE_PATH)
}

export class FileNotificationRepository {
  async create(notification) {
    return withWriteLock(async () => {
      try {
        const notifications = await safeReadNotifications()
        notifications.push(notification)
        await atomicWrite(notifications)
        return notification
      } catch (err) {
        console.error(
          '[FileNotificationRepository] Failed to create notification',
          err
        )
        // Re-throwing to preserve behavior of surfacing errors to domain layer
        throw err
      }
    })
  }

  async update(updatedNotification) {
    return withWriteLock(async () => {
      try {
        const notifications = await safeReadNotifications()
        const index = notifications.findIndex(
          (n) => n.id === updatedNotification.id
        )

        if (index === -1) return null

        notifications[index] = updatedNotification
        await atomicWrite(notifications)
        return updatedNotification
      } catch (err) {
        console.error(
          '[FileNotificationRepository] Failed to update notification',
          err
        )
        throw err
      }
    })
  }

  async findByOrderId(orderId) {
    const notifications = await safeReadNotifications()
    return notifications.filter((n) => n.orderId === orderId)
  }

  async getAll() {
    return await safeReadNotifications()
  }
}
