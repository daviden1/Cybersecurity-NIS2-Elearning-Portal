'use client'

import { useAuth } from '@/lib/auth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && !requireAuth) {
      // If user is authenticated but auth is not required, redirect to dashboard
      router.push('/dashboard')
    }
  }, [user, loading, requireAuth, router])

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-slate-300 flex items-center gap-3">
          <LoadingSpinner />
          Caricamento...
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    // Redirect to login page instead of rendering LoginForm inline
    router.push('/login')
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-slate-300 flex items-center gap-3">
          <LoadingSpinner />
          Reindirizzamento al login...
        </div>
      </div>
    )
  }

  return <>{children}</>
}
