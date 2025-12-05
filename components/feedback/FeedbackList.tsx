'use client'

import { useState, useEffect } from 'react'
import { getCourseFeedback } from '@/lib/feedback'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface FeedbackListProps {
  courseId: string
}

export function FeedbackList({ courseId }: FeedbackListProps) {
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data, error } = await getCourseFeedback(courseId)
        if (error) throw error
        setFeedback(data || [])
      } catch (error) {
        console.error('Error fetching feedback:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [courseId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (feedback.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-slate-300">
          Nessuna recensione ancora. Sii il primo a valutare questo corso!
        </p>
      </div>
    )
  }

  const averageRating = feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recensioni degli Studenti</h3>
          <div className="flex items-center gap-2">
            <div className="text-2xl text-yellow-400">
              {'★'.repeat(Math.round(averageRating))}
              {'☆'.repeat(5 - Math.round(averageRating))}
            </div>
            <span className="text-slate-300">
              {averageRating.toFixed(1)} ({feedback.length} recensioni)
            </span>
          </div>
        </div>
      </div>

      {feedback.map((item) => (
        <div key={item.id} className="card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-medium">{item.user_profiles.full_name}</div>
              <div className="text-sm text-slate-400">{item.user_profiles.company_name}</div>
            </div>
            <div className="text-sm text-yellow-400">
              {'★'.repeat(item.rating)}
              {'☆'.repeat(5 - item.rating)}
            </div>
          </div>
          
          {item.comment && (
            <p className="text-slate-300">{item.comment}</p>
          )}
          
          <div className="text-xs text-slate-500 mt-3">
            {new Date(item.created_at).toLocaleDateString('it-IT')}
          </div>
        </div>
      ))}
    </div>
  )
}
