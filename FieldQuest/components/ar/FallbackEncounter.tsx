/**
 * Fallback encounter game (non-AR)
 * Timed circle-shrinking tap game
 */

import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import type { Species } from '@/lib/types';

interface Props {
  species: Species;
  onThrow: (quality: number) => void;
  isLoading: boolean;
}

export function FallbackEncounter({ species, onThrow, isLoading }: Props) {
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [throwQuality, setThrowQuality] = useState(0);
  
  const circleSize = useRef(new Animated.Value(300)).current;
  const targetSize = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for target
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const startGame = () => {
    setGameActive(true);
    setShowResult(false);
    circleSize.setValue(300);
    
    // Shrink circle over 2 seconds
    Animated.timing(circleSize, {
      toValue: 50,
      duration: 2000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && gameActive) {
        // Time ran out
        handleTap();
      }
    });
  };

  const handleTap = () => {
    if (!gameActive) {
      startGame();
      return;
    }

    setGameActive(false);
    
    // Calculate quality based on circle size
    // Smaller circle = better throw
    const currentSize = (circleSize as any)._value;
    const quality = Math.max(0, Math.min(1, (300 - currentSize) / 250));
    
    setThrowQuality(quality);
    setShowResult(true);

    // Submit throw after brief delay
    setTimeout(() => {
      onThrow(quality);
      setShowResult(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Species Display */}
      <View style={styles.speciesContainer}>
        <Animated.View 
          style={[
            styles.speciesCircle,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.speciesEmoji}>
            {species.species_type === 'fish' ? '🐟' :
             species.species_type === 'bird' ? '🦅' :
             species.species_type === 'mammal' ? '🦌' :
             species.species_type === 'amphibian' ? '🐸' :
             species.species_type === 'reptile' ? '🦎' : '🦋'}
          </Text>
        </Animated.View>
      </View>

      {/* Game Area */}
      <TouchableOpacity
        style={styles.gameArea}
        onPress={handleTap}
        activeOpacity={1}
        disabled={isLoading}
      >
        {!gameActive && !showResult && !isLoading && (
          <View style={styles.startPrompt}>
            <Text style={styles.promptText}>Tap to Start!</Text>
            <Text style={styles.promptSubtext}>
              Tap again when the circle is smallest
            </Text>
          </View>
        )}

        {gameActive && (
          <Animated.View
            style={[
              styles.shrinkingCircle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: Animated.divide(circleSize, 2),
              },
            ]}
          />
        )}

        {showResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {throwQuality > 0.8 ? 'Excellent!' :
               throwQuality > 0.6 ? 'Great!' :
               throwQuality > 0.4 ? 'Good' :
               throwQuality > 0.2 ? 'Nice Try' : 'Missed!'}
            </Text>
            <View style={styles.qualityBar}>
              <View 
                style={[
                  styles.qualityFill,
                  { width: `${throwQuality * 100}%` },
                ]}
              />
            </View>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Throwing...</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to Catch:</Text>
        <Text style={styles.instructionsText}>
          1. Tap to start the timer{'\n'}
          2. Watch the circle shrink{'\n'}
          3. Tap when it's smallest for best results
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  speciesContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  speciesCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  speciesEmoji: {
    fontSize: 64,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderStyle: 'dashed',
  },
  startPrompt: {
    alignItems: 'center',
  },
  promptText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  promptSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  shrinkingCircle: {
    borderWidth: 4,
    borderColor: '#2E7D32',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  qualityBar: {
    width: 200,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  qualityFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  instructions: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

