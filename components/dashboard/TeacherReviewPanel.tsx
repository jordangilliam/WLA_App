'use client'

import { useCallback, useEffect, useState } from 'react'

type AIStatus = 'pending' | 'approved' | 'rejected' | 'auto'
type SoundStatus = 'stored' | 'pending_export' | 'exported' | 'failed'

type AIIdentification = {
  id: string
  provider: string
  mode: string
  label?: string | null
  confidence?: number | null
  status: AIStatus
  created_at: string
  user_id?: string | null
  result?: Record<string, any> | null
}

type SoundRecording = {
  id: string
  user_id?: string | null
  duration_seconds?: number | null
  status: SoundStatus
  created_at: string
  metadata?: Record<string, any> | null
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }
  return (await response.json()) as T
}

export default function TeacherReviewPanel() {
  const [aiStatus, setAiStatus] = useState<AIStatus>('pending')
  const [aiItems, setAiItems] = useState<AIIdentification[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const [soundStatus, setSoundStatus] = useState<SoundStatus>('pending_export')
  const [soundItems, setSoundItems] = useState<SoundRecording[]>([])
  const [soundLoading, setSoundLoading] = useState(false)
  const [soundError, setSoundError] = useState<string | null>(null)

  const loadAI = useCallback(async () => {
    try {
      setAiLoading(true)
      setAiError(null)
      const data = await fetchJson<{ items: AIIdentification[] }>(
        `/api/ai/identifications?status=${aiStatus}`
      )
      setAiItems(data.items ?? [])
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Unable to load AI queue.')
    } finally {
      setAiLoading(false)
    }
  }, [aiStatus])

  const loadSoundscapes = useCallback(async () => {
    try {
      setSoundLoading(true)
      setSoundError(null)
      const data = await fetchJson<{ items: SoundRecording[] }>(
        `/api/soundscapes/recordings?scope=review&status=${soundStatus}`
      )
      setSoundItems(data.items ?? [])
    } catch (error) {
      setSoundError(error instanceof Error ? error.message : 'Unable to load recordings.')
    } finally {
      setSoundLoading(false)
    }
  }, [soundStatus])

  useEffect(() => {
    loadAI()
  }, [loadAI])

  useEffect(() => {
    loadSoundscapes()
  }, [loadSoundscapes])

  const updateAIStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch('/api/ai/identifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      loadAI()
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Failed to update status.')
    }
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Identification Review</h2>
            <p className="text-sm text-gray-600">
              Review pending identifications submitted by students. Approve to confirm or reject to
              request resubmission.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={aiStatus}
              onChange={(event) => setAiStatus(event.target.value as AIStatus)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="auto">Auto</option>
            </select>
            <button
              onClick={loadAI}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </header>

        {aiError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {aiError}
          </div>
        )}

        {aiLoading ? (
          <p className="text-sm text-gray-500">Loading AI identifications…</p>
        ) : aiItems.length === 0 ? (
          <p className="text-sm text-gray-500">No entries for this status.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {aiItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.provider}</p>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Mode: {item.mode}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {aiStatus.toUpperCase()}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  <p>
                    Suggested Label:{' '}
                    <span className="font-semibold">{item.label ?? 'No label available'}</span>
                  </p>
                  {typeof item.confidence === 'number' && (
                    <p>Confidence: {(item.confidence * 100).toFixed(1)}%</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>

                {aiStatus === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateAIStatus(item.id, 'approved')}
                      className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateAIStatus(item.id, 'rejected')}
                      className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Soundscape Recordings</h2>
            <p className="text-sm text-gray-600">
              Monitor student audio uploads and prepare batches for export to Purdue or partner
              programs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={soundStatus}
              onChange={(event) => setSoundStatus(event.target.value as SoundStatus)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              <option value="pending_export">Pending Export</option>
              <option value="stored">Stored Locally</option>
              <option value="exported">Exported</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={loadSoundscapes}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </header>

        {soundError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {soundError}
          </div>
        )}

        {soundLoading ? (
          <p className="text-sm text-gray-500">Loading soundscape queue…</p>
        ) : soundItems.length === 0 ? (
          <p className="text-sm text-gray-500">No recordings for this status.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {soundItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Recording</p>
                    <p className="text-xs text-gray-500">
                      Length: {Math.round(item.duration_seconds ?? 0)} sec
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {soundStatus.toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Uploaded: {new Date(item.created_at).toLocaleString()}
                </p>
                {item.metadata?.latitude && item.metadata?.longitude && (
                  <p className="mt-1 text-xs text-gray-500">
                    Location: {item.metadata.latitude.toFixed(3)},{' '}
                    {item.metadata.longitude.toFixed(3)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}


