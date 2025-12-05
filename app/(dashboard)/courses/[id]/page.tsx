'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { getCourseWithEnrollment, updateProgress, getQuizWithQuestions, submitQuizAttempt } from '@/lib/courses'
import { getUserFeedback } from '@/lib/feedback'
import { VideoPlayer } from '@/components/courses/VideoPlayer'
import { QuizComponent } from '@/components/courses/QuizComponent'
import { FeedbackForm } from '@/components/feedback/FeedbackForm'
import { FeedbackList } from '@/components/feedback/FeedbackList'
import { CertificateViewer } from '@/components/certificate/CertificateViewer'
import { LiveChat } from '@/components/support/LiveChat'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [quiz, setQuiz] = useState<any>(null)
  const [userFeedback, setUserFeedback] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)
  const [submittingQuiz, setSubmittingQuiz] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'feedback' | 'certificate'>('content')

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user || !params.id) return

      try {
        const { data, error } = await getCourseWithEnrollment(params.id as string, user.id)
        if (error) throw error

        setCourse(data)

        // Fetch user feedback
        const { data: feedbackData } = await getUserFeedback(params.id as string, user.id)
        setUserFeedback(feedbackData)

        // If course is 100% complete, fetch quiz
        if (data?.enrollments[0]?.progress_percentage >= 100 && data?.quizzes[0]) {
          const { data: quizData, error: quizError } = await getQuizWithQuestions(data.quizzes[0].id)
          if (quizError) throw quizError
          setQuiz(quizData)
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        router.push('/dashboard/courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [user, params.id, router])

  const handleVideoProgress = async (progress: number) => {
    if (!course?.enrollments[0]) return

    try {
      await updateProgress(course.enrollments[0].id, Math.round(progress))
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleVideoComplete = async () => {
    if (!course?.enrollments[0]) return

    try {
      await updateProgress(course.enrollments[0].id, 100)
      
      // Fetch quiz after completion
      if (course?.quizzes[0]) {
        const { data: quizData, error: quizError } = await getQuizWithQuestions(course.quizzes[0].id)
        if (!quizError) {
          setQuiz(quizData)
          setShowQuiz(true)
        }
      }
    } catch (error) {
      console.error('Error completing course:', error)
    }
  }

  const handleQuizSubmit = async (answers: number[]) => {
    if (!user || !quiz) return

    setSubmittingQuiz(true)
    try {
      const { data, error } = await submitQuizAttempt(quiz.id, user.id, answers)
      if (error) throw error

      // Update quiz component with score
      setQuiz({ ...quiz, score: data?.score })
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Errore durante l\'invio del quiz')
    } finally {
      setSubmittingQuiz(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-slate-300 flex items-center gap-3">
          <LoadingSpinner />
          Caricamento corso...
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2">Corso non trovato</h3>
          <p className="text-slate-300 mb-4">
            Il corso richiesto non è disponibile o non hai l'accesso.
          </p>
          <button 
            className="btn-primary"
            onClick={() => router.push('/dashboard/courses')}
          >
            Torna ai Corsi
          </button>
        </div>
      </div>
    )
  }

  const enrollment = course.enrollments[0]
  const hasCompletedCourse = enrollment.progress_percentage >= 100
  const hasPassedQuiz = quiz?.score && quiz.score >= (quiz.passing_score || 70)

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-6xl mx-auto mb-8">
        <button 
          className="btn-secondary mb-4"
          onClick={() => router.push('/dashboard/courses')}
        >
          ← Torna ai Corsi
        </button>
        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <div className="flex items-center gap-4 text-sm text-slate-300">
          <span>Avanzamento: {enrollment.progress_percentage}%</span>
          {enrollment.completed_at && (
            <span className="text-emerald-400">Completato il {new Date(enrollment.completed_at).toLocaleDateString('it-IT')}</span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'content'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Contenuto Corso
          </button>
          <button
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'feedback'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback
          </button>
          {(hasCompletedCourse && hasPassedQuiz) && (
            <button
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'certificate'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setActiveTab('certificate')}
            >
              Certificato
            </button>
          )}
        </div>

        {activeTab === 'content' && (
          <div className="space-y-6">
            {course.video_url && (
              <VideoPlayer
                videoUrl={course.video_url}
                onProgress={handleVideoProgress}
                onComplete={handleVideoComplete}
              />
            )}
            
            {course.description && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-3">Descrizione del Corso</h3>
                <p className="text-slate-300 whitespace-pre-wrap">
                  {course.description}
                </p>
              </div>
            )}

            {hasCompletedCourse && quiz && !showQuiz && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-3">Quiz Finale</h3>
                <p className="text-slate-300 mb-4">
                  Hai completato il corso! Ora puoi sostenere il quiz finale per ottenere il certificato.
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowQuiz(true)}
                >
                  Inizia Quiz
                </button>
              </div>
            )}

            {showQuiz && (
              <QuizComponent
                quiz={quiz}
                onSubmit={handleQuizSubmit}
                isLoading={submittingQuiz}
              />
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-6">
            {!userFeedback ? (
              <FeedbackForm 
                courseId={course.id}
                onSubmitted={() => {
                  // Refetch feedback after submission
                  getUserFeedback(course.id, user!.id).then(setUserFeedback)
                }}
              />
            ) : (
              <div className="card">
                <h3 className="text-lg font-semibold mb-3">Il Tuo Feedback</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-yellow-400">
                    {'★'.repeat(userFeedback.rating)}
                    {'☆'.repeat(5 - userFeedback.rating)}
                  </div>
                  <span className="text-slate-300">
                    ({userFeedback.rating}/5)
                  </span>
                </div>
                {userFeedback.comment && (
                  <p className="text-slate-300 mb-3">{userFeedback.comment}</p>
                )}
                <p className="text-sm text-slate-500">
                  Inviato il {new Date(userFeedback.created_at).toLocaleDateString('it-IT')}
                </p>
              </div>
            )}
            
            <FeedbackList courseId={course.id} />
          </div>
        )}

        {activeTab === 'certificate' && (
          <CertificateViewer
            courseId={course.id}
            courseTitle={course.title}
          />
        )}
      </main>

      <LiveChat />
    </div>
  )
}
