/**
 * Sentry error tracking configuration
 * Captures errors, performance metrics, and user feedback
 */

import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Environment
      environment: process.env.NODE_ENV,
      
      // Release tracking
      release: process.env.NEXT_PUBLIC_APP_VERSION,
      
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Error sampling
      sampleRate: 1.0,
      
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      // Integrations
      integrations: [
        new Sentry.BrowserTracing({
          // Set sampling rate for performance monitoring
          tracePropagationTargets: ['localhost', /^https:\/\/yourapp\.com/],
        }),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Filter out common non-errors
      beforeSend(event, hint) {
        // Don't send browser extension errors
        if (event.exception?.values?.[0]?.value?.includes('chrome-extension')) {
          return null
        }
        
        // Don't send network errors from ad blockers
        if (hint.originalException?.message?.includes('blocked by client')) {
          return null
        }
        
        return event
      },
    })
  }
}

/**
 * Capture error with context
 */
export function captureError(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext('custom', context)
  }
  Sentry.captureException(error)
}

/**
 * Capture message for logging
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level)
}

/**
 * Set user context
 */
export function setUser(user: { id: string; email?: string; name?: string; role?: string }) {
  Sentry.setUser(user)
}

/**
 * Clear user context (on logout)
 */
export function clearUser() {
  Sentry.setUser(null)
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    level: 'info',
    data,
  })
}

/**
 * Start transaction for performance monitoring
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({
    name,
    op,
  })
}

export { Sentry }

