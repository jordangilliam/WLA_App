type PurdueResponse = {
  requestId?: string
  status: string
  message?: string
}

export async function exportToPurdueSoundscapes(params: {
  audioData: string
  durationSeconds: number
  metadata?: Record<string, any>
}) {
  if (!process.env.PURDUE_SOUNDSCAPES_API_URL || !process.env.PURDUE_SOUNDSCAPES_API_KEY) {
    return {
      ok: false,
      reason: 'missing_credentials',
    }
  }

  const response = await fetch(process.env.PURDUE_SOUNDSCAPES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.PURDUE_SOUNDSCAPES_API_KEY,
    },
    body: JSON.stringify({
      audio: params.audioData,
      duration: params.durationSeconds,
      metadata: params.metadata,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    return {
      ok: false,
      reason: text || 'remote_error',
    }
  }

  const data = (await response.json()) as PurdueResponse

  return {
    ok: true,
    data,
  }
}

