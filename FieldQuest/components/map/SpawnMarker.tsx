import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import { ActiveSpawn, Species } from '../../lib/types'

interface SpawnMarkerProps {
  spawn: ActiveSpawn & { species: Species }
  onPress: (spawn: ActiveSpawn) => void
}

export const SpawnMarker: React.FC<SpawnMarkerProps> = ({ spawn, onPress }) => {
  const rarityColor = getRarityColor(spawn.species.rarity)
  const timeRemaining = getTimeRemaining(spawn.expires_at)

  return (
    <MapboxGL.PointAnnotation
      id={`spawn-${spawn.id}`}
      coordinate={[spawn.lng, spawn.lat]}
      onSelected={() => onPress(spawn)}
    >
      <TouchableOpacity
        style={[styles.markerContainer, { borderColor: rarityColor }]}
        onPress={() => onPress(spawn)}
        activeOpacity={0.7}
      >
        {/* Pulsing animation indicator for rare+ spawns */}
        {['rare', 'epic', 'legendary'].includes(spawn.species.rarity) && (
          <View style={[styles.pulseOuter, { backgroundColor: rarityColor }]} />
        )}
        
        {/* Main marker */}
        <View style={[styles.marker, { backgroundColor: rarityColor }]}>
          <Text style={styles.markerIcon}>🐾</Text>
        </View>

        {/* Rarity indicator star */}
        {spawn.species.rarity !== 'common' && (
          <View style={styles.rarityBadge}>
            <Text style={styles.rarityText}>
              {getRarityStars(spawn.species.rarity)}
            </Text>
          </View>
        )}

        {/* Timer badge */}
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>{timeRemaining}</Text>
        </View>
      </TouchableOpacity>

      {/* Callout bubble */}
      <MapboxGL.Callout title={spawn.species.common_name}>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{spawn.species.common_name}</Text>
          <Text style={styles.calloutScientific}>
            {spawn.species.scientific_name}
          </Text>
          <View style={styles.calloutRarity}>
            <Text style={[styles.rarityLabel, { color: rarityColor }]}>
              {spawn.species.rarity.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.calloutExpiry}>
            Disappears in {timeRemaining}
          </Text>
        </View>
      </MapboxGL.Callout>
    </MapboxGL.PointAnnotation>
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

function getRarityStars(rarity: string): string {
  const stars: Record<string, string> = {
    uncommon: '⭐',
    rare: '⭐⭐',
    epic: '⭐⭐⭐',
    legendary: '✨⭐⭐⭐✨',
  }
  return stars[rarity] || ''
}

function getTimeRemaining(expiresAt: string): string {
  const now = new Date().getTime()
  const expiry = new Date(expiresAt).getTime()
  const diffMs = expiry - now

  if (diffMs <= 0) return 'EXPIRED'

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  return `${minutes}m`
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseOuter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.3,
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 16,
  },
  rarityBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  rarityText: {
    fontSize: 8,
  },
  timerBadge: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  callout: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  calloutScientific: {
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  calloutRarity: {
    marginBottom: 8,
  },
  rarityLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  calloutExpiry: {
    fontSize: 12,
    color: '#E74C3C',
    fontStyle: 'italic',
  },
})

