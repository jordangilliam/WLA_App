/**
 * Retry utility functions
 * Provides retry logic with exponential backoff and jitter
 */

export interface RetryOptions {
  maxAttempts?: number
  delay?: number
  maxDelay?: number
  backoff?: 'exponential' | 'linear' | 'fixed'
  jitter?: boolean
  onRetry?: (attempt: number, error: Error) => void
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delay: 1000,
  maxDelay: 10000,
  backoff: 'exponential',
  jitter: true,
  onRetry: () => {},
}

/**
 * Calculate delay with backoff and jitter
 */
function calculateDelay(attempt: number, options: Required<RetryOptions>): number {
  let delay: number

  switch (options.backoff) {
    case 'exponential':
      delay = options.delay * Math.pow(2, attempt)
      break
    case 'linear':
      delay = options.delay * (attempt + 1)
      break
    case 'fixed':
    default:
      delay = options.delay
  }

  // Apply max delay cap
  delay = Math.min(delay, options.maxDelay)

  // Add jitter (±20%)
  if (options.jitter) {
    const jitterAmount = delay * 0.2
    delay = delay + (Math.random() * 2 - 1) * jitterAmount
  }

  return Math.max(0, delay)
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let lastError: Error | null = null

  for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < opts.maxAttempts - 1) {
        const delay = calculateDelay(attempt, opts)
        opts.onRetry(attempt + 1, lastError)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Retry failed')
}

/**
 * Retry with abort signal support
 */
export async function retryWithAbort<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  options: RetryOptions & { signal?: AbortSignal } = {}
): Promise<T> {
  const { signal, ...retryOptions } = options
  const controller = signal ? undefined : new AbortController()
  const abortSignal = signal || controller!.signal

  return retry(
    () => {
      if (abortSignal.aborted) {
        throw new Error('Operation aborted')
      }
      return fn(abortSignal)
    },
    {
      ...retryOptions,
      onRetry: (attempt, error) => {
        if (abortSignal.aborted) {
          throw new Error('Operation aborted')
        }
        retryOptions.onRetry?.(attempt, error)
      },
    }
  )
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  // Network errors are retryable
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return true
  }

  // Timeout errors are retryable
  if (error.message.includes('timeout')) {
    return true
  }

  // 5xx server errors are retryable
  if (error.message.match(/5\d{2}/)) {
    return true
  }

  // Permission errors are NOT retryable
  if (error.message.includes('permission') || error.message.includes('denied')) {
    return false
  }

  // Validation errors are NOT retryable
  if (error.message.includes('invalid') || error.message.includes('validation')) {
    return false
  }

  return true
}


