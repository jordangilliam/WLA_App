import { IdentifyMediaRequest, IdentificationResult } from '../types'
import { runOfflineMacroModel } from '../offline'

const DEFAULT_MACRO_ENDPOINT = 'https://api.macroinvertebrate.org/v1/identify'

export async function identifyMacro(
  request: IdentifyMediaRequest
): Promise<IdentificationResult> {
  if (!request.imageData) {
    return {
      mode: 'macro',
      provider: 'Macro API',
      status: 'error',
      reason: 'Macro identification requires an image',
    }
  }

  // Try remote API first if configured
  if (process.env.MACRO_API_KEY) {
    try {
      const response = await fetch(
        process.env.MACRO_API_URL || DEFAULT_MACRO_ENDPOINT,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.MACRO_API_KEY,
          },
          body: JSON.stringify({
            image: request.imageData,
            latitude: request.latitude,
            longitude: request.longitude,
          }),
        }
      )

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Macro API error: ${text}`)
      }

      const data = await response.json()
      const best = data?.results?.[0]

      if (best) {
        return {
          mode: 'macro',
          provider: 'Macro API',
          status: 'ok',
          label: best.common_name || best.scientific_name,
          confidence: best.confidence,
          raw: data,
        }
      }
    } catch (error) {
      console.warn('[macro] Remote API failed, falling back to offline model', error)
    }
  }

  // Fallback to offline heuristic
  const offline = runOfflineMacroModel(request.imageData)
  if (offline) {
    return offline
  }

  return {
    mode: 'macro',
    provider: 'Macro API',
    status: 'unavailable',
    reason: 'No remote API or offline model result available',
  }
}

