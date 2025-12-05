import { createClient } from '@/lib/supabase/client'
import { Database } from '@/database.types'

type Course = Database['public']['Tables']['courses']['Row']
type Enrollment = Database['public']['Tables']['enrollments']['Row']
type Quiz = Database['public']['Tables']['quizzes']['Row']
type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row']
type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row']

export async function getCourses() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getCourseWithEnrollment(courseId: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      enrollments!inner(
        id,
        progress_percentage,
        completed_at
      ),
      quizzes(
        id,
        title,
        passing_score
      )
    `)
    .eq('id', courseId)
    .eq('enrollments.user_id', userId)
    .single()
  
  return { data, error }
}

export async function enrollInCourse(courseId: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('enrollments')
    .upsert({
      course_id: courseId,
      user_id: userId,
      progress_percentage: 0
    })
    .select()
    .single()
  
  return { data, error }
}

export async function updateProgress(enrollmentId: string, progress: number) {
  const supabase = createClient()
  const updateData: any = { progress_percentage: progress }
  
  if (progress >= 100) {
    updateData.completed_at = new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('enrollments')
    .update(updateData)
    .eq('id', enrollmentId)
    .select()
    .single()
  
  return { data, error }
}

export async function getQuizWithQuestions(quizId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_questions(
        id,
        question,
        options,
        correct_answer
      )
    `)
    .eq('id', quizId)
    .single()
  
  return { data, error }
}

export async function submitQuizAttempt(
  quizId: string, 
  userId: string, 
  answers: number[]
) {
  const supabase = createClient()
  
  // First get the quiz questions to calculate score
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('correct_answer')
    .eq('quiz_id', quizId)
  
  if (questionsError) return { data: null, error: questionsError }
  
  // Calculate score
  let correctAnswers = 0
  answers.forEach((answer, index) => {
    if (questions && questions[index] && answer === questions[index].correct_answer) {
      correctAnswers++
    }
  })
  
  const score = Math.round((correctAnswers / answers.length) * 100)
  const passed = score >= 70 // Default passing score
  
  // Submit attempt
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id: quizId,
      user_id: userId,
      score,
      passed,
      answers
    })
    .select()
    .single()
  
  return { data, error }
}

export async function getQuizAttempts(quizId: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('quiz_id', quizId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}
