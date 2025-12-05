'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-lg bg-emerald-500" />
            <div>
              <h1 className="text-xl font-bold">Portale Formazione Cybersecurity</h1>
              <p className="text-sm text-slate-300">Conformità NIS2 • Sicurezza per imprese</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 ${tab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Accedi
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 ${tab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Registrati
            </button>
          </div>

          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  )
}
