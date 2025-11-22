import { identifyWithINaturalist } from './providers/inaturalist'
import { identifyWithBirdWeather } from './providers/birdweather'
import { identifyMacro } from './providers/macro'
import { IdentifyMediaRequest, IdentificationResult, IdentificationMode } from './types'

type ProviderFn = (request: IdentifyMediaRequest) => Promise<IdentificationResult>

const providerMap: Record<IdentificationMode, ProviderFn> = {
  species: identifyWithINaturalist,
  bird: identifyWithBirdWeather,
  macro: identifyMacro,
}

export async function runIdentificationPipeline(
  request: IdentifyMediaRequest
): Promise<IdentificationResult[]> {
  const targets: IdentificationMode[] = request.targets.length ? request.targets : ['species']

  const results: IdentificationResult[] = []

  for (const mode of targets) {
    const provider = providerMap[mode]
    if (!provider) continue

    const result = await provider(request)
    results.push(result)
  }

  return results
}

