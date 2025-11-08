/**
 * Settings screen combining notification settings and app preferences
 */

import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Stack } from 'expo-router'
import { NotificationSettings } from '../components/settings/NotificationSettings'

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container}>
        <NotificationSettings />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
})

