import { ProjectCard } from './components/ProjectCard'

const projects = [
  {
    id: '01',
    name: 'Todo App',
    description:
      'Offline-first todo list with Background Sync. Todos created offline are queued in IndexedDB and sync automatically when connectivity returns.',
    themeColor: '#3b82f6',
    tags: ['Service Worker', 'Background Sync', 'IndexedDB'],
    href: '#',
  },
  {
    id: '02',
    name: 'Weather App',
    description:
      'Real-time weather with offline fallback. A Network-First service worker serves fresh API data when online and falls back to a 30-minute IndexedDB cache when offline.',
    themeColor: '#0ea5e9',
    tags: ['Service Worker', 'Network-First', 'Geolocation', 'IndexedDB'],
    href: '#',
  },
] as const

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <header className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Learning Series
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            PWA Mastery
          </h1>
          <p className="mx-auto max-w-xl text-base text-slate-400">
            A collection of offline-first Progressive Web Apps exploring Service Workers, caching
            strategies, and native browser APIs.
          </p>
        </header>

        <main>
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map(project => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </main>

        <footer className="mt-20 text-center text-xs text-slate-600">
          Built with React · TypeScript · Tailwind · Vite
        </footer>
      </div>
    </div>
  )
}
