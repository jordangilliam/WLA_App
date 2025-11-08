/**
 * Onboarding tutorial for first-time users
 * Explains how FieldQuest works and requests permissions
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { NotificationService } from '../lib/notifications'
import { BackgroundLocationService } from '../lib/background-location'
import * as Location from 'expo-location'

const { width } = Dimensions.get('window')

interface OnboardingStep {
  title: string
  description: string
  icon: string
  image?: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to FieldQuest!',
    description: 'Explore Pennsylvania wildlife through an exciting location-based adventure. Catch species, visit field sites, and build your collection!',
    icon: '🦌',
  },
  {
    title: 'Explore Real Locations',
    description: 'Visit parks, libraries, museums, and trails across Pittsburgh and Pennsylvania. Each location has unique wildlife and rewards!',
    icon: '🗺️',
  },
  {
    title: 'Catch PA Wildlife',
    description: 'When you find a species spawn, start an encounter and play the mini-game to catch it. Collect all Pennsylvania native species!',
    icon: '🎯',
  },
  {
    title: 'Build Your Collection',
    description: 'Track your progress, earn XP, level up, and complete your wildlife collection. Compare with classmates and earn achievements!',
    icon: '📚',
  },
  {
    title: 'Join Field Trips',
    description: 'Teachers can create special spawn events at field trip locations. Participate to catch rare species and learn about conservation!',
    icon: '🎓',
  },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
  })

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Last step - request permissions
      requestPermissions()
    }
  }

  const handleSkip = () => {
    router.replace('/map')
  }

  const requestPermissions = async () => {
    // Request location permission
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync()
    const locationGranted = locationStatus === 'granted'
    
    // Request notification permission
    const notificationGranted = await NotificationService.requestPermissions()

    setPermissions({
      location: locationGranted,
      notifications: notificationGranted,
    })

    // Show completion screen
    setCurrentStep(ONBOARDING_STEPS.length)
  }

  const handleComplete = () => {
    router.replace('/map')
  }

  // Completion screen
  if (currentStep === ONBOARDING_STEPS.length) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.completionContainer}>
          <Text style={styles.completionIcon}>🎉</Text>
          <Text style={styles.completionTitle}>You're All Set!</Text>
          <Text style={styles.completionDescription}>
            FieldQuest is ready to go. Here's what you can do:
          </Text>

          <View style={styles.permissionsList}>
            <View style={styles.permissionItem}>
              <Text style={styles.permissionIcon}>
                {permissions.location ? '✅' : '⚠️'}
              </Text>
              <View style={styles.permissionText}>
                <Text style={styles.permissionTitle}>Location</Text>
                <Text style={styles.permissionDescription}>
                  {permissions.location
                    ? 'Enabled - You can see nearby spawns and sites'
                    : 'Disabled - Enable in Settings to use FieldQuest'}
                </Text>
              </View>
            </View>

            <View style={styles.permissionItem}>
              <Text style={styles.permissionIcon}>
                {permissions.notifications ? '✅' : 'ℹ️'}
              </Text>
              <View style={styles.permissionText}>
                <Text style={styles.permissionTitle}>Notifications</Text>
                <Text style={styles.permissionDescription}>
                  {permissions.notifications
                    ? 'Enabled - You\'ll get alerts for nearby rare spawns'
                    : 'Optional - Enable later for spawn alerts'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>💡 Quick Tips:</Text>
            <Text style={styles.tipText}>• Start by exploring your neighborhood</Text>
            <Text style={styles.tipText}>• Visit Carnegie Libraries for guaranteed encounters</Text>
            <Text style={styles.tipText}>• Check the Collection tab to see all species</Text>
            <Text style={styles.tipText}>• Join your teacher's class to participate in field trips</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
            <Text style={styles.primaryButtonText}>Start Exploring! 🚀</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  // Onboarding steps
  const step = ONBOARDING_STEPS[currentStep]
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.stepIcon}>{step.icon}</Text>
        </View>

        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDescription}>{step.description}</Text>

        {/* Progress dots */}
        <View style={styles.progressDots}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep && styles.activeDot,
                index < currentStep && styles.completedDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, isLastStep && styles.lastStepButton]}
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>
            {isLastStep ? 'Get Started 🎯' : 'Next'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.stepCounter}>
          {currentStep + 1} of {ONBOARDING_STEPS.length}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 60,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  stepIcon: {
    fontSize: 64,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ECF0F1',
  },
  activeDot: {
    backgroundColor: '#27AE60',
    width: 24,
  },
  completedDot: {
    backgroundColor: '#95A5A6',
  },
  footer: {
    padding: 32,
    paddingBottom: 48,
  },
  primaryButton: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastStepButton: {
    backgroundColor: '#D97706',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepCounter: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    marginTop: 16,
  },
  completionContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  completionIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  completionDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionsList: {
    width: '100%',
    marginBottom: 32,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  permissionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  tipsBox: {
    width: '100%',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#FBBF24',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 24,
  },
})

