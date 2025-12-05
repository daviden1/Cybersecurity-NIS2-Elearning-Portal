'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const router = useRouter()

  const courses = [
    { title: 'Conformità NIS2: Fondamenti', progress: 40, id: '1' },
    { title: 'Gestione Incidenti & Reporting', progress: 0, id: '2' },
    { title: 'Framework di Sicurezza per PMI', progress: 80, id: '3' },
  ]

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500" />
          <div>
            <h1 className="text-xl font-bold">Portale Formazione Cybersecurity</h1>
            <p className="text-sm text-slate-300">
              Benvenuto, {profile?.full_name || user?.email}
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <button 
            className="btn-secondary"
            onClick={() => router.push('/dashboard/certificates')}
          >
            I Miei Certificati
          </button>
          <span className="text-sm text-slate-300">
            {profile?.company_name || 'Azienda'}
          </span>
          <button className="btn-secondary">Assistenza</button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Dashboard Corsi</h2>
          <button 
            className="btn-primary"
            onClick={() => router.push('/dashboard/courses')}
          >
            Vedi Tutti i Corsi
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="card">
              <h3 className="font-semibold">{course.title}</h3>
              <div className="mt-3">
                <div className="h-2 w-full bg-white/10 rounded">
                  <div
                    className="h-2 bg-emerald-500 rounded"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-300 mt-2">
                  Avanzamento: {course.progress}%
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  className="btn-primary flex-1"
                  onClick={() => router.push('/dashboard/courses')}
                >
                  {course.progress > 0 ? 'Continua' : 'Inizia'}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => router.push('/dashboard/courses')}
                >
                  Dettagli
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
