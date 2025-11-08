/**
 * Push notifications for nearby spawns and events
 */

import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location'
import { Platform } from 'react-native'
import { api } from './api'
import { calculateDistance } from './geo'

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export class NotificationService {
  private static notificationListener: any = null
  private static responseListener: any = null

  /**
   * Request notification permissions
   */
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted')
      return false
    }

    // Get push token for remote notifications (optional)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#D97706',
      })
    }

    return true
  }

  /**
   * Schedule a local notification for a nearby spawn
   */
  static async notifyNearbySpawn(
    speciesName: string,
    rarity: string,
    distance: number
  ): Promise<void> {
    const rarityEmoji = {
      common: '🦌',
      uncommon: '🦅',
      rare: '⭐',
      epic: '✨',
      legendary: '👑',
    }[rarity] || '🐾'

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${rarityEmoji} ${rarity.toUpperCase()} Species Nearby!`,
        body: `A ${speciesName} appeared ${distance}m away. Tap to catch it!`,
        data: { type: 'spawn', speciesName, rarity },
        sound: true,
      },
      trigger: null, // Show immediately
    })
  }

  /**
   * Notify about teacher-created events
   */
  static async notifyFieldTripEvent(
    eventName: string,
    siteName: string,
    startsAt: string
  ): Promise<void> {
    const startDate = new Date(startsAt)
    const now = new Date()
    const minutesUntilStart = Math.floor((startDate.getTime() - now.getTime()) / 60000)

    if (minutesUntilStart > 0 && minutesUntilStart <= 60) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🎓 Field Trip Starting Soon!`,
          body: `${eventName} at ${siteName} starts in ${minutesUntilStart} minutes.`,
          data: { type: 'event', eventName, siteName },
          sound: true,
        },
        trigger: null,
      })
    }
  }

  /**
   * Notify when entering a field site geofence
   */
  static async notifyEnteredSite(siteName: string, siteType: string): Promise<void> {
    const typeEmoji = {
      park: '🏞️',
      library: '📚',
      university: '🎓',
      museum: '🏛️',
      trail: '🥾',
      zoo: '🦁',
      garden: '🌺',
    }[siteType] || '📍'

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${typeEmoji} Welcome to ${siteName}!`,
        body: 'Check nearby spawns and interact with this site to earn rewards.',
        data: { type: 'site_entry', siteName },
        sound: false,
      },
      trigger: null,
    })
  }

  /**
   * Notify about achievements and milestones
   */
  static async notifyAchievement(
    title: string,
    description: string,
    xpGained: number
  ): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🏆 Achievement Unlocked!`,
        body: `${title}: ${description} (+${xpGained} XP)`,
        data: { type: 'achievement', title },
        sound: true,
      },
      trigger: null,
    })
  }

  /**
   * Background location monitoring for nearby spawns
   * Call this periodically (every 5-10 minutes) in background
   */
  static async checkNearbySpawnsBackground(): Promise<void> {
    try {
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      // Fetch nearby spawns
      const nearby = await api.getNearby(
        location.coords.latitude,
        location.coords.longitude,
        300 // 300m radius
      )

      // Notify about rare+ spawns
      for (const spawn of nearby.spawns || []) {
        if (['rare', 'epic', 'legendary'].includes(spawn.species.rarity)) {
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            spawn.lat,
            spawn.lng
          )

          if (distance <= 300) {
            await this.notifyNearbySpawn(
              spawn.species.common_name,
              spawn.species.rarity,
              Math.round(distance)
            )
          }
        }
      }
    } catch (error) {
      console.error('Background spawn check failed:', error)
    }
  }

  /**
   * Setup notification listeners
   */
  static setupListeners(
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationTapped?: (response: Notifications.NotificationResponse) => void
  ): void {
    // Notification received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification)
        onNotificationReceived?.(notification)
      }
    )

    // Notification tapped by user
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response)
        onNotificationTapped?.(response)
      }
    )
  }

  /**
   * Clean up listeners
   */
  static removeListeners(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener)
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener)
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  static async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync()
  }

  /**
   * Get notification badge count
   */
  static async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync()
  }

  /**
   * Set notification badge count
   */
  static async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count)
  }
}

