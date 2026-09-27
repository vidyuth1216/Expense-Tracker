import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error in Component Tree:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg,#0B0C0F)] p-6 text-[var(--color-text,#F2F1EE)]">
          <div className="w-full max-w-md rounded-xl border border-[var(--color-border,#292C34)] bg-[var(--color-surface,#121419)] p-6 shadow-2xl text-center">
            <h2 className="mb-2 text-xl font-semibold text-[var(--color-text,#F2F1EE)]">
              Something went wrong
            </h2>
            <p className="mb-4 text-xs text-[var(--color-text-secondary,#9A9BA3)]">
              {this.state.error?.message || 'An unexpected runtime error occurred.'}
            </p>
            <button
              onClick={this.handleReload}
              className="rounded-lg bg-[var(--color-nav-active-bg,#35334c)] px-4 py-2 text-xs font-semibold text-white hover:brightness-110 cursor-pointer"
              type="button"
            >
              Reload application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
