import { IdentifyMediaRequest, IdentificationResult } from '../types'

const DEFAULT_BIRDWEATHER_ENDPOINT = 'https://api.birdweather.com/v1/identify'

export async function identifyWithBirdWeather(
  request: IdentifyMediaRequest
): Promise<IdentificationResult> {
  if (!process.env.BIRDWEATHER_API_KEY) {
    return {
      mode: 'bird',
      provider: 'BirdWeather',
      status: 'unavailable',
      reason: 'Missing BIRDWEATHER_API_KEY',
    }
  }

  if (!request.audioData) {
    return {
      mode: 'bird',
      provider: 'BirdWeather',
      status: 'error',
      reason: 'Audio sample required for bird identification',
    }
  }

  try {
    const response = await fetch(
      process.env.BIRDWEATHER_API_URL || DEFAULT_BIRDWEATHER_ENDPOINT,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BIRDWEATHER_API_KEY}`,
        },
        body: JSON.stringify({
          audio: request.audioData,
          latitude: request.latitude,
          longitude: request.longitude,
        }),
      }
    )

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`BirdWeather error: ${text}`)
    }

    const data = await response.json()
    const topResult = data?.predictions?.[0]

    if (!topResult) {
      return {
        mode: 'bird',
        provider: 'BirdWeather',
        status: 'error',
        reason: 'No bird predictions returned',
        raw: data,
      }
    }

    return {
      mode: 'bird',
      provider: 'BirdWeather',
      status: 'ok',
      label: topResult.species,
      confidence: topResult.confidence,
      raw: data,
    }
  } catch (error) {
    return {
      mode: 'bird',
      provider: 'BirdWeather',
      status: 'error',
      reason: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

