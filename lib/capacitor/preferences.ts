/**
 * Capacitor Preferences plugin wrapper
 * Cross-platform key-value storage for user preferences
 */

import { Preferences } from '@capacitor/preferences'

/**
 * Set a preference value
 */
export async function setPreference(key: string, value: string | number | boolean | object) {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    await Preferences.set({ key, value: stringValue })
  } catch (error) {
    console.error(`Error setting preference ${key}:`, error)
    throw error
  }
}

/**
 * Get a preference value
 */
export async function getPreference<T = string>(key: string): Promise<T | null> {
  try {
    const { value } = await Preferences.get({ key })
    
    if (!value) return null

    // Try to parse as JSON
    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  } catch (error) {
    console.error(`Error getting preference ${key}:`, error)
    return null
  }
}

/**
 * Remove a preference
 */
export async function removePreference(key: string) {
  try {
    await Preferences.remove({ key })
  } catch (error) {
    console.error(`Error removing preference ${key}:`, error)
    throw error
  }
}

/**
 * Clear all preferences
 */
export async function clearPreferences() {
  try {
    await Preferences.clear()
  } catch (error) {
    console.error('Error clearing preferences:', error)
    throw error
  }
}

/**
 * Get all preference keys
 */
export async function getAllKeys(): Promise<string[]> {
  try {
    const { keys } = await Preferences.keys()
    return keys
  } catch (error) {
    console.error('Error getting preference keys:', error)
    return []
  }
}

// Typed preference helpers

export const UserPreferences = {
  async getOnboardingCompleted(): Promise<boolean> {
    return (await getPreference<boolean>('onboarding_completed')) ?? false
  },
  
  async setOnboardingCompleted(completed: boolean) {
    await setPreference('onboarding_completed', completed)
  },

  async getNotificationsEnabled(): Promise<boolean> {
    return (await getPreference<boolean>('notifications_enabled')) ?? true
  },
  
  async setNotificationsEnabled(enabled: boolean) {
    await setPreference('notifications_enabled', enabled)
  },

  async getLocationTrackingEnabled(): Promise<boolean> {
    return (await getPreference<boolean>('location_tracking_enabled')) ?? true
  },
  
  async setLocationTrackingEnabled(enabled: boolean) {
    await setPreference('location_tracking_enabled', enabled)
  },

  async getTheme(): Promise<'light' | 'dark' | 'auto'> {
    return (await getPreference<'light' | 'dark' | 'auto'>('theme')) ?? 'auto'
  },
  
  async setTheme(theme: 'light' | 'dark' | 'auto') {
    await setPreference('theme', theme)
  },
}

