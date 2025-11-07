/**
 * Main map screen - shows user location, field sites, and spawns
 */

import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore, useMapStore } from '@/state/store';
import { api } from '@/lib/api';
import { isWithinGeofence, formatDistance } from '@/lib/geo';
import type { ActiveSpawn, FieldSite } from '@/lib/types';

// Set Mapbox token
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const { nearbySpawns, nearbyFieldSites, setNearbySpawns, setNearbyFieldSites } = useMapStore();
  const [selectedSpawn, setSelectedSpawn] = useState<ActiveSpawn | null>(null);
  const [followUser, setFollowUser] = useState(true);

  // Fetch nearby spawns and sites
  const { data: nearby, isLoading, refetch } = useQuery({
    queryKey: ['nearby', currentLocation?.coords.latitude, currentLocation?.coords.longitude],
    queryFn: () => {
      if (!currentLocation) return null;
      return api.getNearby(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        300
      );
    },
    enabled: !!currentLocation,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  useEffect(() => {
    if (nearby) {
      setNearbySpawns(nearby.spawns);
      setNearbyFieldSites(nearby.fieldSites);
    }
  }, [nearby]);

  const handleSpawnPress = (spawn: ActiveSpawn) => {
    if (!currentLocation) return;

    const isInRange = isWithinGeofence(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      spawn.latitude,
      spawn.longitude,
      50 // 50m interaction radius
    );

    if (isInRange) {
      // Start encounter
      router.push(`/encounter/${spawn.id}`);
    } else {
      // Show distance
      setSelectedSpawn(spawn);
    }
  };

  const centerOnUser = () => {
    if (currentLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [
          currentLocation.coords.longitude,
          currentLocation.coords.latitude,
        ],
        zoomLevel: 16,
        animationDuration: 1000,
      });
      setFollowUser(true);
    }
  };

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Outdoors}
        compassEnabled
        compassPosition={{ top: 60, right: 16 }}
        onRegionIsChanging={() => setFollowUser(false)}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={15}
          centerCoordinate={[
            currentLocation.coords.longitude,
            currentLocation.coords.latitude,
          ]}
          followUserLocation={followUser}
          followUserMode={MapboxGL.UserTrackingMode.Follow}
        />

        {/* User Location */}
        <MapboxGL.UserLocation
          visible
          showsUserHeadingIndicator
          androidRenderMode="normal"
        />

        {/* Field Sites */}
        {nearbyFieldSites.map((site) => (
          <MapboxGL.PointAnnotation
            key={site.id}
            id={site.id}
            coordinate={[site.longitude, site.latitude]}
          >
            <View style={styles.fieldSiteMarker}>
              <Ionicons name="location" size={32} color="#1976D2" />
            </View>
            <MapboxGL.Callout title={site.name} />
          </MapboxGL.PointAnnotation>
        ))}

        {/* Active Spawns */}
        {nearbySpawns.map((spawn) => (
          <MapboxGL.PointAnnotation
            key={spawn.id}
            id={spawn.id}
            coordinate={[spawn.longitude, spawn.latitude]}
            onSelected={() => handleSpawnPress(spawn)}
          >
            <SpawnMarker spawn={spawn} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>

      {/* Recenter Button */}
      {!followUser && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={centerOnUser}
        >
          <Ionicons name="locate" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Ionicons name="paw" size={20} color="#2E7D32" />
          <Text style={styles.statText}>{nearbySpawns.length} nearby</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="location" size={20} color="#1976D2" />
          <Text style={styles.statText}>{nearbyFieldSites.length} sites</Text>
        </View>
        {isLoading && (
          <ActivityIndicator size="small" color="#2E7D32" />
        )}
      </View>

      {/* Selected Spawn Info */}
      {selectedSpawn && (
        <View style={styles.spawnInfo}>
          <View style={styles.spawnInfoContent}>
            <Text style={styles.spawnName}>{selectedSpawn.species_name}</Text>
            <Text style={styles.spawnDistance}>
              {formatDistance(selectedSpawn.distance_meters || 0)} away
            </Text>
            <Text style={styles.spawnHint}>
              Get within 50m to encounter!
            </Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedSpawn(null)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function SpawnMarker({ spawn }: { spawn: ActiveSpawn }) {
  const rarityColors = {
    common: '#9E9E9E',
    uncommon: '#4CAF50',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FF9800',
  };

  const color = rarityColors[spawn.rarity || 'common'];

  return (
    <View style={[styles.spawnMarker, { backgroundColor: color }]}>
      <Text style={styles.spawnEmoji}>
        {spawn.species_type === 'fish' ? '🐟' :
         spawn.species_type === 'bird' ? '🦅' :
         spawn.species_type === 'mammal' ? '🦌' :
         spawn.species_type === 'amphibian' ? '🐸' :
         spawn.species_type === 'reptile' ? '🦎' : '🦋'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  fieldSiteMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spawnMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  spawnEmoji: {
    fontSize: 24,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statsBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  spawnInfo: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  spawnInfoContent: {
    flex: 1,
  },
  spawnName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  spawnDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  spawnHint: {
    fontSize: 12,
    color: '#999',
  },
});

