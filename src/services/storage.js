export function readStore(key, fallback) {
  if (typeof window === 'undefined') return fallback

  const saved = window.localStorage.getItem(key)
  if (!saved) {
    writeStore(key, fallback)
    return fallback
  }

  try {
    return JSON.parse(saved)
  } catch {
    writeStore(key, fallback)
    return fallback
  }
}

export function writeStore(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function readSession() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('bt_session')
}

export function writeSession(userId) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('bt_session', userId)
}

export function clearSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem('bt_session')
}
