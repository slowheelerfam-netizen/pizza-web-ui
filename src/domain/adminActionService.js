import crypto from 'crypto'

export function logAdminAction(
  adminId,
  targetType,
  targetId,
  actionType,
  comment
) {
  return {
    id: crypto.randomUUID(),
    adminId,
    targetType,
    targetId,
    actionType,
    comment,
    timestamp: new Date().toISOString(),
  }
}
