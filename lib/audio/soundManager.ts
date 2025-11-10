/**
 * Sound Manager for WildPraxis
 * Handles all audio feedback with Web Audio API
 */

type SoundType =
  | 'check-in'
  | 'points'
  | 'level-up'
  | 'achievement'
  | 'button-click'
  | 'success'
  | 'error'
  | 'notification';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<SoundType, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    try {
      // Initialize Audio Context (lazy loaded)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Load enabled state from localStorage
      const savedEnabled = localStorage.getItem('sounds-enabled');
      this.enabled = savedEnabled !== 'false';

      // Load volume from localStorage
      const savedVolume = localStorage.getItem('sounds-volume');
      if (savedVolume) {
        this.volume = parseFloat(savedVolume);
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Play a sound effect
   */
  async play(soundType: SoundType) {
    if (!this.enabled || !this.audioContext) return;

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Check if sound is cached
      let buffer = this.sounds.get(soundType);

      if (!buffer) {
        // Load and cache sound
        buffer = await this.loadSound(soundType);
        this.sounds.set(soundType, buffer);
      }

      // Play the sound
      this.playBuffer(buffer);
    } catch (error) {
      console.warn(`Failed to play sound: ${soundType}`, error);
    }
  }

  /**
   * Load a sound file
   */
  private async loadSound(soundType: SoundType): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const soundPath = `/sounds/${soundType}.mp3`;
    
    try {
      const response = await fetch(soundPath);
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      // Fallback: generate procedural sound if file not found
      console.warn(`Sound file not found: ${soundPath}, using procedural sound`);
      return this.generateProceduralSound(soundType);
    }
  }

  /**
   * Play an audio buffer
   */
  private playBuffer(buffer: AudioBuffer) {
    if (!this.audioContext) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = this.volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(0);
  }

  /**
   * Generate procedural sounds as fallback
   */
  private generateProceduralSound(soundType: SoundType): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    let duration = 0.15; // Default duration
    let frequency = 440;

    // Configure sound based on type
    switch (soundType) {
      case 'check-in':
        frequency = 523.25; // C5
        duration = 0.2;
        break;
      case 'points':
        frequency = 659.25; // E5
        duration = 0.1;
        break;
      case 'level-up':
        frequency = 783.99; // G5
        duration = 0.5;
        break;
      case 'achievement':
        frequency = 1046.5; // C6
        duration = 0.3;
        break;
      case 'success':
        frequency = 880; // A5
        duration = 0.15;
        break;
      case 'button-click':
        frequency = 800;
        duration = 0.05;
        break;
      case 'error':
        frequency = 200;
        duration = 0.2;
        break;
      case 'notification':
        frequency = 600;
        duration = 0.15;
        break;
    }

    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate sine wave with envelope
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 5); // Exponential decay
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    }

    return buffer;
  }

  /**
   * Enable/disable sounds
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('sounds-enabled', String(enabled));
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('sounds-volume', String(this.volume));
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Preload common sounds
   */
  async preloadSounds() {
    const commonSounds: SoundType[] = ['check-in', 'points', 'button-click', 'success'];
    
    for (const soundType of commonSounds) {
      try {
        const buffer = await this.loadSound(soundType);
        this.sounds.set(soundType, buffer);
      } catch (error) {
        console.warn(`Failed to preload sound: ${soundType}`);
      }
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

/**
 * Haptic feedback (for mobile devices)
 */
export const haptics = {
  /**
   * Light impact (button press)
   */
  light() {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        (window as any).Capacitor.Plugins.Haptics?.impact({ style: 'light' });
      } catch (e) {
        // Haptics not available
      }
    }
  },

  /**
   * Medium impact (check-in, points)
   */
  medium() {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        (window as any).Capacitor.Plugins.Haptics?.impact({ style: 'medium' });
      } catch (e) {
        // Haptics not available
      }
    }
  },

  /**
   * Heavy impact (level up, achievement)
   */
  heavy() {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        (window as any).Capacitor.Plugins.Haptics?.impact({ style: 'heavy' });
      } catch (e) {
        // Haptics not available
      }
    }
  },

  /**
   * Success notification
   */
  success() {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        (window as any).Capacitor.Plugins.Haptics?.notification({ type: 'success' });
      } catch (e) {
        // Haptics not available
      }
    }
  },

  /**
   * Error notification
   */
  error() {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        (window as any).Capacitor.Plugins.Haptics?.notification({ type: 'error' });
      } catch (e) {
        // Haptics not available
      }
    }
  },
};

