/**
 * Welcome/Auth screen
 */

import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore, useAppStore } from '@/state/store';
import { api } from '@/lib/api';

export default function WelcomeScreen() {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const isInitialized = useAppStore((state) => state.isInitialized);

  useEffect(() => {
    // Redirect to map if already authenticated
    if (isInitialized && profile) {
      router.replace('/(tabs)/map');
    }
  }, [isInitialized, profile]);

  const handleSignIn = async () => {
    // In production, this would redirect to WLA_App OAuth
    // For now, show placeholder
    alert('Sign in would redirect to WLA_App OAuth flow');
    
    // TODO: Implement OAuth flow
    // 1. Redirect to WLA_App: https://wla-app.vercel.app/auth/mobile
    // 2. WLA_App authenticates user
    // 3. Returns JWT token
    // 4. Store token and fetch profile
    
    // Mock for development:
    // router.replace('/(tabs)/map');
  };

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading FieldQuest...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🦌</Text>
          <Text style={styles.title}>FieldQuest</Text>
          <Text style={styles.subtitle}>
            Explore. Discover. Collect Wildlife.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem 
            icon="📍" 
            text="Discover wildlife at real field sites" 
          />
          <FeatureItem 
            icon="📸" 
            text="Use AR to encounter species" 
          />
          <FeatureItem 
            icon="📚" 
            text="Learn about PA conservation" 
          />
          <FeatureItem 
            icon="🏆" 
            text="Complete your collection" 
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={handleSignIn}
        >
          <Text style={styles.signInButtonText}>
            Sign In with WLA Account
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Wildlife Leadership Academy{'\n'}
          Conservation Education Platform
        </Text>
      </View>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#E8F5E9',
    textAlign: 'center',
  },
  features: {
    width: '100%',
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  signInButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#C8E6C9',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
});

