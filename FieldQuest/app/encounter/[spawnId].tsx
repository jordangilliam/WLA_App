/**
 * Encounter screen - AR or fallback catch mechanics
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { useLocationStore, useEncounterStore, useUserStore } from '@/state/store';
import { FallbackEncounter } from '@/components/ar/FallbackEncounter';
import type { EncounterStartResponse, EncounterThrowResponse } from '@/lib/types';

export default function EncounterScreen() {
  const { spawnId } = useLocalSearchParams<{ spawnId: string }>();
  const router = useRouter();
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const { setEncounter, clearEncounter } = useEncounterStore();
  const profile = useUserStore((state) => state.profile);
  
  const [encounterData, setEncounterData] = useState<EncounterStartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Start encounter mutation
  const startEncounter = useMutation({
    mutationFn: async () => {
      if (!currentLocation || !spawnId) throw new Error('Missing data');
      return api.startEncounter(
        spawnId,
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    },
    onSuccess: (data) => {
      setEncounterData(data);
      setEncounter({
        id: data.encounter.id,
        spawnId: data.encounter.spawn_id,
        speciesId: data.encounter.species_id,
        speciesName: data.species.name,
        attempts: 0,
        startedAt: data.encounter.started_at,
      });
      setIsLoading(false);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to start encounter');
      router.back();
    },
  });

  // Throw mutation
  const throwAtCreature = useMutation({
    mutationFn: async (quality: number) => {
      if (!encounterData) throw new Error('No encounter');
      return api.throwAtEncounter(encounterData.encounter.id, quality);
    },
    onSuccess: (result: EncounterThrowResponse) => {
      if (result.success) {
        handleSuccess(result);
      } else if (result.fled) {
        handleFled();
      } else {
        handleMiss(result.attempts_remaining || 0);
      }
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to catch');
    },
  });

  useEffect(() => {
    startEncounter.mutate();
    
    return () => {
      clearEncounter();
    };
  }, []);

  const handleThrow = (quality: number) => {
    if (throwAtCreature.isPending) return;
    throwAtCreature.mutate(quality);
    setAttempts(prev => prev + 1);
  };

  const handleSuccess = (result: EncounterThrowResponse) => {
    setShowSuccess(true);
    
    // Show success alert
    setTimeout(() => {
      Alert.alert(
        '🎉 Success!',
        `You caught ${encounterData?.species.name}!\n\n` +
        `+${result.xp} XP` +
        (result.is_first_catch ? '\n⭐ First catch bonus!' : '') +
        (result.level_up ? `\n🎊 Level up! Now level ${result.new_level}` : ''),
        [{ text: 'Continue', onPress: () => router.back() }]
      );
    }, 500);
  };

  const handleMiss = (attemptsRemaining: number) => {
    Alert.alert(
      'Missed!',
      `The ${encounterData?.species.name} dodged!\n\n` +
      `${attemptsRemaining} attempts remaining`,
      [{ text: 'Try Again' }]
    );
  };

  const handleFled = () => {
    Alert.alert(
      'Fled!',
      `The ${encounterData?.species.name} got away...`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleFlee = () => {
    Alert.alert(
      'Flee?',
      'Are you sure you want to flee from this encounter?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Flee', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  if (isLoading || !encounterData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Starting encounter...</Text>
      </View>
    );
  }

  const species = encounterData.species;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.speciesName}>{species.name}</Text>
          <Text style={styles.scientificName}>{species.scientific_name}</Text>
        </View>
        <View style={styles.rarityBadge}>
          <Text style={styles.rarityText}>{species.rarity}</Text>
        </View>
      </View>

      {/* Species Info */}
      <View style={styles.infoBar}>
        <View style={styles.infoItem}>
          <Ionicons name="analytics" size={16} color="#666" />
          <Text style={styles.infoText}>
            Difficulty: {species.catch_difficulty}/5
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="star" size={16} color="#666" />
          <Text style={styles.infoText}>
            {species.base_xp} XP
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="apps" size={16} color="#666" />
          <Text style={styles.infoText}>
            Attempts: {attempts}/3
          </Text>
        </View>
      </View>

      {/* Encounter Game */}
      {!showSuccess && (
        <FallbackEncounter
          species={species}
          onThrow={handleThrow}
          isLoading={throwAtCreature.isPending}
        />
      )}

      {/* Success Animation */}
      {showSuccess && (
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successText}>Caught!</Text>
        </View>
      )}

      {/* Flee Button */}
      {!showSuccess && (
        <TouchableOpacity 
          style={styles.fleeButton}
          onPress={handleFlee}
          disabled={throwAtCreature.isPending}
        >
          <Ionicons name="exit-outline" size={24} color="#fff" />
          <Text style={styles.fleeButtonText}>Flee</Text>
        </TouchableOpacity>
      )}

      {/* Educational Facts */}
      {species.educational_facts && (
        <View style={styles.factsContainer}>
          <Text style={styles.factsTitle}>About this species:</Text>
          <Text style={styles.factsText}>
            {species.educational_facts.fun_fact || species.description}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#2E7D32',
  },
  headerLeft: {
    flex: 1,
  },
  speciesName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#C8E6C9',
    marginTop: 4,
  },
  rarityBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 120,
    marginBottom: 24,
  },
  successText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  fleeButton: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D32F2F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fleeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  factsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  factsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  factsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

