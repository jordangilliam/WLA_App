/**
 * Offline Identification Utilities
 * Fallback identification when online services are unavailable
 */

import { IdentificationResult, IdentificationMode } from './types';

/**
 * Simple offline identification using basic image analysis
 * This is a fallback when online services are unavailable
 */
export async function identifyOffline(
  imageData: string,
  mode: IdentificationMode
): Promise<IdentificationResult> {
  // Basic offline identification using color analysis and basic heuristics
  // In production, this would use TensorFlow.js models
  
  try {
    // Create image element from base64
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageData;
    });

    // Basic analysis (placeholder - would use ML model in production)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Get image data for analysis
    const imageDataArray = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageDataArray.data;

    // Simple color analysis (placeholder)
    let greenPixels = 0;
    let bluePixels = 0;
    let brownPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Count green (vegetation)
      if (g > r && g > b && g > 100) greenPixels++;
      // Count blue (water/sky)
      if (b > r && b > g && b > 100) bluePixels++;
      // Count brown (soil/wood)
      if (r > 100 && g > 80 && b < 100 && Math.abs(r - g) < 30) brownPixels++;
    }

    const totalPixels = data.length / 4;
    const greenRatio = greenPixels / totalPixels;
    const blueRatio = bluePixels / totalPixels;
    const brownRatio = brownPixels / totalPixels;

    // Basic classification based on color ratios
    let label = 'Unknown Species';
    let confidence = 0.3; // Low confidence for offline identification

    if (mode === 'macro') {
      if (greenRatio > 0.3) {
        label = 'Aquatic Macroinvertebrate (likely)';
        confidence = 0.4;
      } else if (blueRatio > 0.2) {
        label = 'Aquatic Species (likely)';
        confidence = 0.35;
      }
    } else if (mode === 'bird') {
      if (brownRatio > 0.2 || (greenRatio > 0.2 && brownRatio > 0.1)) {
        label = 'Bird Species (likely)';
        confidence = 0.35;
      }
    } else {
      // General species
      if (greenRatio > 0.4) {
        label = 'Plant Species (likely)';
        confidence = 0.4;
      } else if (blueRatio > 0.3) {
        label = 'Aquatic Species (likely)';
        confidence = 0.35;
      }
    }

    return {
      status: 'ok',
      label,
      confidence,
      provider: 'offline',
      mode,
      reason: 'Offline identification - low confidence. Connect to internet for better results.',
      raw: {
        greenRatio,
        blueRatio,
        brownRatio,
      },
    };
  } catch (error) {
    console.error('Offline identification error:', error);
    return {
      status: 'error',
      label: 'Identification Failed',
      confidence: 0,
      provider: 'offline',
      mode,
      reason: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if offline identification is available
 */
export function isOfflineIdentificationAvailable(): boolean {
  return typeof window !== 'undefined' && 'Image' in window && 'CanvasRenderingContext2D' in window;
}

