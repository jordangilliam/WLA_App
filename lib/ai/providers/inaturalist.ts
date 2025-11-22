import { Buffer } from 'node:buffer'
import { IdentifyMediaRequest, IdentificationResult } from '../types'

const INATURALIST_ENDPOINT = 'https://api.inaturalist.org/v1/computervision/score_image'

function getImageBuffer(imageData?: string) {
  if (!imageData) return null
  const base64 = imageData.includes(',') ? imageData.split(',')[1] : imageData
  return Buffer.from(base64, 'base64')
}

export async function identifyWithINaturalist(
  request: IdentifyMediaRequest
): Promise<IdentificationResult> {
  if (!process.env.INATURALIST_CLIENT_ID) {
    return {
      mode: 'species',
      provider: 'iNaturalist',
      status: 'unavailable',
      reason: 'Missing INATURALIST_CLIENT_ID',
    }
  }

  const buffer = getImageBuffer(request.imageData)

  if (!buffer) {
    return {
      mode: 'species',
      provider: 'iNaturalist',
      status: 'error',
      reason: 'No image data provided',
    }
  }

  try {
    const form = new FormData()
    form.append('image', new Blob([buffer]), 'field.jpg')
    form.append('client_id', process.env.INATURALIST_CLIENT_ID)

    if (request.latitude) {
      form.append('lat', request.latitude.toString())
    }
    if (request.longitude) {
      form.append('lng', request.longitude.toString())
    }

    const response = await fetch(INATURALIST_ENDPOINT, {
      method: 'POST',
      body: form,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`iNaturalist error: ${text}`)
    }

    const data = await response.json()
    const suggestion = data?.results?.[0]

    if (!suggestion) {
      return {
        mode: 'species',
        provider: 'iNaturalist',
        status: 'error',
        reason: 'No suggestions returned',
        raw: data,
      }
    }

    return {
      mode: 'species',
      provider: 'iNaturalist',
      status: 'ok',
      label: suggestion.taxon?.name || suggestion.taxon?.preferred_common_name,
      confidence: suggestion.score,
      raw: data,
    }
  } catch (error) {
    return {
      mode: 'species',
      provider: 'iNaturalist',
      status: 'error',
      reason: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

