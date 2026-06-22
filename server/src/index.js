import cors from 'cors'
import express from 'express'
import { readFileSync } from 'node:fs'

function readJson(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
}

const joinRequests = readJson('../../src/data/joinRequests.json')
const notifications = readJson('../../src/data/notifications.json')
const projects = readJson('../../src/data/projects.json')
const users = readJson('../../src/data/users.json')

function sanitizeUser(user) {
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'Build Together mock API' })
})

app.get('/api/users', (_request, response) => {
  response.json(users.map(sanitizeUser))
})

app.post('/api/auth/login', (request, response) => {
  const { email, password } = request.body
  const user = users.find((item) => item.email === email && item.password === password)
  if (!user) return response.status(401).json({ message: 'Invalid email or password' })

  return response.json({ user: sanitizeUser(user), token: `mock-token-${user.id}` })
})

app.get('/api/projects', (_request, response) => {
  response.json(projects)
})

app.get('/api/projects/:projectId', (request, response) => {
  const project = projects.find((item) => item.id === request.params.projectId)
  if (!project) return response.status(404).json({ message: 'Project not found' })
  return response.json(project)
})

app.get('/api/join-requests', (_request, response) => {
  response.json(joinRequests)
})

app.get('/api/notifications', (_request, response) => {
  response.json(notifications)
})

app.listen(port, () => {
  console.log(`Build Together mock API running on http://localhost:${port}`)
})
