import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import DateTimePicker from '@react-native-community/datetimepicker'
import { api } from '../../lib/api'
import { useUserStore } from '../../state/store'
import { FieldSite, Species } from '../../lib/types'

/**
 * Teacher-only screen for creating spawn events at field sites
 * This allows teachers to create "field trip" events where students
 * can catch specific species at specific locations
 */
export default function CreateEventScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useUserStore()

  // Form state
  const [selectedSite, setSelectedSite] = useState<string>('')
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([])
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3 * 60 * 60 * 1000)) // 3 hours from now
  const [eventName, setEventName] = useState('')
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  // Check if user is a teacher
  useEffect(() => {
    if (user && user.role !== 'teacher') {
      Alert.alert('Access Denied', 'Only teachers can create spawn events')
      router.back()
    }
  }, [user])

  // Fetch field sites
  const { data: sites } = useQuery<FieldSite[]>({
    queryKey: ['field-sites'],
    queryFn: async () => {
      const { data } = await api.supabase
        .from('field_sites')
        .select('*')
        .order('name')
      return data || []
    },
  })

  // Fetch available species
  const { data: species } = useQuery<Species[]>({
    queryKey: ['species'],
    queryFn: async () => {
      const { data } = await api.supabase
        .from('species')
        .select('*')
        .order('common_name')
      return data || []
    },
  })

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: async (eventData: any) => {
      const { data, error } = await api.supabase
        .from('spawn_events')
        .insert(eventData)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: async (event) => {
      // Create spawns for each selected species
      const spawns = selectedSpecies.map((speciesId) => ({
        species_id: speciesId,
        event_id: event.id,
        lat: sites?.find((s) => s.id === selectedSite)?.lat,
        lng: sites?.find((s) => s.id === selectedSite)?.lng,
        expires_at: endTime.toISOString(),
      }))

      await api.supabase.from('active_spawns').insert(spawns)

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['spawn-events'] })
      queryClient.invalidateQueries({ queryKey: ['nearby'] })

      Alert.alert(
        'Event Created!',
        `${selectedSpecies.length} species will spawn at ${sites?.find((s) => s.id === selectedSite)?.name}`,
        [{ text: 'OK', onPress: () => router.back() }]
      )
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to create event: ${error.message}`)
    },
  })

  const handleCreateEvent = () => {
    if (!selectedSite) {
      Alert.alert('Missing Field', 'Please select a field site')
      return
    }
    if (selectedSpecies.length === 0) {
      Alert.alert('Missing Species', 'Please select at least one species')
      return
    }
    if (!eventName.trim()) {
      Alert.alert('Missing Name', 'Please enter an event name')
      return
    }
    if (endTime <= startTime) {
      Alert.alert('Invalid Time', 'End time must be after start time')
      return
    }

    const selectedSiteData = sites?.find((s) => s.id === selectedSite)

    createEvent.mutate({
      name: eventName,
      field_site_id: selectedSite,
      created_by: user?.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      active: true,
      species_list: selectedSpecies,
    })
  }

  const toggleSpecies = (speciesId: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(speciesId)
        ? prev.filter((id) => id !== speciesId)
        : [...prev, speciesId]
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Field Trip Event',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Spring Creek Field Trip"
            value={eventName}
            onChangeText={setEventName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Field Site</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sites?.map((site) => (
              <TouchableOpacity
                key={site.id}
                style={[
                  styles.chip,
                  selectedSite === site.id && styles.chipSelected,
                ]}
                onPress={() => setSelectedSite(site.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedSite === site.id && styles.chipTextSelected,
                  ]}
                >
                  {site.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select Species to Spawn ({selectedSpecies.length} selected)
          </Text>
          <View style={styles.speciesGrid}>
            {species?.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.speciesCard,
                  selectedSpecies.includes(s.id) && styles.speciesCardSelected,
                ]}
                onPress={() => toggleSpecies(s.id)}
              >
                <Text style={styles.speciesName}>{s.common_name}</Text>
                <Text style={[styles.speciesRarity, { color: getRarityColor(s.rarity) }]}>
                  {s.rarity}
                </Text>
                {selectedSpecies.includes(s.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Duration</Text>
          
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateLabel}>Start Time:</Text>
            <Text style={styles.dateValue}>{startTime.toLocaleString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateLabel}>End Time:</Text>
            <Text style={styles.dateValue}>{endTime.toLocaleString()}</Text>
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowStartPicker(Platform.OS === 'ios')
                if (date) setStartTime(date)
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowEndPicker(Platform.OS === 'ios')
                if (date) setEndTime(date)
              }}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.createButton, createEvent.isPending && styles.createButtonDisabled]}
          onPress={handleCreateEvent}
          disabled={createEvent.isPending}
        >
          <Text style={styles.createButtonText}>
            {createEvent.isPending ? 'Creating Event...' : 'Create Event'}
          </Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </>
  )
}

function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#95A5A6',
    uncommon: '#52B788',
    rare: '#3498DB',
    epic: '#9B59B6',
    legendary: '#F39C12',
  }
  return colors[rarity] || colors.common
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  section: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ECF0F1',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#3498DB',
  },
  chipText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  speciesCard: {
    width: '48%',
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    marginRight: '2%',
    position: 'relative',
  },
  speciesCardSelected: {
    backgroundColor: '#E8F8F5',
    borderWidth: 2,
    borderColor: '#27AE60',
  },
  speciesName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  speciesRarity: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 20,
    color: '#27AE60',
  },
  dateButton: {
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#27AE60',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: '#95A5A6',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  spacer: {
    height: 40,
  },
})

