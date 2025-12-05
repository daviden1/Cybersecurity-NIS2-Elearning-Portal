'use client'

import { Course, Enrollment } from '@/lib/courses'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useRouter } from 'next/navigation'

interface CourseCardProps {
  course: Course
  enrollment?: Enrollment | null
  onEnroll?: (courseId: string) => Promise<void>
  isLoading?: boolean
}

export function CourseCard({ course, enrollment, onEnroll, isLoading }: CourseCardProps) {
  const router = useRouter()

  const handleContinue = () => {
    router.push(`/dashboard/courses/${course.id}`)
  }

  const handleEnroll = async () => {
    if (onEnroll) {
      await onEnroll(course.id)
    }
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg flex-1">{course.title}</h3>
        {course.duration_minutes && (
          <span className="text-sm text-slate-400 bg-white/5 px-2 py-1 rounded">
            {Math.ceil(course.duration_minutes / 60)}h
          </span>
        )}
      </div>
      
      {course.description && (
        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
      )}

      {enrollment ? (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-300">Avanzamento</span>
              <span className="text-emerald-400">{enrollment.progress_percentage}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${enrollment.progress_percentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="btn-primary flex-1"
              onClick={handleContinue}
            >
              {enrollment.progress_percentage > 0 ? 'Continua' : 'Inizia Corso'}
            </button>
            <button 
              className="btn-secondary"
              onClick={handleContinue}
            >
              Dettagli
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <button 
            className="btn-primary w-full"
            onClick={handleEnroll}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Iscrizione in corso...
              </>
            ) : (
              'Iscriviti al Corso'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
