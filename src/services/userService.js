import usersSeed from '../data/users.json'
import projectsSeed from '../data/projects.json'
import { readStore, writeStore } from './storage'

const USERS_KEY = 'bt_users'
const PROJECTS_KEY = 'bt_projects'

export const userService = {
  getUsers() {
    return readStore(USERS_KEY, usersSeed)
  },

  getUserById(userId) {
    return this.getUsers().find((user) => user.id === userId)
  },

  updateUser(userId, updates) {
    const users = this.getUsers().map((user) => (user.id === userId ? { ...user, ...updates } : user))
    writeStore(USERS_KEY, users)
    return users.find((user) => user.id === userId)
  },

  getProfileStats(userId) {
    const projects = readStore(PROJECTS_KEY, projectsSeed)
    return {
      created: projects.filter((project) => project.ownerId === userId).length,
      joined: projects.filter((project) => project.memberIds?.includes(userId)).length,
      saved: projects.filter((project) => project.savedBy?.includes(userId)).length,
    }
  },
}
