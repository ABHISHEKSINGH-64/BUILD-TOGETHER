import joinRequestsSeed from '../data/joinRequests.json'
import notificationsSeed from '../data/notifications.json'
import projectsSeed from '../data/projects.json'
import { readStore, writeStore } from './storage'

const PROJECTS_KEY = 'bt_projects'
const REQUESTS_KEY = 'bt_join_requests'
const NOTIFICATIONS_KEY = 'bt_notifications'

export const projectService = {
  getProjects() {
    return readStore(PROJECTS_KEY, projectsSeed)
  },

  getProjectById(projectId) {
    return this.getProjects().find((project) => project.id === projectId)
  },

  searchProjects({ query = '', category = 'All', difficulty = 'All', stage = 'All' }) {
    const search = query.trim().toLowerCase()

    return this.getProjects().filter((project) => {
      const searchable = `${project.name} ${project.description} ${project.category} ${project.requiredSkills?.join(' ')}`.toLowerCase()
      return (
        (!search || searchable.includes(search)) &&
        (category === 'All' || project.category === category) &&
        (difficulty === 'All' || project.difficulty === difficulty) &&
        (stage === 'All' || project.stage === stage)
      )
    })
  },

  createProject(payload, ownerId) {
    const projects = this.getProjects()
    const project = {
      id: `project-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      category: payload.category,
      difficulty: payload.difficulty,
      stage: payload.stage,
      teamSize: Number(payload.teamSize || 4),
      requiredSkills: payload.requiredSkills.split(',').map((skill) => skill.trim()).filter(Boolean),
      banner: payload.banner || `${payload.category} project`,
      ownerId,
      memberIds: [ownerId],
      savedBy: [],
      progress: 12,
    }

    writeStore(PROJECTS_KEY, [project, ...projects])
    return project
  },

  saveProject(projectId, userId) {
    const projects = this.getProjects().map((project) => {
      if (project.id !== projectId) return project
      const savedBy = project.savedBy || []
      return {
        ...project,
        savedBy: savedBy.includes(userId) ? savedBy.filter((id) => id !== userId) : [...savedBy, userId],
      }
    })

    writeStore(PROJECTS_KEY, projects)
    return projects.find((project) => project.id === projectId)
  },

  getJoinRequests() {
    return readStore(REQUESTS_KEY, joinRequestsSeed)
  },

  applyToProject(projectId, userId, message) {
    const requests = this.getJoinRequests()
    if (requests.some((request) => request.projectId === projectId && request.userId === userId && request.status === 'pending')) {
      throw new Error('You already have a pending request for this project.')
    }

    const request = {
      id: `request-${Date.now()}`,
      projectId,
      userId,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    writeStore(REQUESTS_KEY, [request, ...requests])
    return request
  },

  updateJoinRequest(requestId, status) {
    const requests = this.getJoinRequests().map((request) => (request.id === requestId ? { ...request, status } : request))
    const updated = requests.find((request) => request.id === requestId)
    writeStore(REQUESTS_KEY, requests)

    if (status === 'accepted' && updated) {
      const projects = this.getProjects().map((project) => {
        if (project.id !== updated.projectId || project.memberIds?.includes(updated.userId)) return project
        return { ...project, memberIds: [...(project.memberIds || []), updated.userId] }
      })
      writeStore(PROJECTS_KEY, projects)
    }

    return updated
  },

  getDashboardData(userId) {
    const projects = this.getProjects()
    const requests = this.getJoinRequests()
    const notifications = readStore(NOTIFICATIONS_KEY, notificationsSeed)

    return {
      myProjects: projects.filter((project) => project.ownerId === userId),
      joinedProjects: projects.filter((project) => project.memberIds?.includes(userId) && project.ownerId !== userId),
      pendingRequests: requests.filter((request) => {
        const project = projects.find((item) => item.id === request.projectId)
        return request.status === 'pending' && project?.ownerId === userId
      }),
      savedProjects: projects.filter((project) => project.savedBy?.includes(userId)),
      notifications: notifications.filter((notification) => notification.userId === userId || notification.userId === 'all'),
    }
  },
}
