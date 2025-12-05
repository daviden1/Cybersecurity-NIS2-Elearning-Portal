import { createClient } from '@/lib/supabase/client'
import { Database } from '@/database.types'

type Certificate = Database['public']['Tables']['certificates']['Row']

export async function generateCertificate(
  userId: string,
  courseId: string
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('certificates')
    .insert({
      user_id: userId,
      course_id: courseId
    })
    .select(`
      *,
      courses!inner(
        title
      ),
      user_profiles!inner(
        full_name,
        company_name
      )
    `)
    .single()
  
  return { data, error }
}

export async function getUserCertificates(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      courses!inner(
        title,
        description
      )
    `)
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })
  
  return { data, error }
}

export async function getCertificateByCode(verificationCode: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      courses!inner(
        title,
        description
      ),
      user_profiles!inner(
        full_name,
        company_name
      )
    `)
    .eq('verification_code', verificationCode)
    .single()
  
  return { data, error }
}
