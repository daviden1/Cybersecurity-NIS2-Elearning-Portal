'use client'

import { useState } from 'react'
import { submitFeedback } from '@/lib/feedback'
import { useAuth } from '@/lib/auth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface FeedbackFormProps {
  courseId: string
  onSubmitted?: () => void
}

export function FeedbackForm({ courseId, onSubmitted }: FeedbackFormProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || rating === 0) return

    setSubmitting(true)
    try {
      const { error } = await submitFeedback(courseId, user.id, rating, comment)
      if (error) throw error

      setSubmitted(true)
      onSubmitted?.()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Errore durante l\'invio del feedback')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="card">
        <div className="text-center py-6">
          <div className="text-emerald-400 text-4xl mb-3">✓</div>
          <h3 className="text-lg font-semibold mb-2">Grazie per il tuo feedback!</h3>
          <p className="text-slate-300">
            La tua opinione ci aiuta a migliorare i nostri corsi.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Valuta questo Corso</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Valutazione</label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-3xl transition-colors"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <span className={star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-slate-600'}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {rating === 1 && 'Scarso'}
            {rating === 2 && 'Insufficiente'}
            {rating === 3 && 'Sufficiente'}
            {rating === 4 && 'Buono'}
            {rating === 5 && 'Eccellente'}
          </p>
        </div>

        <div>
          <label className="label">Commento (opzionale)</label>
          <textarea
            className="input min-h-[100px] resize-none"
            placeholder="Condividi la tua esperienza con questo corso..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          className="btn-primary w-full"
          type="submit"
          disabled={rating === 0 || submitting}
        >
          {submitting ? (
            <>
              <LoadingSpinner />
              Invio in corso...
            </>
          ) : (
            'Invia Feedback'
          )}
        </button>
      </form>
    </div>
  )
}
