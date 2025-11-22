export type IdentificationMode = 'species' | 'bird' | 'macro'

export interface IdentifyMediaRequest {
  mediaType: 'image' | 'audio'
  imageData?: string
  audioData?: string
  latitude?: number
  longitude?: number
  targets: IdentificationMode[]
}

export type IdentificationStatus = 'ok' | 'unavailable' | 'error'

export interface IdentificationResult {
  mode: IdentificationMode
  provider: string
  status: IdentificationStatus
  label?: string
  confidence?: number
  reason?: string
  raw?: any
}

