/**
 * Profile screen - user stats and settings
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/state/store';
import { api } from '@/lib/api';
import { xpForNextLevel } from '@/lib/geo';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, clearUser } = useUserStore();

  const { data: stats } = useQuery({
    queryKey: ['collection-stats', profile?.id],
    queryFn: () => profile ? api.getCollectionStats(profile.id) : null,
    enabled: !!profile,
  });

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await api.signOut();
            clearUser();
            router.replace('/');
          },
        },
      ]
    );
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const xpNeeded = xpForNextLevel(profile.level);
  const xpProgress = ((profile.total_xp % xpNeeded) / xpNeeded) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>

      {/* Level & XP */}
      <View style={styles.section}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelBadge}>Level {profile.level}</Text>
          <Text style={styles.xpText}>{profile.total_xp} XP</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${xpProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {xpNeeded - (profile.total_xp % xpNeeded)} XP to level {profile.level + 1}
        </Text>
      </View>

      {/* Collection Stats */}
      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collection</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="albums"
              label="Total Caught"
              value={stats.caught_species}
              color="#4CAF50"
            />
            <StatCard
              icon="star"
              label="Completion"
              value={`${(stats.completion_rate * 100).toFixed(0)}%`}
              color="#FF9800"
            />
            <StatCard
              icon="trophy"
              label="Rare Species"
              value={stats.rare_caught + stats.epic_caught + stats.legendary_caught}
              color="#9C27B0"
            />
            <StatCard
              icon="sparkles"
              label="Legendary"
              value={stats.legendary_caught}
              color="#FFD700"
            />
          </View>
        </View>
      )}

      {/* Rarity Breakdown */}
      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Rarity</Text>
          <RarityBar label="Common" count={stats.common_caught} color="#9E9E9E" />
          <RarityBar label="Uncommon" count={stats.uncommon_caught} color="#4CAF50" />
          <RarityBar label="Rare" count={stats.rare_caught} color="#2196F3" />
          <RarityBar label="Epic" count={stats.epic_caught} color="#9C27B0" />
          <RarityBar label="Legendary" count={stats.legendary_caught} color="#FF9800" />
        </View>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="#666" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" />
          <Text style={styles.settingText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
          <Text style={[styles.settingText, { color: '#D32F2F' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={32} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RarityBar({ label, count, color }: any) {
  return (
    <View style={styles.rarityBar}>
      <View style={[styles.rarityDot, { backgroundColor: color }]} />
      <Text style={styles.rarityLabel}>{label}</Text>
      <Text style={styles.rarityCount}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#C8E6C9',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  xpText: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  rarityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rarityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  rarityLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  rarityCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});

