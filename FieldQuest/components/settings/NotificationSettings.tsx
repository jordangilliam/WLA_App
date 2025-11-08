import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native'
import { NotificationService } from '../../lib/notifications'
import { BackgroundLocationService } from '../../lib/background-location'

/**
 * Settings screen for notification preferences
 */
export const NotificationSettings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [backgroundLocationEnabled, setBackgroundLocationEnabled] = useState(false)
  const [nearbySpawns, setNearbySpawns] = useState(true)
  const [fieldTripEvents, setFieldTripEvents] = useState(true)
  const [achievements, setAchievements] = useState(true)
  const [siteEntries, setSiteEntries] = useState(false)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    // Check notification permissions
    const hasNotifPermissions = await NotificationService.requestPermissions()
    setNotificationsEnabled(hasNotifPermissions)

    // Check background location status
    const { hasPermission, isTracking } =
      await BackgroundLocationService.getStatus()
    setBackgroundLocationEnabled(hasPermission && isTracking)
  }

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await NotificationService.requestPermissions()
      setNotificationsEnabled(granted)

      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Please enable notifications in your device settings to receive spawn alerts.'
        )
      }
    } else {
      setNotificationsEnabled(false)
      await NotificationService.cancelAll()
    }
  }

  const handleToggleBackgroundLocation = async (value: boolean) => {
    if (value) {
      const granted = await BackgroundLocationService.requestPermissions()

      if (granted) {
        const started = await BackgroundLocationService.start()
        setBackgroundLocationEnabled(started)

        if (started) {
          Alert.alert(
            'Background Tracking Enabled',
            'FieldQuest will now check for nearby rare spawns every 10 minutes, even when the app is closed. This may affect battery life.',
            [{ text: 'Got it!' }]
          )
        }
      } else {
        Alert.alert(
          'Permission Denied',
          'Background location access is needed to notify you about nearby rare spawns. Please enable it in your device settings.'
        )
      }
    } else {
      await BackgroundLocationService.stop()
      setBackgroundLocationEnabled(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {/* Master toggle */}
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Text style={styles.settingDescription}>
            Receive alerts about nearby wildlife and events
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: '#D1D5DB', true: '#34D399' }}
          thumbColor={notificationsEnabled ? '#10B981' : '#9CA3AF'}
        />
      </View>

      {notificationsEnabled && (
        <>
          {/* Notification type toggles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Types</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🦌 Nearby Spawns</Text>
                <Text style={styles.settingDescription}>
                  Alert me when rare+ species appear nearby
                </Text>
              </View>
              <Switch
                value={nearbySpawns}
                onValueChange={setNearbySpawns}
                trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                thumbColor={nearbySpawns ? '#10B981' : '#9CA3AF'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🎓 Field Trip Events</Text>
                <Text style={styles.settingDescription}>
                  Remind me when teacher events are starting
                </Text>
              </View>
              <Switch
                value={fieldTripEvents}
                onValueChange={setFieldTripEvents}
                trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                thumbColor={fieldTripEvents ? '#10B981' : '#9CA3AF'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🏆 Achievements</Text>
                <Text style={styles.settingDescription}>
                  Notify me when I unlock achievements
                </Text>
              </View>
              <Switch
                value={achievements}
                onValueChange={setAchievements}
                trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                thumbColor={achievements ? '#10B981' : '#9CA3AF'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>📍 Site Entries</Text>
                <Text style={styles.settingDescription}>
                  Welcome message when entering field sites
                </Text>
              </View>
              <Switch
                value={siteEntries}
                onValueChange={setSiteEntries}
                trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                thumbColor={siteEntries ? '#10B981' : '#9CA3AF'}
              />
            </View>
          </View>

          {/* Background location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Background Tracking</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Background Location</Text>
                <Text style={styles.settingDescription}>
                  Check for spawns every 10 minutes, even when app is closed
                </Text>
                <Text style={styles.warningText}>
                  ⚠️ May affect battery life
                </Text>
              </View>
              <Switch
                value={backgroundLocationEnabled}
                onValueChange={handleToggleBackgroundLocation}
                trackColor={{ false: '#D1D5DB', true: '#F59E0B' }}
                thumbColor={backgroundLocationEnabled ? '#D97706' : '#9CA3AF'}
              />
            </View>
          </View>

          {/* Test notification */}
          <TouchableOpacity
            style={styles.testButton}
            onPress={async () => {
              await NotificationService.notifyNearbySpawn(
                'White-tailed Deer',
                'common',
                45
              )
            }}
          >
            <Text style={styles.testButtonText}>🔔 Send Test Notification</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    padding: 16,
    paddingBottom: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  warningText: {
    fontSize: 12,
    color: '#E67E22',
    marginTop: 4,
  },
  testButton: {
    backgroundColor: '#3498DB',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})

