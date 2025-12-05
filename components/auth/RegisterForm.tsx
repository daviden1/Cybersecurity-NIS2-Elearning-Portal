'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signUp(email, password, {
      full_name: fullName,
      company_name: companyName,
      role: 'student'
    })
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-emerald-400">
          <h3 className="font-semibold mb-2">Registrazione completata!</h3>
          <p className="text-sm">
            Controlla la tua email per confermare l'account. Potrai accedere dopo la verifica.
          </p>
        </div>
        <button 
          className="btn-secondary w-full" 
          onClick={() => window.location.reload()}
        >
          Torna al login
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="label">Nome Completo</label>
        <input 
          className="input" 
          type="text" 
          placeholder="es. Mario Rossi"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label">Nome Azienda</label>
        <input 
          className="input" 
          type="text" 
          placeholder="es. Acme S.p.A."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label">Email aziendale</label>
        <input 
          className="input" 
          type="email" 
          placeholder="es. sicurezza@azienda.it"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label">Crea Password</label>
        <input 
          className="input" 
          type="password" 
          placeholder="Almeno 12 caratteri"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={12}
        />
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      <button 
        className="btn-primary w-full" 
        type="submit" 
        disabled={loading}
      >
        {loading ? 'Registrazione in corso...' : 'Crea account'}
      </button>
      <p className="text-xs text-slate-400">
        L'account amministratore potrà invitare altri utenti del team.
      </p>
    </form>
  )
}
