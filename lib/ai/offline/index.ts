import { IdentificationResult } from '../types'

const SAMPLE_MACRO_SPECIES = [
  { label: 'Mayfly Nymph', confidence: 0.62 },
  { label: 'Stonefly Nymph', confidence: 0.58 },
  { label: 'Caddisfly Larva', confidence: 0.55 },
  { label: 'Dragonfly Nymph', confidence: 0.51 },
]

/**
 * Placeholder offline model.
 * Replace with TensorFlow.js / TFLite inference when on-device models are ready.
 */
export function runOfflineMacroModel(imageData?: string): IdentificationResult | null {
  if (!imageData) {
    return null
  }

  const hashSeed = imageData.length % SAMPLE_MACRO_SPECIES.length
  const guess = SAMPLE_MACRO_SPECIES[hashSeed]

  return {
    mode: 'macro',
    provider: 'offline-macro',
    status: 'ok',
    label: guess.label,
    confidence: guess.confidence,
    raw: { heuristic: 'length-modulo' },
  }
}

