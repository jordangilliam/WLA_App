/**
 * Capacitor Camera plugin wrapper
 * Cross-platform photo capture for field trip documentation
 */

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export interface PhotoResult {
  dataUrl: string
  format: string
  saved: boolean
}

/**
 * Take a photo using device camera
 */
export async function takePhoto(): Promise<PhotoResult> {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    })

    return {
      dataUrl: image.dataUrl!,
      format: image.format,
      saved: image.saved,
    }
  } catch (error) {
    console.error('Error taking photo:', error)
    throw new Error('Failed to take photo')
  }
}

/**
 * Pick a photo from gallery
 */
export async function pickPhoto(): Promise<PhotoResult> {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    })

    return {
      dataUrl: image.dataUrl!,
      format: image.format,
      saved: image.saved,
    }
  } catch (error) {
    console.error('Error picking photo:', error)
    throw new Error('Failed to pick photo')
  }
}

/**
 * Request camera permissions
 */
export async function requestCameraPermissions() {
  try {
    const permissions = await Camera.requestPermissions()
    return permissions.camera === 'granted'
  } catch (error) {
    console.error('Error requesting camera permissions:', error)
    return false
  }
}

/**
 * Check camera permissions
 */
export async function checkCameraPermissions() {
  try {
    const permissions = await Camera.checkPermissions()
    return permissions.camera === 'granted'
  } catch (error) {
    console.error('Error checking camera permissions:', error)
    return false
  }
}

