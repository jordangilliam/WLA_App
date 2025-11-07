/**
 * Collection screen - shows all species and user's catches
 */

import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tantml:react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { useUserStore } from '@/state/store';
import { getRarityColor } from '@/lib/geo';

export default function CollectionScreen() {
  const profile = useUserStore((state) => state.profile);
  const [filter, setFilter] = useState<'all' | 'caught' | 'uncaught'>('all');

  const { data: allSpecies } = useQuery({
    queryKey: ['species'],
    queryFn: () => api.getAllSpecies(),
  });

  const { data: caughtSpecies } = useQuery({
    queryKey: ['user-species', profile?.id],
    queryFn: () => profile ? api.getUserSpecies(profile.id) : [],
    enabled: !!profile,
  });

  const { data: stats } = useQuery({
    queryKey: ['collection-stats', profile?.id],
    queryFn: () => profile ? api.getCollectionStats(profile.id) : null,
    enabled: !!profile,
  });

  const caughtIds = new Set(caughtSpecies?.map(c => c.species_id));
  
  const filteredSpecies = allSpecies?.filter(species => {
    if (filter === 'caught') return caughtIds.has(species.id);
    if (filter === 'uncaught') return !caughtIds.has(species.id);
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Collection</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {stats?.caught_species || 0} / {stats?.total_species || 0} Species
          </Text>
          <Text style={styles.completionText}>
            {((stats?.completion_rate || 0) * 100).toFixed(1)}% Complete
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <FilterTab
          label="All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterTab
          label="Caught"
          active={filter === 'caught'}
          onPress={() => setFilter('caught')}
        />
        <FilterTab
          label="Uncaught"
          active={filter === 'uncaught'}
          onPress={() => setFilter('uncaught')}
        />
      </View>

      {/* Species Grid */}
      <FlatList
        data={filteredSpecies}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SpeciesCard
            species={item}
            caught={caughtIds.has(item.id)}
          />
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

function FilterTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.filterTab, active && styles.filterTabActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function SpeciesCard({ species, caught }: { species: any; caught: boolean }) {
  const rarityColor = getRarityColor(species.rarity);

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        { borderColor: rarityColor },
        !caught && styles.cardUncaught,
      ]}
    >
      <View style={[styles.cardHeader, { backgroundColor: rarityColor }]}>
        <Text style={styles.cardEmoji}>
          {species.species_type === 'fish' ? '🐟' :
           species.species_type === 'bird' ? '🦅' :
           species.species_type === 'mammal' ? '🦌' :
           species.species_type === 'amphibian' ? '🐸' :
           species.species_type === 'reptile' ? '🦎' : '🦋'}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.cardName, !caught && styles.textUncaught]}>
          {caught ? species.name : '???'}
        </Text>
        <Text style={styles.cardRarity}>{species.rarity}</Text>
        {caught && (
          <View style={styles.cardStats}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.cardStatsText}>Caught</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#2E7D32',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#C8E6C9',
  },
  completionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#fff',
  },
  filterTabText: {
    fontSize: 14,
    color: '#999',
  },
  filterTabTextActive: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  grid: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cardUncaught: {
    opacity: 0.5,
  },
  cardHeader: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 48,
  },
  cardBody: {
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  textUncaught: {
    color: '#999',
  },
  cardRarity: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardStatsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

