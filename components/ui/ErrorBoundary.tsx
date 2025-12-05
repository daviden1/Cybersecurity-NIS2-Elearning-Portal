'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="card max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-4">Errore del Sistema</h2>
            <p className="text-slate-300 mb-4">
              Si è verificato un errore imprevisto. Ricarica la pagina o contatta il supporto.
            </p>
            <button 
              className="btn-primary w-full"
              onClick={() => window.location.reload()}
            >
              Ricarica Pagina
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
