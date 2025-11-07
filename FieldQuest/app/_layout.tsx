/**
 * Root layout with providers and navigation
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { locationService } from '@/lib/location';
import { useLocationStore, useUserStore, useAppStore } from '@/state/store';
import { api } from '@/lib/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const setLocation = useLocationStore((state) => state.setLocation);
  const setProfile = useUserStore((state) => state.setProfile);
  const setInitialized = useAppStore((state) => state.setInitialized);

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      // Check authentication
      const isAuth = await api.isAuthenticated();
      
      if (isAuth) {
        // Load user profile
        const profile = await api.getUserProfile();
        if (profile) {
          setProfile(profile);
        }

        // Start location tracking
        const started = await locationService.startTracking();
        if (started) {
          // Subscribe to location updates
          locationService.onLocationUpdate((location) => {
            setLocation(location);
          });
        }
      }

      setInitialized(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      setInitialized(true);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#fff' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen 
              name="encounter/[spawnId]" 
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

