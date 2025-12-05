'use client'

import { useState } from 'react'
import { Quiz, QuizQuestion } from '@/lib/courses'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface QuizComponentProps {
  quiz: Quiz & { quiz_questions: QuizQuestion[] }
  onSubmit: (answers: number[]) => Promise<void>
  isLoading?: boolean
}

export function QuizComponent({ quiz, onSubmit, isLoading }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.quiz_questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.quiz_questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (answers.includes(-1)) {
      alert('Rispondi a tutte le domande prima di inviare')
      return
    }

    await onSubmit(answers)
    setShowResults(true)
  }

  if (showResults) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Risultati Quiz</h3>
        <div className="text-center py-8">
          <div className="text-4xl font-bold mb-2 text-emerald-400">{score}%</div>
          <p className="text-slate-300 mb-6">
            {score >= (quiz.passing_score || 70) ? 'Complimenti! Hai superato il quiz.' : 'Non hai superato il quiz. Riprova.'}
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Torna al Corso
          </button>
        </div>
      </div>
    )
  }

  const question = quiz.quiz_questions[currentQuestion]

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quiz: {quiz.title}</h3>
          <span className="text-sm text-slate-400">
            Domanda {currentQuestion + 1} di {quiz.quiz_questions.length}
          </span>
        </div>
        
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.quiz_questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-medium mb-4">{question.question}</h4>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 rounded-lg border cursor-pointer transition ${
                answers[currentQuestion] === index
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={index}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswer(index)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[currentQuestion] === index
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-slate-400'
                }`}>
                  {answers[currentQuestion] === index && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-slate-200">{option}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          className="btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Precedente
        </button>
        
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={answers[currentQuestion] === -1 || isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Caricamento...
            </>
          ) : currentQuestion === quiz.quiz_questions.length - 1 ? (
            'Invia Quiz'
          ) : (
            'Prossima'
          )}
        </button>
      </div>
    </div>
  )
}
