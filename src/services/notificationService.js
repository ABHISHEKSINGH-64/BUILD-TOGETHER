import notificationsSeed from '../data/notifications.json'
import { readStore, writeStore } from './storage'

const NOTIFICATIONS_KEY = 'bt_notifications'

export const notificationService = {
  getNotifications(userId) {
    return readStore(NOTIFICATIONS_KEY, notificationsSeed).filter((notification) => notification.userId === userId || notification.userId === 'all')
  },

  markAllRead(userId) {
    const notifications = readStore(NOTIFICATIONS_KEY, notificationsSeed).map((notification) => (
      notification.userId === userId || notification.userId === 'all'
        ? { ...notification, read: true }
        : notification
    ))
    writeStore(NOTIFICATIONS_KEY, notifications)
    return this.getNotifications(userId)
  },
}
