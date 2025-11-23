/**
 * AR Model Utilities
 * Helper functions for loading and using TensorFlow.js models for offline AR identification
 */

/**
 * Check if TensorFlow.js is available
 */
export function isTensorFlowAvailable(): boolean {
  return typeof window !== 'undefined' && 'tf' in window;
}

/**
 * Load TensorFlow.js model for offline species identification
 * Falls back to basic identification if TensorFlow.js is not available
 */
export async function loadOfflineARModel(modelType: 'species' | 'bird' | 'macro'): Promise<any> {
  if (!isTensorFlowAvailable()) {
    // Return a mock model object that uses basic identification
    return {
      type: 'basic',
      modelType,
      identify: async (imageData: string) => {
        const { identifyOffline } = await import('./offline-identification');
        return identifyOffline(imageData, modelType);
      },
    };
  }

  try {
    // Try to load TensorFlow.js model
    const tf = (window as any).tf;
    if (!tf) {
      throw new Error('TensorFlow.js not loaded');
    }

    // Model paths would be configured based on modelType
    const modelPaths: Record<string, string> = {
      species: '/models/species-identification/model.json',
      bird: '/models/bird-identification/model.json',
      macro: '/models/macro-identification/model.json',
    };

    const modelPath = modelPaths[modelType] || modelPaths.species;

    try {
      // Try to load the model
      const model = await tf.loadLayersModel(modelPath);
      return {
        type: 'tensorflow',
        modelType,
        model,
        identify: async (imageData: string) => {
          // Preprocess and run inference
          const preprocessed = await preprocessImageForModel(imageData);
          const predictions = await model.predict(preprocessed);
          const result = await processPredictions(predictions, modelType);
          return result;
        },
      };
    } catch (loadError) {
      console.warn(`Model not found at ${modelPath}, using basic identification`);
      // Fallback to basic identification
      return {
        type: 'basic',
        modelType,
        identify: async (imageData: string) => {
          const { identifyOffline } = await import('./offline-identification');
          return identifyOffline(imageData, modelType);
        },
      };
    }
  } catch (error) {
    console.warn('TensorFlow.js model loading failed, using basic identification:', error);
    // Fallback to basic identification
    return {
      type: 'basic',
      modelType,
      identify: async (imageData: string) => {
        const { identifyOffline } = await import('./offline-identification');
        return identifyOffline(imageData, modelType);
      },
    };
  }
}

/**
 * Run identification using offline model
 */
export async function identifyWithOfflineModel(
  imageData: string,
  modelType: 'species' | 'bird' | 'macro'
): Promise<{ label: string; confidence: number } | null> {
  try {
    const model = await loadOfflineARModel(modelType);
    if (!model || !model.identify) return null;

    const result = await model.identify(imageData);
    
    if (result.status === 'ok') {
      return {
        label: result.label,
        confidence: result.confidence || 0,
      };
    }

    return null;
  } catch (error) {
    console.error('Offline model identification error:', error);
    return null;
  }
}

/**
 * Preprocess image for model input
 */
export async function preprocessImageForModel(imageData: string): Promise<any> {
  if (!isTensorFlowAvailable()) {
    throw new Error('TensorFlow.js not available');
  }

  const tf = (window as any).tf;
  if (!tf) {
    throw new Error('TensorFlow.js not loaded');
  }

  // Create image element from base64
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageData;
  });

  // Convert to tensor and preprocess
  const imageTensor = tf.browser.fromPixels(img);
  const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
  const normalized = resized.div(255.0);
  const expanded = normalized.expandDims(0); // Add batch dimension

  // Clean up intermediate tensors
  imageTensor.dispose();
  resized.dispose();
  normalized.dispose();

  return expanded;
}

/**
 * Process model predictions into identification results
 */
async function processPredictions(
  predictions: any,
  modelType: 'species' | 'bird' | 'macro'
): Promise<{ label: string; confidence: number }> {
  const tf = (window as any).tf;
  
  // Get top prediction
  const topPrediction = await predictions.argMax(1).data();
  const confidenceValues = await predictions.data();
  
  const topIndex = topPrediction[0];
  const confidence = confidenceValues[topIndex];

  // In production, would map index to species labels
  const label = `Identified ${modelType} (index: ${topIndex})`;

  // Clean up
  predictions.dispose();

  return {
    label,
    confidence: Math.max(0, Math.min(1, confidence)),
  };
}

