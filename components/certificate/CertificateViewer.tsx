'use client'

import { useState, useEffect } from 'react'
import { generateCertificate, getUserCertificates } from '@/lib/certificate'
import { useAuth } from '@/lib/auth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface CertificateViewerProps {
  courseId: string
  courseTitle: string
  onGenerated?: () => void
}

export function CertificateViewer({ courseId, courseTitle, onGenerated }: CertificateViewerProps) {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

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

  const handleGenerateCertificate = async () => {
    if (!user) return

    setGenerating(true)
    try {
      const { data, error } = await generateCertificate(user.id, courseId)
      if (error) throw error

      if (data) {
        setCertificates(prev => [data, ...prev])
        onGenerated?.()
      }
    } catch (error) {
      console.error('Error generating certificate:', error)
      alert('Errore durante la generazione del certificato')
    } finally {
      setGenerating(false)
    }
  }

  const courseCertificate = certificates.find(cert => cert.course_id === courseId)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (courseCertificate) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-emerald-400 text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">Certificato Rilasciato!</h3>
          <p className="text-slate-300 mb-4">
            Hai completato con successo il corso "{courseTitle}"
          </p>
          
          <div className="bg-slate-800 rounded-lg p-4 mb-4 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Numero Certificato:</span>
                <p className="font-mono text-emerald-400">{courseCertificate.certificate_number}</p>
              </div>
              <div>
                <span className="text-slate-400">Codice Verifica:</span>
                <p className="font-mono text-emerald-400">{courseCertificate.verification_code}</p>
              </div>
              <div>
                <span className="text-slate-400">Data Rilascio:</span>
                <p>{new Date(courseCertificate.issued_at).toLocaleDateString('it-IT')}</p>
              </div>
              <div>
                <span className="text-slate-400">Stato:</span>
                <p className="text-emerald-400">Valido</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button className="btn-primary">
              Scarica PDF
            </button>
            <button className="btn-secondary">
              Condividi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="text-center">
        <div className="text-slate-400 text-4xl mb-4">🎓</div>
        <h3 className="text-lg font-semibold mb-2">Ottieni il Tuo Certificato</h3>
        <p className="text-slate-300 mb-6">
          Completa il corso e supera il quiz finale per ricevere il tuo certificato di completamento.
        </p>
        
        <button
          className="btn-primary"
          onClick={handleGenerateCertificate}
          disabled={generating}
        >
          {generating ? (
            <>
              <LoadingSpinner />
              Generazione in corso...
            </>
          ) : (
            'Genera Certificato'
          )}
        </button>
      </div>
    </div>
  )
}
