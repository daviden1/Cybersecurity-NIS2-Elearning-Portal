'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    }
    
    setLoading(false)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="label">Email o Username</label>
        <input 
          className="input" 
          type="email" 
          placeholder="es. nome@azienda.it"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input 
          className="input" 
          type="password" 
          placeholder="Inserisci la password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" className="accent-emerald-500" /> Ricordami
        </label>
        <a href="#" className="text-sm text-emerald-400 hover:text-emerald-300">
          Password dimenticata?
        </a>
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
        {loading ? 'Accesso in corso...' : 'Accedi in modo sicuro'}
      </button>
      <p className="text-xs text-slate-400">
        Accesso protetto. 2FA richiesto per i clienti aziendali.
      </p>
    </form>
  )
}
