'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database } from '@/database.types'
import { useRouter } from 'next/navigation'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
signUp: (email: string, password: string, metadata: any, redirectUrl?: string) => Promise<{ error: any }>  signOut: () => Promise<void>
  requires2FA: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [requires2FA, setRequires2FA] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
          setProfile(null)
        } else {
          setUser(session?.user ?? null)
          
          if (session?.user) {
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            
            if (!mounted) return
            
            if (profileError) {
              console.error('Error getting profile:', profileError)
              setProfile(null)
            } else {
              setProfile(profileData)
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error in getSession:', error)
        if (mounted) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        try {
          console.log(`Auth state changed: ${event}`)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            
            if (!mounted) return
            
            if (profileError) {
              console.error('Error getting profile on auth change:', profileError)
              setProfile(null)
            } else {
              setProfile(profileData)
            }
            
            // Redirect to dashboard after successful login
            if (event === 'SIGNED_IN') {
              router.push('/dashboard')
            }
          } else {
            setProfile(null)
          }
        } catch (error) {
          console.error('Unexpected error in auth state change:', error)
          if (mounted) {
            setUser(null)
            setProfile(null)
          }
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Unexpected error in signIn:', error)
      return { error: { message: 'Errore durante l\'accesso' } }
    }
  }

  const signUp = async (email: string, password: string, metadata: any, redirectUrl?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        emailRedirectTo: redirectUrl
        }
      })
      return { error }
    } catch (error) {
      console.error('Unexpected error in signUp:', error)
      return { error: { message: 'Errore durante la registrazione' } }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Unexpected error in signOut:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      requires2FA
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
