'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getUserCertificates } from '@/lib/certificate'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function CertificatesPage() {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return

      try {
        const { data, error } = await getUserCertificates(user.id)
        if (error) throw error
        setCertificates(data || [])
      } catch (error) {
        console.error('Error fetching certificates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-slate-300 flex items-center gap-3">
          <LoadingSpinner />
          Caricamento certificati...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-2">I Miei Certificati</h1>
        <p className="text-slate-300">
          Visualizza e gestisci i certificati ottenuti completando i corsi
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {certificates.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-slate-400 text-4xl mb-4">🎓</div>
            <h3 className="text-lg font-semibold mb-2">Nessun Certificato Ancora</h3>
            <p className="text-slate-300 mb-6">
              Completa i corsi e supera i quiz finali per ottenere i tuoi certificati.
            </p>
            <a 
              href="/dashboard/courses"
              className="btn-primary inline-block"
            >
              Vedi Corsi Disponibili
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="card">
                <div className="text-center">
                  <div className="text-emerald-400 text-4xl mb-4">🏆</div>
                  <h3 className="font-semibold mb-2">{cert.courses.title}</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    {cert.courses.description}
                  </p>
                  
                  <div className="bg-slate-800 rounded-lg p-3 mb-4 text-left text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Numero:</span>
                        <span className="font-mono text-emerald-400 text-xs">
                          {cert.certificate_number}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Verifica:</span>
                        <span className="font-mono text-emerald-400 text-xs">
                          {cert.verification_code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rilasciato:</span>
                        <span>{new Date(cert.issued_at).toLocaleDateString('it-IT')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn-primary flex-1 text-sm">
                      Scarica PDF
                    </button>
                    <button className="btn-secondary text-sm">
                      Condividi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
