'use client'

import { AuthGuard } from '@/components/AuthGuard'
import { LoginForm } from '@/components/auth/LoginForm'

export default function Home() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen p-6">
        <header className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500" />
            <div>
              <h1 className="text-xl font-bold">Portale Formazione Cybersecurity</h1>
              <p className="text-sm text-slate-300">Conformità NIS2 • Sicurezza per imprese</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a className="nav-link" href="#corsi">Corsi</a>
            <a className="nav-link" href="#funzioni">Funzioni</a>
            <a className="nav-link" href="#contatti">Contatti</a>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2 card">
            <h2 className="text-2xl font-bold mb-2">Benvenuto</h2>
            <p className="text-slate-300 mb-6">
              Accedi al tuo portale aziendale per seguire i corsi di formazione su NIS2, 
              migliori pratiche di sicurezza, e framework di conformità. Interfaccia moderna, 
              totalmente in italiano, ottimizzata per dispositivi mobili.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card">
                <h3 className="font-semibold text-lg">Corsi Interattivi</h3>
                <p className="text-slate-300 text-sm mt-2">
                  Lezioni con video, quiz finali e tracciamento avanzamento in tempo reale.
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-lg">Supporto Dedicato</h3>
                <p className="text-slate-300 text-sm mt-2">
                  Pulsante "Assistenza" sempre visibile per chat live o ticket.
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-lg">Certificazioni</h3>
                <p className="text-slate-300 text-sm mt-2">
                  Certificati di completamento al raggiungimento del 100% del corso.
                </p>
              </div>
            </div>
          </section>

          <aside className="card">
            <LoginForm />
          </aside>
        </main>

        <section id="corsi" className="max-w-6xl mx-auto mt-8 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Dashboard Corsi</h2>
            <button className="btn-secondary">Assistenza / Supporto</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Conformità NIS2: Fondamenti', progress: 40 },
              { title: 'Gestione Incidenti & Reporting', progress: 0 },
              { title: 'Framework di Sicurezza per PMI', progress: 80 },
            ].map((c, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold">{c.title}</h3>
                <div className="mt-3">
                  <div className="h-2 w-full bg-white/10 rounded">
                    <div
                      className="h-2 bg-emerald-500 rounded"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-300 mt-2">
                    Avanzamento: {c.progress}%
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn-primary flex-1">Continua</button>
                  <button className="btn-secondary">Dettagli</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="funzioni" className="max-w-6xl mx-auto mt-8 card">
          <h2 className="text-xl font-bold mb-2">Funzioni Principali</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-300">
            <li className="card">Autenticazione sicura con 2FA (OTP / hardware token)</li>
            <li className="card">Hosting video sicuro</li>
            <li className="card">Feedback e valutazioni dei corsi</li>
            <li className="card">Quiz finale con punteggio</li>
            <li className="card">Certificato al 100% completamento</li>
            <li className="card">Pannello admin per gestione corsi</li>
          </ul>
        </section>

        <footer id="contatti" className="max-w-6xl mx-auto mt-8 p-6">
          <div className="card">
            <p className="text-slate-300">
              Hai bisogno di aiuto? Clicca su "Assistenza / Supporto" o contattaci via email.
            </p>
            <div className="mt-4 flex gap-2">
              <button className="btn-primary">Assistenza / Supporto</button>
              <button className="btn-secondary">Invia Feedback</button>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              © {new Date().getFullYear()} Portale Formazione Cybersecurity • Conforme a GDPR/NIS2
            </p>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}
