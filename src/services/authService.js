import usersSeed from '../data/users.json'
import { clearSession, readSession, readStore, writeSession, writeStore } from './storage'

const USERS_KEY = 'bt_users'

function sanitizeUser(user) {
  if (!user) return null
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

export const authService = {
  getUsers() {
    return readStore(USERS_KEY, usersSeed)
  },

  getCurrentUser() {
    const userId = readSession()
    return sanitizeUser(this.getUsers().find((user) => user.id === userId))
  },

  isAuthenticated() {
    return Boolean(this.getCurrentUser())
  },

  login(email, password) {
    const user = this.getUsers().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
    if (!user) {
      throw new Error('Invalid email or password. Try aarav@example.com / password123.')
    }

    writeSession(user.id)
    return sanitizeUser(user)
  },

  register(payload) {
    const users = this.getUsers()
    if (users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('This email is already registered. Please sign in.')
    }

    const fullName = payload.name.trim()
    const user = {
      id: `user-${Date.now()}`,
      name: fullName,
      username: payload.username || fullName.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18),
      email: payload.email,
      password: payload.password,
      role: payload.role || 'Builder',
      bio: payload.bio || 'New builder ready to collaborate.',
      skills: payload.skills ? payload.skills.split(',').map((skill) => skill.trim()).filter(Boolean) : [],
      interests: payload.interests ? payload.interests.split(',').map((interest) => interest.trim()).filter(Boolean) : [],
      experienceLevel: payload.experienceLevel || 'Beginner',
      github: payload.github || '',
      linkedin: payload.linkedin || '',
      avatar: fullName.charAt(0).toUpperCase(),
    }

    writeStore(USERS_KEY, [...users, user])
    writeSession(user.id)
    return sanitizeUser(user)
  },

  updateProfile(userId, updates) {
    const users = this.getUsers().map((user) => (user.id === userId ? { ...user, ...updates } : user))
    writeStore(USERS_KEY, users)
    return sanitizeUser(users.find((user) => user.id === userId))
  },

  logout() {
    clearSession()
  },
}
