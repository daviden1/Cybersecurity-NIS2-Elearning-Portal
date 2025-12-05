'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getCourses, enrollInCourse } from '@/lib/courses'
import { CourseCard } from '@/components/courses/CourseCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function CoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const { data: coursesData, error: coursesError } = await getCourses()
        if (coursesError) throw coursesError

        // Get enrollments for this user
        const supabase = (await import('@/lib/supabase/client')).createClient()
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)

        if (enrollmentsError) throw enrollmentsError

        setCourses(coursesData || [])
        setEnrollments(enrollmentsData || [])
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleEnroll = async (courseId: string) => {
    if (!user) return

    setEnrollingCourse(courseId)
    try {
      const { data, error } = await enrollInCourse(courseId, user.id)
      if (error) throw error

      if (data) {
        setEnrollments([...enrollments, data])
      }
    } catch (error) {
      console.error('Error enrolling in course:', error)
      alert('Errore durante l\'iscrizione al corso')
    } finally {
      setEnrollingCourse(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-slate-300 flex items-center gap-3">
          <LoadingSpinner />
          Caricamento corsi...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-2">I Miei Corsi</h1>
        <p className="text-slate-300">
          Accedi ai corsi di formazione su NIS2 e cybersecurity
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {courses.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Nessun corso disponibile</h3>
            <p className="text-slate-300">
              I corsi saranno disponibili a breve. Controlla più tardi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const enrollment = enrollments.find(e => e.course_id === course.id)
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrollment={enrollment}
                  onEnroll={handleEnroll}
                  isLoading={enrollingCourse === course.id}
                />
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
