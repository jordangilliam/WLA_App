import { NextResponse } from 'next/server';

/**
 * AI Species Identification API
 * 
 * Identifies species from photos using AI/ML models.
 * 
 * Production Options:
 * 1. Google Vision API - General image recognition
 * 2. iNaturalist API - Specialized for wildlife
 * 3. Custom TensorFlow model - Fine-tuned for PA species
 * 4. AWS Rekognition - Image analysis
 * 
 * For now, returns sample data with confidence scores.
 */

interface SpeciesMatch {
  species: string;
  scientificName: string;
  commonName: string;
  confidence: number; // 0-100
  category: 'Fish' | 'Bird' | 'Plant' | 'Insect' | 'Macroinvertebrate' | 'Mammal' | 'Reptile';
  description: string;
  habitat: string;
  conservation: 'Native' | 'Introduced' | 'Invasive' | 'Endangered';
  imageUrl?: string;
  tags: string[];
  similarSpecies?: {
    name: string;
    reason: string;
  }[];
}

interface IdentificationResult {
  success: boolean;
  matches: SpeciesMatch[];
  timestamp: number;
  source: string;
  processingTime: number; // milliseconds
}

// Sample PA species database for matching
const PA_SPECIES: SpeciesMatch[] = [
  // Fish
  {
    species: 'brook-trout',
    scientificName: 'Salvelinus fontinalis',
    commonName: 'Brook Trout',
    confidence: 0,
    category: 'Fish',
    description: 'PA\'s only native trout with distinctive worm-like markings on back',
    habitat: 'Cold, clean streams with high oxygen',
    conservation: 'Native',
    tags: ['trout', 'cold-water', 'native', 'brook trout', 'brookie'],
    similarSpecies: [
      { name: 'Brown Trout', reason: 'Similar size and habitat' },
      { name: 'Rainbow Trout', reason: 'All are trout species' }
    ]
  },
  {
    species: 'brown-trout',
    scientificName: 'Salmo trutta',
    commonName: 'Brown Trout',
    confidence: 0,
    category: 'Fish',
    description: 'Introduced trout with dark spots and orange/red spots with halos',
    habitat: 'Streams and lakes, tolerates warmer water than brook trout',
    conservation: 'Introduced',
    tags: ['trout', 'introduced', 'brown trout', 'brownies'],
    similarSpecies: [
      { name: 'Brook Trout', reason: 'Both stream trout' },
      { name: 'Atlantic Salmon', reason: 'Similar appearance' }
    ]
  },
  {
    species: 'smallmouth-bass',
    scientificName: 'Micropterus dolomieu',
    commonName: 'Smallmouth Bass',
    confidence: 0,
    category: 'Fish',
    description: 'Bronze-colored bass with vertical bars on sides',
    habitat: 'Clear, rocky streams and lakes',
    conservation: 'Native',
    tags: ['bass', 'smallmouth', 'bronze back', 'native'],
    similarSpecies: [
      { name: 'Largemouth Bass', reason: 'Similar body shape' },
      { name: 'Rock Bass', reason: 'Similar coloration' }
    ]
  },

  // Macroinvertebrates
  {
    species: 'mayfly-nymph',
    scientificName: 'Ephemeroptera',
    commonName: 'Mayfly Nymph',
    confidence: 0,
    category: 'Macroinvertebrate',
    description: 'Three tail filaments, gills on abdomen, indicator of excellent water quality',
    habitat: 'Clean, well-oxygenated streams',
    conservation: 'Native',
    tags: ['mayfly', 'aquatic insect', 'water quality', 'clean water'],
    similarSpecies: [
      { name: 'Stonefly Nymph', reason: 'Similar size and habitat' },
      { name: 'Damselfly Nymph', reason: 'Both aquatic insects' }
    ]
  },

  // Plants
  {
    species: 'eastern-hemlock',
    scientificName: 'Tsuga canadensis',
    commonName: 'Eastern Hemlock',
    confidence: 0,
    category: 'Plant',
    description: 'Graceful evergreen tree critical for stream ecosystems',
    habitat: 'Cool, moist ravines and stream banks',
    conservation: 'Native',
    tags: ['tree', 'evergreen', 'hemlock', 'conifer', 'native'],
    similarSpecies: [
      { name: 'White Pine', reason: 'Both evergreen trees' },
      { name: 'Spruce', reason: 'Similar needle arrangement' }
    ]
  },

  // Insects
  {
    species: 'monarch-butterfly',
    scientificName: 'Danaus plexippus',
    commonName: 'Monarch Butterfly',
    confidence: 0,
    category: 'Insect',
    description: 'Iconic orange and black butterfly, migratory species',
    habitat: 'Meadows, fields, gardens with milkweed',
    conservation: 'Native',
    tags: ['butterfly', 'monarch', 'pollinator', 'migratory', 'milkweed'],
    similarSpecies: [
      { name: 'Viceroy Butterfly', reason: 'Mimic species - very similar appearance' },
      { name: 'Queen Butterfly', reason: 'Related species' }
    ]
  }
];

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const category = formData.get('category') as string | null;

    if (!photo) {
      return NextResponse.json({
        success: false,
        error: 'No photo provided'
      }, { status: 400 });
    }

    // In production, send photo to AI service:
    // const response = await identifySpecies(photo);
    
    // For now, return sample matches based on category
    let matches = [...PA_SPECIES];
    
    if (category) {
      matches = matches.filter(s => s.category === category);
    }

    // Simulate AI confidence scores
    matches = matches.map(match => ({
      ...match,
      confidence: Math.floor(Math.random() * 30 + 70) // 70-100% confidence
    })).sort((a, b) => b.confidence - a.confidence).slice(0, 3);

    const processingTime = Date.now() - startTime;

    const result: IdentificationResult = {
      success: true,
      matches,
      timestamp: Date.now(),
      source: 'Sample Data - Replace with AI API in production',
      processingTime
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Species identification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to identify species',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * TODO: Production Implementation
 * 
 * 1. Choose AI Service:
 * 
 *    Option A - iNaturalist API (Best for wildlife):
 *    - Free tier available
 *    - Specialized for species ID
 *    - Large database
 *    - Community-validated
 *    URL: https://www.inaturalist.org/pages/api+reference
 * 
 *    Option B - Google Vision API:
 *    - General image recognition
 *    - Label detection
 *    - Web entity detection
 *    - Paid service
 *    URL: https://cloud.google.com/vision
 * 
 *    Option C - Custom TensorFlow Model:
 *    - Train on PA species
 *    - Best accuracy for local species
 *    - Requires ML expertise
 *    - Can run offline
 * 
 * 2. Implementation Example (iNaturalist):
 * 
 * ```typescript
 * async function identifyWithiNaturalist(photo: File): Promise<SpeciesMatch[]> {
 *   const formData = new FormData();
 *   formData.append('image', photo);
 *   
 *   const response = await fetch('https://api.inaturalist.org/v1/computer_vision/score_image', {
 *     method: 'POST',
 *     body: formData
 *   });
 *   
 *   const data = await response.json();
 *   
 *   return data.results.map(result => ({
 *     scientificName: result.taxon.name,
 *     commonName: result.taxon.preferred_common_name,
 *     confidence: result.score * 100,
 *     category: mapCategory(result.taxon.rank),
 *     imageUrl: result.taxon.default_photo.url,
 *     ...
 *   }));
 * }
 * ```
 * 
 * 3. Add Image Preprocessing:
 *    - Resize to optimal dimensions
 *    - Enhance contrast
 *    - Remove noise
 *    - Crop to subject
 * 
 * 4. Add Confidence Thresholds:
 *    - High: 90-100% - Show confidently
 *    - Medium: 70-89% - Show with caution
 *    - Low: < 70% - Ask for manual confirmation
 * 
 * 5. Add User Feedback Loop:
 *    - Allow users to confirm/correct IDs
 *    - Improve model over time
 *    - Build PA-specific dataset
 * 
 * 6. Add Offline Capability:
 *    - Download model for offline use
 *    - Run TensorFlow.js in browser
 *    - Sync results when online
 * 
 * 7. Environment Variables:
 *    INATURALIST_API_KEY=your_key
 *    GOOGLE_VISION_API_KEY=your_key
 *    or
 *    TENSORFLOW_MODEL_URL=path_to_model
 */

/**
 * Helper: Extract EXIF data from photo
 */
async function extractEXIF(photo: File): Promise<any> {
  // Use exif-js or similar library
  return {
    date: new Date(),
    camera: 'Unknown',
    location: null,
    settings: {}
  };
}

/**
 * Helper: Get similar species for comparison
 */
function getSimilarSpecies(species: string): SpeciesMatch[] {
  return PA_SPECIES.filter(s => 
    s.tags.some(tag => PA_SPECIES.find(sp => sp.species === species)?.tags.includes(tag))
  ).slice(0, 3);
}

