import { createClient } from '@/lib/supabase/client'
import { Database } from '@/database.types'

type Feedback = Database['public']['Tables']['feedback']['Row']

export async function submitFeedback(
  courseId: string,
  userId: string,
  rating: number,
  comment?: string
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      course_id: courseId,
      user_id: userId,
      rating,
      comment
    })
    .select()
    .single()
  
  return { data, error }
}

export async function getCourseFeedback(courseId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('feedback')
    .select(`
      *,
      user_profiles!inner(
        full_name,
        company_name
      )
    `)
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getUserFeedback(courseId: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}
