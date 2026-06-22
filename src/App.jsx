import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bell,
  Bookmark,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Gauge,
  GitPullRequest,
  Globe2,
  Lock,
  Menu,
  MessageCircle,
  Moon,
  LogOut,
  Settings,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { authService } from './services/authService'
import { notificationService } from './services/notificationService'
import { projectService } from './services/projectService'
import { userService } from './services/userService'

const navItems = [
  { label: 'Platform', path: '/' },
  { label: 'Projects', path: '/discover' },
  { label: 'Matches', path: '/matches' },
  { label: 'Team Room', path: '/team-room' },
  { label: 'Showcase', path: '/showcase' },
  { label: 'Dashboard', path: '/dashboard' },
]

const matches = [
  { name: 'Maya Rao', role: 'Product Designer', score: '96%', detail: 'Design systems, SaaS UX, onboarding flows' },
  { name: 'Aarav Mehta', role: 'Full-stack Engineer', score: '93%', detail: 'React, Express, MongoDB, JWT auth' },
  { name: 'Nora Khan', role: 'Growth Builder', score: '89%', detail: 'Launch strategy, community, analytics' },
  { name: 'Ishan Verma', role: 'AI Engineer', score: '87%', detail: 'LLMs, vector search, recommendation systems' },
]

const activities = [
  'Maya requested to join DesignOps Library',
  'LaunchOS added a backend engineer requirement',
  'HackSprint AI generated 6 teammate recommendations',
]

const chatMessages = [
  { name: 'Maya', role: 'Designer', text: 'I uploaded the onboarding wireframes. Can someone review the empty state copy?', time: '10:24' },
  { name: 'Aarav', role: 'Engineer', text: 'Reviewing now. I will connect the join-request API after auth screens are stable.', time: '10:31' },
  { name: 'You', role: 'Owner', text: 'Great. Let us lock the MVP scope today and move payments to phase two.', time: '10:36', own: true },
]

const milestones = [
  { title: 'Team formed', status: 'Done', date: 'Jun 18' },
  { title: 'MVP scope locked', status: 'Today', date: 'Jun 21' },
  { title: 'Beta launch', status: 'Next', date: 'Jun 30' },
]

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'

  const saved = window.localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser())

  function syncAuth() {
    setCurrentUser(authService.getCurrentUser())
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <main className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
        <Header
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleMobile={() => setMobileOpen((value) => !value)}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          currentUser={currentUser}
          onAuthChange={syncAuth}
          theme={theme}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage currentUser={currentUser} />} />
          <Route path="/projects/:projectId" element={<ProjectDetailsPage currentUser={currentUser} />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/team-room" element={<ProtectedRoute currentUser={currentUser}><TeamRoomPage /></ProtectedRoute>} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/dashboard" element={<ProtectedRoute currentUser={currentUser}><DashboardPage currentUser={currentUser} /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<AuthPage mode="login" onAuthChange={syncAuth} />} />
          <Route path="/register" element={<AuthPage mode="register" onAuthChange={syncAuth} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/create-project" element={<ProtectedRoute currentUser={currentUser}><CreateProjectPage currentUser={currentUser} /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute currentUser={currentUser}><ProfilePage currentUser={currentUser} /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProfilePage currentUser={currentUser} />} />
          <Route path="/notifications" element={<ProtectedRoute currentUser={currentUser}><NotificationsPage currentUser={currentUser} /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute currentUser={currentUser}><SettingsPage currentUser={currentUser} onAuthChange={syncAuth} /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </main>
    </BrowserRouter>
  )
}

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) return <Navigate to="/login" replace />
  return children
}

function Header({ mobileOpen, onCloseMobile, onToggleMobile, onToggleTheme, currentUser, onAuthChange, theme }) {
  const navigate = useNavigate()

  function handleLogout() {
    authService.logout()
    onAuthChange()
    navigate('/')
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-transparent bg-transparent transition-all duration-300">
      <nav className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 lg:px-10">
        <div className="flex items-center gap-8">
          <Link className="font-heading text-2xl font-bold tracking-[-0.04em] text-[var(--foreground)]" to="/" onClick={onCloseMobile}>
            BuildTogether
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `px-3 text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? 'gradient-text'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`
                }
                key={item.path}
                to={item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link className="hidden rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--card-muted)] hover:text-[var(--foreground)] lg:grid" to="/notifications" aria-label="Notifications">
            <Bell size={23} />
          </Link>
          {currentUser && (
            <Link className="hidden rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--card-muted)] hover:text-[var(--foreground)] lg:grid" to="/settings" aria-label="Settings">
              <Settings size={21} />
            </Link>
          )}
          <button className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--card-muted)] hover:text-[var(--foreground)]" type="button" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={onToggleTheme}>
            {theme === 'dark' ? <Sun size={21} /> : <Moon size={21} />}
          </button>
          {currentUser ? (
            <>
              <Link className="hidden px-4 py-2 font-body text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)] sm:inline-block" to="/profile">
                {currentUser.name}
              </Link>
              <button className="hidden rounded-full border border-[var(--border)] px-4 py-2 font-body text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)] sm:inline-flex sm:items-center sm:gap-2" type="button" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link className="hidden px-4 py-2 font-body text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)] sm:inline-block" to="/login">
                Sign In
              </Link>
              <Link className="gradient-bg hidden rounded-full px-5 py-2 font-body text-sm font-semibold transition hover:-translate-y-0.5 sm:inline-block" to="/register">
                Get Started
              </Link>
            </>
          )}
          <button className="gradient-bg rounded-full p-2.5 lg:hidden" type="button" aria-label="Open navigation" onClick={onToggleMobile}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-[1280px] gap-2">
            {[
              ...navItems,
              { label: 'Create Project', path: '/create-project' },
              { label: 'Notifications', path: '/notifications' },
              { label: currentUser ? 'Profile' : 'Sign In', path: currentUser ? '/profile' : '/login' },
            ].map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 font-body text-sm font-bold ${
                    isActive ? 'bg-[var(--card-muted)] gradient-text shadow-sm' : 'text-[var(--muted)]'
                  }`
                }
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <FeatureBento />
      <ProjectEcosystem />
      <StatsBand />
      <Testimonials />
      <CtaSection />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-28 lg:px-10">
      <div className="radial-glow absolute -top-16 inset-x-0 -z-10 mx-auto h-48 w-3/4 rounded-full blur-[2rem]" />
      <div className="pattern-grid pointer-events-none absolute inset-0 -z-20 opacity-70" />
      <motion.div className="mx-auto max-w-screen-xl text-center" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
        <div className="relative mb-8 inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 font-body text-sm font-semibold text-[var(--foreground)] backdrop-blur-sm before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-[#2FB4E4] before:p-px dark:before:bg-[#F8BC54] after:absolute after:inset-px after:-z-10 after:rounded-full after:bg-white/80 dark:after:bg-[#0a0a0a]/90">
          <Sparkles className="text-[#2FB4E4] dark:text-[#F8BC54]" size={18} fill="currentColor" />
          The future of builder collaboration
        </div>
        <h1 className="mx-auto mb-8 max-w-5xl font-heading text-[3.2rem] font-bold leading-[1.02] tracking-[-0.055em] text-[var(--foreground)] md:text-[5.5rem]">
          Stop <span className="gradient-text">Building</span> Alone.
        </h1>
        <p className="mx-auto mb-12 max-w-3xl font-body text-lg leading-8 text-[var(--muted)]">
          Find developers, designers, founders, and creators to build amazing projects together.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link className="gradient-bg w-full rounded-full px-8 py-4 text-center font-body text-sm font-semibold shadow-xl transition hover:scale-105 sm:w-auto" to="/discover">
            Start Building Free
          </Link>
          <Link className="w-full rounded-full border border-[var(--border)] bg-transparent px-8 py-4 text-center font-body text-sm font-semibold text-[var(--foreground)] backdrop-blur transition hover:bg-[var(--card-muted)] sm:w-auto" to="/matches">
            Find Teammates
          </Link>
          <Link className="w-full rounded-full border border-[var(--border)] bg-transparent px-8 py-4 text-center font-body text-sm font-semibold text-[var(--foreground)] backdrop-blur transition hover:bg-[var(--card-muted)] sm:w-auto" to="/team-room">
            Open Team Room
          </Link>
        </div>

        <div className="relative mt-20">
          <div className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/80 p-3 shadow-2xl shadow-[#2FB4E4]/10 backdrop-blur-2xl dark:shadow-[#F8BC54]/10">
            <DashboardMockup />
          </div>
          <div className="absolute -right-6 -top-10 hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/85 p-4 text-left shadow-2xl shadow-[#2FB4E4]/10 backdrop-blur-xl lg:flex lg:items-center lg:gap-4 dark:shadow-[#F8BC54]/10">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#F8BC54]/25 text-[#F8BC54]">
              <Zap size={22} />
            </div>
            <div>
              <p className="font-body text-xs font-bold text-[var(--muted)]">Real-time Match</p>
              <p className="font-body text-sm font-extrabold">99.9% Fit Signal</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--card)] shadow-sm dark:bg-[#0b0b0b]">
      <div className="flex items-center justify-between border-b border-[var(--border)]/35 bg-[var(--background)] px-5 py-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="hidden rounded-full bg-[var(--card-muted)] px-4 py-1.5 font-body text-xs font-bold text-[var(--muted)] dark:bg-white/10 dark:text-[var(--muted)] sm:block">buildtogether.com/dashboard</span>
      </div>
      <div className="grid min-h-[460px] md:grid-cols-[230px_1fr]">
        <aside className="hidden border-r border-[var(--border)]/35 bg-[var(--card-muted)] p-5 dark:border-white/10 dark:bg-white/5 md:block">
          {['Overview', 'Projects', 'Requests', 'Messages'].map((item, index) => (
            <div className={`mb-3 flex items-center gap-3 rounded-xl px-4 py-3 font-body text-sm font-bold ${index === 0 ? 'bg-white text-[#2FB4E4] shadow-sm dark:bg-white/10 dark:text-white' : 'text-[var(--muted)] dark:text-[var(--muted)]'}`} key={item}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {item}
            </div>
          ))}
        </aside>
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)] shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#2FB4E4] dark:text-[#F8BC54]">AI recommendation</p>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em]">LaunchOS needs you</h2>
                  <p className="mt-3 max-w-xl font-body text-sm leading-6 text-[var(--muted)]">Your React, API, and product skills match the team&apos;s next sprint.</p>
                </div>
                <WandSparkles />
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--card-muted)] dark:bg-white/10">
                <div className="h-full w-[84%] rounded-full bg-[#2FB4E4] dark:bg-[#F8BC54]" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Requests', '12', GitPullRequest],
                ['Chats', '18', MessageCircle],
                ['Saved', '34', Bookmark],
              ].map(([label, value, Icon]) => (
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm" key={label}>
                  <Icon className="text-[#2FB4E4] dark:text-[#F8BC54]" size={22} />
                  <p className="mt-4 font-display text-4xl font-extrabold tracking-[-0.06em]">{value}</p>
                  <p className="font-body text-sm font-semibold text-[var(--muted)] dark:text-[var(--muted)]">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-muted)] p-5 dark:bg-[#111]">
            <p className="font-body text-xs font-bold uppercase tracking-[0.16em] text-[#2FB4E4] dark:text-[#F8BC54]">Team chat</p>
            <div className="mt-5 space-y-3">
              {chatMessages.slice(0, 3).map((item) => (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-left font-body text-sm font-semibold text-[var(--muted)]" key={`${item.name}-${item.time}`}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-extrabold text-[var(--foreground)] dark:text-white">{item.name}</span>
                    <span className="text-xs text-[var(--muted)]">{item.time}</span>
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
            <Link className="mt-4 inline-flex items-center gap-2 font-body text-sm font-bold text-[#2FB4E4] dark:text-[#F8BC54]" to="/team-room">
              Open room <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureBento() {
  return (
    <section className="bg-[var(--card-muted)] px-4 py-20 md:px-12 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading
          align="center"
          title="Engineered for high-growth builder teams"
          text="Everything your team needs to find collaborators, validate ideas, and move from request to launch."
        />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          <BentoCard className="md:col-span-8" icon={Gauge} title="Collaboration Analytics" text="Understand which projects are gaining momentum, which roles are missing, and which teammates are most likely to fit." large />
          <BentoCard className="md:col-span-4" icon={ShieldCheck} title="Verified Trust" text="OTP verification, profile quality signals, protected routes, and admin moderation patterns." />
          <BentoCard className="md:col-span-6" icon={Bot} title="AI Matching" text="Recommend teammates and projects using skills, interests, availability, and experience level." />
          <BentoCard className="md:col-span-6" icon={MessageCircle} title="Team Rooms with Chat" text="Every accepted team gets a shared project room with chat, milestones, requests, and task coordination." />
          <BentoCard className="md:col-span-6" icon={Users} title="Fluid Collaboration" text="Join requests, project owners, saved opportunities, role-based dashboards, and live notifications." />
        </div>
      </div>
    </section>
  )
}

function BentoCard({ className = '', icon: Icon, title, text, large }) {
  return (
    <article className={`rounded-[24px] border border-white/60 bg-white/80 p-8 shadow-[0_4px_24px_rgba(19,27,46,0.05)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#2FB4E4]/10 dark:border-white/10 dark:bg-white/8 ${className}`}>
      <div className={`${large ? 'md:flex md:items-center md:gap-10' : ''}`}>
        <div className="flex-1">
          <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-[rgba(47,180,228,0.12)] text-[#2FB4E4] dark:bg-[#F8BC54]/20 dark:text-[#F8BC54]">
            <Icon size={24} />
          </div>
          <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">{title}</h3>
          <p className="mt-4 font-body leading-7 text-[var(--muted)] dark:text-[var(--muted)]">{text}</p>
          {large && (
            <Link className="mt-6 inline-flex items-center gap-1 font-body text-sm font-bold text-[#2FB4E4] dark:text-[#F8BC54]" to="/dashboard">
              Explore insights <ArrowRight size={18} />
            </Link>
          )}
        </div>
        {large && (
          <div className="mt-8 grid min-h-[220px] flex-1 place-items-center rounded-xl bg-[linear-gradient(135deg,#ffffff,rgba(47,180,228,0.12))] p-6 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(173,198,255,0.18))] md:mt-0">
            <div className="w-full space-y-4">
              {[72, 88, 54].map((width) => (
                <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-white/10" key={width}>
                  <div className="mb-3 flex justify-between font-body text-xs font-bold text-[var(--muted)] dark:text-[var(--muted)]">
                    <span>Match signal</span>
                    <span>{width}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#eaedff] dark:bg-white/10">
                    <div className="h-full rounded-full bg-[#2FB4E4]" style={{ width: `${width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function ProjectEcosystem() {
  const featuredProjects = projectService.getProjects().slice(0, 3)

  return (
    <section className="px-4 py-20 md:px-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading title="Project ecosystem" text="A bird's eye view of active teams, momentum, required skills, and launch readiness." />
          <div className="flex gap-2">
            <button className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] transition hover:bg-[rgba(47,180,228,0.12)] hover:text-[#2FB4E4] dark:border-white/10" type="button" aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <button className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] transition hover:bg-[rgba(47,180,228,0.12)] hover:text-[#2FB4E4] dark:border-white/10" type="button" aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredProjects.map((project) => <ProjectCard project={project} key={project.id} />)}
        </div>
      </div>
    </section>
  )
}

function getProjectTitle(project) {
  return project.name || project.title
}

function getProjectTags(project) {
  return project.requiredSkills || project.tags || []
}

function getProjectMomentum(project) {
  const progress = typeof project.progress === 'number' ? project.progress : 0
  const activeSteps = Math.max(1, Math.min(4, Math.ceil(progress / 25)))
  const signal = progress >= 75 ? 'Launch check' : progress >= 50 ? 'Build sprint' : progress >= 25 ? 'Scope lock' : 'Fresh idea'

  return {
    activeSteps,
    signal,
    openSeats: Math.max(0, Number(project.teamSize || 0) - (project.memberIds?.length || 0)),
  }
}

function ProjectCard({ project, currentUser, onSave, onApply }) {
  const title = getProjectTitle(project)
  const tags = getProjectTags(project)
  const momentum = getProjectMomentum(project)
  const status = project.stage || project.status
  const saved = currentUser && project.savedBy?.includes(currentUser.id)

  return (
    <article className="group rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
      <div className="mb-6 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--card-muted)]">
        <div className="flex items-center justify-between p-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[#2FB4E4] dark:text-[#F8BC54]">
            <BriefcaseBusiness size={22} />
          </div>
          <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 font-body text-xs font-bold text-[var(--muted)]">
            {status}
          </span>
        </div>
        <div className="border-t border-[var(--border)] bg-[var(--card)]/55 p-5 dark:bg-white/5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-body text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Momentum</p>
              <p className="mt-2 font-display text-2xl font-bold tracking-[-0.03em]">{momentum.signal}</p>
            </div>
            <div className="text-right">
              <p className="font-body text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Open seats</p>
              <p className="mt-2 font-body text-sm font-extrabold text-[#2FB4E4] dark:text-[#F8BC54]">{momentum.openSeats || 'Filled'}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['Idea', 'Plan', 'Build', 'Ship'].map((step, index) => (
              <span className={`h-2 rounded-full transition ${index < momentum.activeSteps ? 'bg-[#2FB4E4] shadow-sm shadow-[#2FB4E4]/30 dark:bg-[#F8BC54] dark:shadow-[#F8BC54]/30' : 'bg-black/5 dark:bg-white/10'}`} key={step} title={step} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 font-body text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
            {['Idea', 'Plan', 'Build', 'Ship'].map((step) => <span key={step}>{step}</span>)}
          </div>
        </div>
      </div>
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">{title}</h3>
        <span className="rounded bg-[var(--card-muted)] px-2 py-1 font-body text-xs font-bold text-[var(--muted)] dark:bg-white/10 dark:text-[var(--muted)]">{project.category || status}</span>
      </div>
      <p className="mb-4 font-body text-sm leading-6 text-[var(--muted)] dark:text-[var(--muted)]">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span className={`rounded-lg px-3 py-1 font-body text-xs font-bold ${index === 0 ? 'bg-[rgba(47,180,228,0.12)] text-[#2FB4E4]' : 'bg-[rgba(248,188,84,0.16)] text-[#F8BC54]'}`} key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link className="gradient-bg rounded-full px-4 py-2.5 font-body text-xs font-bold shadow-lg shadow-black/5" to={project.id ? `/projects/${project.id}` : '/team-room'}>
          View details
        </Link>
        <button className="rounded-full border border-[var(--border)] px-4 py-2.5 font-body text-xs font-bold text-[var(--foreground)] transition hover:bg-[var(--card-muted)]" type="button" onClick={() => onApply?.(project.id)}>
          Request to join
        </button>
        {onSave && (
          <button className="rounded-full border border-[var(--border)] px-4 py-2.5 font-body text-xs font-bold text-[var(--muted)] transition hover:bg-[var(--card-muted)]" type="button" onClick={() => onSave(project.id)}>
            {saved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>
    </article>
  )
}

function StatsBand() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--card-muted)] px-4 py-20 md:px-12">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 text-center lg:grid-cols-4">
        {[
          ['450%', 'More team matches'],
          ['12K', 'Active projects'],
          ['24/7', 'Live notifications'],
          ['0.8s', 'Average search'],
        ].map(([value, label]) => (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm" key={label}>
            <p className="font-display text-5xl font-extrabold leading-none tracking-[-0.04em] text-[#2FB4E4] dark:text-[#F8BC54] md:text-6xl">{value}</p>
            <p className="mt-3 font-body text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="bg-[var(--background)] px-4 py-20 md:px-12 dark:bg-[#050505]">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading align="center" title="Trusted by ambitious builders" text="The platform feels organized, modern, and serious enough for real product teams." />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            ['Aarav Singh', 'Founder at SprintLab', 'Build Together gave our hackathon team the structure we needed to become a real startup project.'],
            ['Maya Rao', 'Product Designer', 'The profiles, project cards, and matching experience feel cleaner than most collaboration platforms.'],
            ['Nora Khan', 'Community Lead', 'It turns scattered ideas into visible opportunities with owners, roles, and clear next steps.'],
          ].map(([name, role, quote]) => (
            <article className="rounded-[24px] border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-md dark:border-white/10 dark:bg-white/8" key={name}>
              <div className="mb-6 flex gap-1 text-[#2FB4E4] dark:text-[#F8BC54]">
                {Array.from({ length: 5 }).map((_, index) => <Star fill="currentColor" size={18} key={index} />)}
              </div>
              <p className="mb-8 font-body leading-7 text-[var(--foreground)] dark:text-white">&quot;{quote}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-[rgba(47,180,228,0.12)] bg-[#2FB4E4] font-display font-extrabold text-white">
                  {name.charAt(0)}
                </div>
                <div>
                  <p className="font-body text-sm font-extrabold">{name}</p>
                  <p className="font-body text-xs font-bold text-[var(--muted)] dark:text-[var(--muted)]">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="px-4 py-20 md:px-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-12 text-center shadow-sm md:p-20">
          <div className="radial-glow absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full blur-3xl opacity-60" />
          <div className="relative z-10">
            <h2 className="mb-8 font-display text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[var(--foreground)] md:text-6xl">Ready to build with the right team?</h2>
            <p className="mx-auto mb-12 max-w-2xl font-body text-lg leading-8 text-[var(--muted)]">Create a profile, verify your account, discover projects, and start collaborating with serious builders.</p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link className="gradient-bg w-full rounded-full px-10 py-4 font-body text-sm font-semibold shadow-lg transition hover:scale-105 sm:w-auto" to="/register">
                Get Started Instantly
              </Link>
              <Link className="w-full rounded-full border border-[var(--border)] px-10 py-4 font-body text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--card-muted)] sm:w-auto" to="/team-room">
                Preview Team Room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DiscoverPage({ currentUser }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [stage, setStage] = useState('All')
  const [notice, setNotice] = useState('')
  const projectsList = projectService.searchProjects({ query, category, difficulty, stage })

  function handleSave(projectId) {
    if (!currentUser) {
      setNotice('Please sign in to save projects.')
      return
    }
    projectService.saveProject(projectId, currentUser.id)
    setNotice('Saved projects are available on your dashboard.')
  }

  function handleApply(projectId) {
    if (!currentUser) {
      setNotice('Please sign in to send a join request.')
      return
    }
    try {
      projectService.applyToProject(projectId, currentUser.id, 'I would like to join this project and help the team ship faster.')
      setNotice('Join request sent to the project owner.')
    } catch (error) {
      setNotice(error.message)
    }
  }

  return (
    <PageShell
      eyebrow="Projects"
      title="Explore serious collaboration opportunities."
      text="Search by skill, category, difficulty, and launch stage."
      action={<SearchBox value={query} onChange={setQuery} />}
    >
      <div className="mb-8 grid gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm md:grid-cols-3">
        <FilterSelect label="Category" value={category} onChange={setCategory} options={['All', 'Web Development', 'Mobile Apps', 'AI / ML', 'Data Science', 'Open Source', 'Startup', 'Hackathon']} />
        <FilterSelect label="Difficulty" value={difficulty} onChange={setDifficulty} options={['All', 'Beginner', 'Intermediate', 'Advanced']} />
        <FilterSelect label="Stage" value={stage} onChange={setStage} options={['All', 'Idea', 'Planning', 'Building', 'Testing', 'Launched']} />
      </div>
      {notice && <p className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 font-body text-sm font-bold text-[var(--muted)]">{notice}</p>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {projectsList.map((project) => (
          <ProjectCard currentUser={currentUser} onApply={handleApply} onSave={handleSave} project={project} key={project.id} />
        ))}
      </div>
      {projectsList.length === 0 && (
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-10 text-center">
          <p className="font-display text-2xl font-bold">No projects found.</p>
          <p className="mt-2 font-body text-sm text-[var(--muted)]">Try a broader search or create a new project for others to join.</p>
        </div>
      )}
    </PageShell>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
      {label}
      <select
        className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] px-4 py-3 font-body text-sm font-bold normal-case tracking-normal text-[var(--foreground)] outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  )
}

function MatchesPage() {
  return (
    <PageShell eyebrow="Team Matching" title="AI-guided teammate recommendations." text="Match with developers, designers, founders, and growth builders who fit your project goals." compact>
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <article className="rounded-[22px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] text-[#2FB4E4] dark:text-[#F8BC54]">
            <Users size={21} />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold leading-tight tracking-[-0.03em]">Your team graph is 73% complete.</h2>
          <p className="mt-3 font-body text-sm leading-6 text-[var(--muted)]">Add portfolio links and availability to improve teammate recommendations.</p>
          <div className="mt-6 h-2 rounded-full bg-[var(--card-muted)] dark:bg-white/10">
            <div className="h-full w-[73%] rounded-full bg-[#2FB4E4] dark:bg-[#F8BC54]" />
          </div>
        </article>
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => <MatchCard match={match} key={match.name} />)}
        </div>
      </div>
    </PageShell>
  )
}

function MatchCard({ match }) {
  return (
    <article className="rounded-[22px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold tracking-[-0.02em]">{match.name}</h2>
          <p className="mt-1 font-body text-xs font-semibold text-[var(--muted)]">{match.role}</p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--card-muted)] px-2.5 py-1 font-body text-xs font-extrabold text-[#2FB4E4] dark:text-[#F8BC54]">{match.score}</span>
      </div>
      <p className="mt-4 font-body text-sm leading-6 text-[var(--muted)]">{match.detail}</p>
      <button className="gradient-bg mt-5 rounded-full px-4 py-2.5 font-body text-xs font-bold shadow-sm" type="button">Invite teammate</button>
    </article>
  )
}

function TeamRoomPage() {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(chatMessages)

  function sendMessage(event) {
    event.preventDefault()
    if (!draft.trim()) return

    setMessages((current) => [
      ...current,
      {
        name: 'You',
        role: 'Owner',
        text: draft.trim(),
        time: 'Now',
        own: true,
      },
    ])
    setDraft('')
  }

  return (
    <PageShell
      eyebrow="Team Room"
      title="Where your team plans, chats, and ships."
      text="After a join request is accepted, teammates can coordinate inside a shared room with chat, milestones, decisions, and tasks."
      action={<Link className="rounded-2xl bg-[#2FB4E4] px-6 py-3 font-body text-sm font-bold text-white shadow-xl shadow-[#2FB4E4]/20" to="/create-project">Create another room</Link>}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="overflow-hidden rounded-[24px] border border-white/60 bg-white/85 shadow-2xl shadow-[#283044]/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/8">
          <div className="border-b border-[var(--border)]/40 bg-[var(--card-muted)] p-6 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="font-body text-xs font-extrabold uppercase tracking-[0.18em] text-[#2FB4E4] dark:text-[#F8BC54]">LaunchOS team chat</p>
                <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em]">MVP Sprint Room</h2>
              </div>
              <div className="flex -space-x-2">
                {['Y', 'M', 'A', 'N'].map((initial) => (
                  <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#2FB4E4] font-display text-sm font-extrabold text-white dark:border-[#0a0a0a]" key={initial}>{initial}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="max-h-[520px] space-y-4 overflow-y-auto p-6">
            {messages.map((message, index) => (
              <div className={`flex ${message.own ? 'justify-end' : 'justify-start'}`} key={`${message.name}-${message.time}-${index}`}>
                <div className={`max-w-[82%] rounded-[22px] p-4 ${message.own ? 'bg-[#2FB4E4] text-white' : 'bg-[var(--card-muted)] text-[var(--foreground)] dark:bg-white/10 dark:text-white'}`}>
                  <div className="mb-2 flex items-center justify-between gap-4 font-body text-xs font-bold opacity-80">
                    <span>{message.name} · {message.role}</span>
                    <span>{message.time}</span>
                  </div>
                  <p className="font-body text-sm leading-6">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form className="border-t border-[var(--border)]/40 p-4 dark:border-white/10" onSubmit={sendMessage}>
            <div className="flex gap-3">
              <input
                className="min-w-0 flex-1 rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] px-4 py-3 font-body text-sm font-semibold text-[var(--foreground)] outline-none transition focus:border-[#2FB4E4] focus:bg-white focus:ring-4 focus:ring-[#F8BC54]/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Message your team..."
                value={draft}
              />
              <button className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#2FB4E4] text-white shadow-lg shadow-[#2FB4E4]/20" type="submit" aria-label="Send message">
                <Send size={20} />
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <TeamPanel title="Sprint milestones" icon={CalendarDays}>
            <div className="space-y-3">
              {milestones.map((item) => (
                <div className="flex items-center justify-between rounded-2xl bg-[var(--card-muted)] p-4 dark:bg-white/5" key={item.title}>
                  <div>
                    <p className="font-body text-sm font-extrabold">{item.title}</p>
                    <p className="font-body text-xs font-bold text-[var(--muted)]">{item.date}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(47,180,228,0.12)] px-3 py-1 font-body text-xs font-extrabold text-[#2FB4E4]">{item.status}</span>
                </div>
              ))}
            </div>
          </TeamPanel>

          <TeamPanel title="Join requests" icon={GitPullRequest}>
            <div className="space-y-3">
              {['Dev Shah wants Growth role', 'Priya N wants Backend role'].map((request) => (
                <div className="rounded-2xl bg-[var(--card-muted)] p-4 dark:bg-white/5" key={request}>
                  <p className="font-body text-sm font-extrabold">{request}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-xl bg-[#2FB4E4] px-3 py-2 font-body text-xs font-bold text-white" type="button">Accept</button>
                    <button className="rounded-xl border border-[var(--border)] px-3 py-2 font-body text-xs font-bold text-[var(--muted)] dark:border-white/10 dark:text-[var(--muted)]" type="button">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </TeamPanel>

          <TeamPanel title="Shared decisions" icon={Check}>
            <ul className="space-y-3 font-body text-sm font-semibold text-[var(--muted)] dark:text-[var(--muted)]">
              <li>Keep MVP focused on project matching and chat.</li>
              <li>Move payments and subscriptions to phase two.</li>
              <li>Use OTP email verification for first release.</li>
            </ul>
          </TeamPanel>

          <TeamPanel title="Recent updates" icon={Bell}>
            <div className="space-y-3">
              {activities.map((item) => (
                <div className="flex items-start gap-3 rounded-2xl bg-[var(--card-muted)] p-4 dark:bg-white/5" key={item}>
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2FB4E4]" />
                  <p className="font-body text-sm font-semibold text-[var(--muted)] dark:text-[var(--muted)]">{item}</p>
                </div>
              ))}
            </div>
          </TeamPanel>
        </aside>
      </div>
    </PageShell>
  )
}

function TeamPanel({ title, icon: Icon, children }) {
  return (
    <article className="rounded-[24px] border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/8">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[rgba(47,180,228,0.12)] text-[#2FB4E4] dark:bg-[#F8BC54]/20 dark:text-[#F8BC54]">
          <Icon size={21} />
        </div>
        <h2 className="font-display text-xl font-extrabold tracking-[-0.02em]">{title}</h2>
      </div>
      {children}
    </article>
  )
}

function ShowcasePage() {
  return (
    <PageShell eyebrow="Showcase" title="Completed projects deserve a premium stage." text="Feature shipped products, open-source libraries, hackathon winners, and startup launches.">
      <ProjectEcosystem />
    </PageShell>
  )
}

function DashboardPage({ currentUser }) {
  const [data, setData] = useState(() => projectService.getDashboardData(currentUser.id))

  function handleRequest(requestId, status) {
    projectService.updateJoinRequest(requestId, status)
    setData(projectService.getDashboardData(currentUser.id))
  }

  return (
    <PageShell eyebrow="Dashboard" title="Your builder operating system." text="Track projects, saved opportunities, requests, notifications, and AI recommendations.">
      <DashboardMockup />
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <DashboardSection title="My Projects" items={data.myProjects} empty="Create your first project to start finding teammates." />
        <DashboardSection title="Joined Projects" items={data.joinedProjects} empty="Accepted team projects will appear here." />
        <DashboardSection title="Saved Projects" items={data.savedProjects} empty="Save projects from browse to review later." />
        <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Pending Join Requests</h2>
          <div className="mt-5 space-y-3">
            {data.pendingRequests.slice(0, 4).map((request) => {
              const project = projectService.getProjectById(request.projectId)
              const user = userService.getUserById(request.userId)
              return (
                <div className="rounded-2xl bg-[var(--card-muted)] p-4" key={request.id}>
                  <p className="font-body text-sm font-extrabold">{user?.name || 'Builder'} wants to join {project?.name || 'a project'}</p>
                  <p className="mt-1 font-body text-xs font-semibold text-[var(--muted)]">{request.message}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-xl bg-[#2FB4E4] px-3 py-2 font-body text-xs font-bold text-white" type="button" onClick={() => handleRequest(request.id, 'accepted')}>Accept</button>
                    <button className="rounded-xl border border-[var(--border)] px-3 py-2 font-body text-xs font-bold text-[var(--muted)]" type="button" onClick={() => handleRequest(request.id, 'rejected')}>Reject</button>
                  </div>
                </div>
              )
            })}
            {data.pendingRequests.length === 0 && <p className="font-body text-sm font-semibold text-[var(--muted)]">No pending requests right now.</p>}
          </div>
        </article>
      </div>
    </PageShell>
  )
}

function DashboardSection({ title, items, empty }) {
  return (
    <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.map((project) => {
          const momentum = getProjectMomentum(project)

          return (
            <Link className="block rounded-2xl bg-[var(--card-muted)] p-4 transition hover:-translate-y-0.5" to={`/projects/${project.id}`} key={project.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-body text-sm font-extrabold text-[var(--foreground)]">{project.name}</p>
                  <p className="mt-1 font-body text-xs font-semibold text-[var(--muted)]">{project.stage} · {project.category}</p>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 font-body text-xs font-bold text-[#2FB4E4] dark:bg-white/10 dark:text-[#F8BC54]">{momentum.signal}</span>
              </div>
            </Link>
          )
        })}
        {items.length === 0 && <p className="font-body text-sm font-semibold text-[var(--muted)]">{empty}</p>}
      </div>
    </article>
  )
}

function AdminPage() {
  return (
    <PageShell eyebrow="Admin" title="Moderate the network with clarity." text="Manage users, projects, categories, reports, and platform analytics.">
      <div className="grid gap-6 md:grid-cols-4">
        {[
          ['Users', '18,240', Users],
          ['Projects', '4,802', BriefcaseBusiness],
          ['Reports', '27', ShieldCheck],
          ['Growth', '+18%', Gauge],
        ].map(([label, value, Icon]) => (
          <article className="rounded-[24px] border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/8" key={label}>
            <Icon className="text-[#2FB4E4] dark:text-[#F8BC54]" />
            <p className="mt-6 font-display text-5xl font-extrabold tracking-[-0.05em]">{value}</p>
            <p className="mt-2 font-body text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)] dark:text-[var(--muted)]">{label}</p>
          </article>
        ))}
      </div>
    </PageShell>
  )
}

function AuthPage({ mode, onAuthChange }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
  })

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      if (isRegister) {
        authService.register(form)
      } else {
        authService.login(form.email, form.password)
      }
      onAuthChange()
      navigate('/dashboard')
    } catch (caughtError) {
      setError(caughtError.message)
    }
  }

  return (
    <PageShell eyebrow={isRegister ? 'Create Account' : 'Sign In'} title={isRegister ? 'Create your builder profile.' : 'Welcome back to Build Together.'}>
      <div className="mx-auto max-w-md rounded-[24px] border border-white/60 bg-white/85 p-8 shadow-2xl shadow-[#283044]/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/8">
        <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 font-body text-sm font-bold text-[var(--foreground)] dark:border-white/10 dark:bg-white/5 dark:text-white" type="button">
          <Sparkles size={18} />
          Continue with Google
        </button>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && <FormInput label="Full name" placeholder="Your name" type="text" value={form.name} onChange={(value) => updateField('name', value)} />}
          <FormInput label="Email address" placeholder="aarav@example.com" type="email" value={form.email} onChange={(value) => updateField('email', value)} />
          <FormInput label="Password" placeholder="password123" type="password" value={form.password} onChange={(value) => updateField('password', value)} />
          {isRegister && <FormInput label="Primary skills" placeholder="React, Design, AI..." type="text" value={form.skills} onChange={(value) => updateField('skills', value)} />}
          {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 font-body text-sm font-bold text-red-500">{error}</p>}
          <button className="w-full rounded-2xl bg-[#2FB4E4] px-5 py-3.5 font-body text-sm font-bold text-white shadow-xl shadow-[#2FB4E4]/20" type="submit">
            {isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>
        {!isRegister && (
          <div className="mt-4 flex justify-between font-body text-xs font-bold">
            <Link className="text-[#2FB4E4] dark:text-[#F8BC54]" to="/forgot-password">Forgot password?</Link>
            <Link className="text-[#2FB4E4] dark:text-[#F8BC54]" to="/verify-email">Verify email</Link>
          </div>
        )}
        <p className="mt-5 text-center font-body text-sm font-semibold text-[var(--muted)] dark:text-[var(--muted)]">
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <Link className="font-bold text-[#2FB4E4] dark:text-[#F8BC54]" to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </div>
    </PageShell>
  )
}

function CreateProjectPage({ currentUser }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Beginner',
    stage: 'Idea',
    teamSize: 4,
    requiredSkills: '',
    banner: '',
  })

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const project = projectService.createProject(form, currentUser.id)
    navigate(`/projects/${project.id}`)
  }

  return (
    <PageShell eyebrow="Create Project" title="Launch a project teammates can believe in." text="Describe the mission, team size, required skills, and current stage.">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <form className="rounded-[24px] border border-white/60 bg-white/85 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/8" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <FormInput label="Project name" placeholder="Example: AI Study Planner" type="text" value={form.name} onChange={(value) => updateField('name', value)} />
            <label>
              <span className="mb-2 block font-body text-sm font-bold text-[var(--foreground)] dark:text-white">Description</span>
              <textarea className="min-h-36 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] px-4 py-3 font-body text-sm font-semibold text-[var(--foreground)] outline-none transition focus:border-[#2FB4E4] focus:ring-4 focus:ring-[#F8BC54]/30 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="What are you building?" value={form.description} onChange={(event) => updateField('description', event.target.value)} required />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <FilterSelect label="Category" value={form.category} onChange={(value) => updateField('category', value)} options={['Web Development', 'Mobile Apps', 'AI / ML', 'Data Science', 'Open Source', 'Startup', 'Hackathon']} />
              <FormInput label="Team size" placeholder="6" type="number" value={form.teamSize} onChange={(value) => updateField('teamSize', value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FilterSelect label="Difficulty" value={form.difficulty} onChange={(value) => updateField('difficulty', value)} options={['Beginner', 'Intermediate', 'Advanced']} />
              <FilterSelect label="Stage" value={form.stage} onChange={(value) => updateField('stage', value)} options={['Idea', 'Planning', 'Building', 'Testing', 'Launched']} />
            </div>
            <FormInput label="Required skills" placeholder="React, Node.js, UX Research" type="text" value={form.requiredSkills} onChange={(value) => updateField('requiredSkills', value)} />
            <FormInput label="Banner text" placeholder="Short project banner description" type="text" value={form.banner} onChange={(value) => updateField('banner', value)} />
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-4 dark:border-white/10 dark:bg-white/5">
              <p className="font-body text-sm font-extrabold text-[var(--foreground)] dark:text-white">Team room will include</p>
              <div className="mt-3 grid gap-2 font-body text-sm font-semibold text-[var(--muted)] dark:text-[var(--muted)] sm:grid-cols-2">
                <span className="flex items-center gap-2"><MessageCircle size={16} /> Team chat</span>
                <span className="flex items-center gap-2"><CalendarDays size={16} /> Milestones</span>
                <span className="flex items-center gap-2"><GitPullRequest size={16} /> Join requests</span>
                <span className="flex items-center gap-2"><Check size={16} /> Decisions</span>
              </div>
            </div>
            <button className="rounded-2xl bg-[#2FB4E4] px-5 py-3.5 font-body text-sm font-bold text-white shadow-xl shadow-[#2FB4E4]/20" type="submit">Publish project</button>
          </div>
        </form>
        <article className="rounded-[24px] bg-[var(--foreground)] p-8 text-white">
          <Lock />
          <h2 className="mt-6 font-display text-4xl font-extrabold tracking-[-0.04em]">Great posts are specific.</h2>
          <p className="mt-4 font-body leading-7 text-[#b7c8e1]">Add milestones, team roles, and why the project matters. Better inputs create better matches.</p>
        </article>
      </div>
    </PageShell>
  )
}

function ProjectDetailsPage({ currentUser }) {
  const { projectId } = useParams()
  const [project, setProject] = useState(() => projectService.getProjectById(projectId))
  const [message, setMessage] = useState('I like this idea and want to help build it.')
  const [notice, setNotice] = useState('')

  if (!project) {
    return (
      <PageShell eyebrow="Project" title="Project not found." text="This project may have been removed or the link is incorrect.">
        <Link className="gradient-bg rounded-full px-5 py-3 font-body text-sm font-bold" to="/discover">Browse projects</Link>
      </PageShell>
    )
  }

  const owner = userService.getUserById(project.ownerId)
  const members = project.memberIds?.map((id) => userService.getUserById(id)).filter(Boolean) || []
  const momentum = getProjectMomentum(project)

  function handleSave() {
    if (!currentUser) {
      setNotice('Please sign in to save this project.')
      return
    }
    setProject(projectService.saveProject(project.id, currentUser.id))
    setNotice('Project saved to your dashboard.')
  }

  function handleApply(event) {
    event.preventDefault()
    if (!currentUser) {
      setNotice('Please sign in to request joining.')
      return
    }
    try {
      projectService.applyToProject(project.id, currentUser.id, message)
      setNotice('Join request sent.')
    } catch (error) {
      setNotice(error.message)
    }
  }

  return (
    <PageShell eyebrow={project.category} title={project.name} text={project.description}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="overflow-hidden rounded-[24px] bg-[var(--card-muted)]">
            <div className="flex flex-col justify-between gap-5 p-8 md:flex-row md:items-start">
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-[#2FB4E4] dark:text-[#F8BC54]">{project.banner}</p>
                <h2 className="mt-5 max-w-xl font-display text-4xl font-extrabold tracking-[-0.04em]">{momentum.signal} mode</h2>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-right shadow-sm">
                <p className="font-body text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Crew needed</p>
                <p className="mt-1 font-body text-sm font-extrabold text-[#2FB4E4] dark:text-[#F8BC54]">{momentum.openSeats ? `${momentum.openSeats} open` : 'Team filled'}</p>
              </div>
            </div>
            <div className="border-t border-[var(--border)] bg-[var(--card)]/50 p-5 dark:bg-white/5">
              <div className="grid grid-cols-4 gap-2">
                {['Idea', 'Plan', 'Build', 'Ship'].map((step, index) => (
                  <div className="min-w-0" key={step}>
                    <span className={`block h-2 rounded-full ${index < momentum.activeSteps ? 'bg-[#2FB4E4] shadow-sm shadow-[#2FB4E4]/30 dark:bg-[#F8BC54] dark:shadow-[#F8BC54]/30' : 'bg-black/5 dark:bg-white/10'}`} />
                    <span className="mt-3 block truncate font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ['Stage', project.stage],
              ['Difficulty', project.difficulty],
              ['Team size', `${members.length}/${project.teamSize}`],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-4" key={label}>
                <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
                <p className="mt-2 font-body text-sm font-extrabold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="font-display text-2xl font-bold tracking-[-0.03em]">Required skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.requiredSkills.map((skill) => <span className="rounded-xl bg-[rgba(47,180,228,0.12)] px-3 py-1.5 font-body text-xs font-bold text-[#2FB4E4]" key={skill}>{skill}</span>)}
            </div>
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Project owner</h2>
            <Link className="mt-4 flex items-center gap-3 rounded-2xl bg-[var(--card-muted)] p-4" to={`/profile/${owner?.id}`}>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2FB4E4] font-display font-bold text-white">{owner?.avatar}</span>
              <span>
                <span className="block font-body text-sm font-extrabold">{owner?.name}</span>
                <span className="block font-body text-xs font-semibold text-[var(--muted)]">{owner?.role}</span>
              </span>
            </Link>
          </article>
          <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Team members</h2>
            <div className="mt-4 space-y-2">
              {members.map((member) => (
                <Link className="flex items-center justify-between rounded-2xl bg-[var(--card-muted)] p-3 font-body text-sm font-bold" to={`/profile/${member.id}`} key={member.id}>
                  {member.name}
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </article>
          <form className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm" onSubmit={handleApply}>
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Join this project</h2>
            <textarea className="mt-4 min-h-28 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] px-4 py-3 font-body text-sm font-semibold text-[var(--foreground)] outline-none" value={message} onChange={(event) => setMessage(event.target.value)} />
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="gradient-bg rounded-full px-5 py-3 font-body text-xs font-bold" type="submit">Request to join</button>
              <button className="rounded-full border border-[var(--border)] px-5 py-3 font-body text-xs font-bold" type="button" onClick={handleSave}>Save project</button>
            </div>
            {notice && <p className="mt-4 font-body text-sm font-bold text-[var(--muted)]">{notice}</p>}
          </form>
        </aside>
      </div>
    </PageShell>
  )
}

function ProfilePage({ currentUser }) {
  const { userId } = useParams()
  const user = userService.getUserById(userId || currentUser?.id)
  const stats = user ? userService.getProfileStats(user.id) : null
  const userProjects = user ? projectService.getProjects().filter((project) => project.ownerId === user.id || project.memberIds?.includes(user.id)) : []

  if (!user) return <Navigate to="/login" replace />

  return (
    <PageShell eyebrow={`@${user.username}`} title={user.name} text={user.bio}>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-[#2FB4E4] font-display text-3xl font-bold text-white">{user.avatar}</span>
          <p className="mt-5 font-body text-sm font-extrabold">{user.role} · {user.experienceLevel}</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {Object.entries(stats).map(([label, value]) => (
              <div className="rounded-2xl bg-[var(--card-muted)] p-3 text-center" key={label}>
                <p className="font-display text-2xl font-bold">{value}</p>
                <p className="font-body text-xs font-bold capitalize text-[var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {user.skills.map((skill) => <span className="rounded-xl bg-[rgba(47,180,228,0.12)] px-3 py-1.5 font-body text-xs font-bold text-[#2FB4E4]" key={skill}>{skill}</span>)}
          </div>
        </article>
        <DashboardSection title="Projects Created or Joined" items={userProjects} empty="No projects yet." />
      </div>
    </PageShell>
  )
}

function NotificationsPage({ currentUser }) {
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications(currentUser.id))

  function markRead() {
    setNotifications(notificationService.markAllRead(currentUser.id))
  }

  return (
    <PageShell eyebrow="Notifications" title="Stay updated on requests and team activity." action={<button className="rounded-full border border-[var(--border)] px-5 py-3 font-body text-sm font-bold" type="button" onClick={markRead}>Mark all read</button>}>
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <article className="rounded-[22px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm" key={notification.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-body text-sm font-extrabold">{notification.title}</p>
                <p className="mt-2 font-body text-sm leading-6 text-[var(--muted)]">{notification.message}</p>
              </div>
              {!notification.read && <span className="h-2.5 w-2.5 rounded-full bg-[#2FB4E4]" />}
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}

function SettingsPage({ currentUser, onAuthChange }) {
  const [form, setForm] = useState({
    name: currentUser.name,
    bio: currentUser.bio,
    skills: currentUser.skills?.join(', ') || '',
    github: currentUser.github || '',
    linkedin: currentUser.linkedin || '',
  })
  const [saved, setSaved] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    authService.updateProfile(currentUser.id, {
      ...form,
      skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
    })
    onAuthChange()
    setSaved(true)
  }

  return (
    <PageShell eyebrow="Settings" title="Keep your builder profile sharp." text="Skills, links, and a clear bio improve teammate recommendations.">
      <form className="mx-auto max-w-2xl rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <FormInput label="Full name" placeholder="Your name" type="text" value={form.name} onChange={(value) => updateField('name', value)} />
          <label>
            <span className="mb-2 block font-body text-sm font-bold text-[var(--foreground)] dark:text-white">Bio</span>
            <textarea className="min-h-28 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] px-4 py-3 font-body text-sm font-semibold text-[var(--foreground)] outline-none" value={form.bio} onChange={(event) => updateField('bio', event.target.value)} />
          </label>
          <FormInput label="Skills" placeholder="React, Node.js, Design" type="text" value={form.skills} onChange={(value) => updateField('skills', value)} />
          <FormInput label="GitHub" placeholder="https://github.com/you" type="url" value={form.github} onChange={(value) => updateField('github', value)} />
          <FormInput label="LinkedIn" placeholder="https://linkedin.com/in/you" type="url" value={form.linkedin} onChange={(value) => updateField('linkedin', value)} />
          <button className="gradient-bg rounded-2xl px-5 py-3.5 font-body text-sm font-bold" type="submit">Save settings</button>
          {saved && <p className="font-body text-sm font-bold text-[var(--muted)]">Profile updated.</p>}
        </div>
      </form>
    </PageShell>
  )
}

function ForgotPasswordPage() {
  return (
    <PageShell eyebrow="Password Help" title="Reset password mock flow." text="No database is used in this MVP, so this screen demonstrates the user experience only.">
      <div className="mx-auto max-w-md rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <FormInput label="Email address" placeholder="you@example.com" type="email" />
        <button className="gradient-bg mt-4 w-full rounded-2xl px-5 py-3.5 font-body text-sm font-bold" type="button">Send reset link</button>
      </div>
    </PageShell>
  )
}

function VerifyEmailPage() {
  return (
    <PageShell eyebrow="Email Verification" title="Verify your builder account." text="Mock OTP flow for the no-database MVP. Real email delivery can be connected later.">
      <div className="mx-auto max-w-md rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <FormInput label="Verification code" placeholder="123456" type="text" />
        <button className="gradient-bg mt-4 w-full rounded-2xl px-5 py-3.5 font-body text-sm font-bold" type="button">Verify account</button>
      </div>
    </PageShell>
  )
}

function PageShell({ eyebrow, title, text, children, action, compact = false }) {
  return (
    <section className={`min-h-[70vh] px-4 md:px-12 ${compact ? 'py-10' : 'py-16'}`}>
      <div className="mx-auto max-w-[1280px]">
        <div className={`${compact ? 'mb-8' : 'mb-12'} flex flex-col justify-between gap-6 md:flex-row md:items-end`}>
          <div>
            <p className="mb-3 font-body text-xs font-extrabold uppercase tracking-[0.18em] text-[#2FB4E4] dark:text-[#F8BC54]">{eyebrow}</p>
            <h1 className={`max-w-3xl font-display font-extrabold leading-tight tracking-[-0.04em] ${compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl'}`}>{title}</h1>
            {text && <p className={`${compact ? 'mt-3 text-sm leading-6' : 'mt-5 text-lg leading-8'} max-w-2xl font-body text-[var(--muted)] dark:text-[var(--muted)]`}>{text}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  )
}

function SectionHeading({ title, text, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] md:text-5xl">{title}</h2>
      {text && <p className="mt-4 font-body leading-7 text-[var(--muted)] dark:text-[var(--muted)]">{text}</p>}
    </div>
  )
}

function SearchBox({ value = '', onChange = () => {} }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <Search size={18} className="text-[var(--muted)]" />
      <input className="w-full min-w-0 bg-transparent font-body text-sm font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] dark:text-white" placeholder="Search AI, startup, design..." value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}

function FormInput({ label, placeholder, type, value, onChange }) {
  return (
    <label>
      <span className="mb-2 block font-body text-sm font-bold text-[var(--foreground)] dark:text-white">{label}</span>
      <input
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] px-4 py-3 font-body text-sm font-semibold text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#2FB4E4] focus:bg-white focus:ring-4 focus:ring-[#F8BC54]/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        placeholder={placeholder}
        type={type}
        value={value}
        required
      />
    </label>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-10">
        <div className="flex flex-col gap-6 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
          <Link className="font-heading text-2xl font-bold tracking-[-0.04em] text-[var(--foreground)]" to="/">
            BuildTogether
          </Link>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 font-body text-sm font-semibold text-[var(--muted)]">
            {[
              ['Projects', '/discover'],
              ['Matches', '/matches'],
              ['Team Room', '/team-room'],
              ['Dashboard', '/dashboard'],
              ['Contact', '/login'],
            ].map(([label, path]) => (
              <Link className="transition hover:text-[var(--foreground)]" key={label} to={path}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-5 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-xl font-body text-sm leading-6 text-[var(--muted)]">
            Find teammates, create project rooms, chat with your team, and ship ideas with clarity.
          </p>

          <div className="flex items-center gap-4">
            <a className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:text-[var(--foreground)]" href="/" aria-label="Share">
              <Share2 size={17} />
            </a>
            <a className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:text-[var(--foreground)]" href="/" aria-label="Website">
              <Globe2 size={17} />
            </a>
            <span className="font-body text-sm font-semibold text-[var(--muted)]">© 2026 Build Together</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

