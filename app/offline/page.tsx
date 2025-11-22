'use client';

/**
 * Offline fallback page
 * Shown when user navigates while offline and page isn't cached
 */

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You&apos;re Offline
        </h1>

        <p className="text-gray-600 mb-8">
          This page isn&apos;t available offline yet. Check your internet connection
          or visit a page you&apos;ve accessed before.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Try Again
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
          >
            Go Back
          </button>

          <a
            href="/"
            className="block w-full px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-medium"
          >
            Go Home
          </a>
        </div>

        <div className="mt-12 p-4 bg-blue-50 rounded-lg text-sm text-left">
          <h3 className="font-semibold text-gray-900 mb-2">
            Available Offline Features:
          </h3>
          <ul className="space-y-1 text-gray-700">
            <li>• View cached classes and lessons</li>
            <li>• Access saved photos</li>
            <li>• Create check-ins (will sync later)</li>
            <li>• Browse downloaded content</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

