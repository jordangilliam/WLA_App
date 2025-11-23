/**
 * Field Guide Data
 * Interactive field guide content for species identification and habitat exploration
 */

export interface InteractiveKeyData {
  id: string;
  title: string;
  description: string;
  steps: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      label: string;
      nextStepId?: string;
      resultId?: string;
    }>;
  }>;
  results: Record<string, {
    id: string;
    name: string;
    scientificName: string;
    description: string;
    imageUrl: string;
    habitat: string;
    characteristics: string[];
  }>;
}

export interface HabitatData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  characteristics: string[];
  commonSpecies: Array<{
    id: string;
    name: string;
    imageUrl?: string;
  }>;
  conservationStatus: string;
  threats: string[];
  conservationActions: string[];
}

/**
 * Get interactive identification key for macroinvertebrates
 */
export function getMacroinvertebrateKey(): InteractiveKeyData {
  return {
    id: 'macro-key',
    title: 'Macroinvertebrate Identification Key',
    description: 'Use this key to identify aquatic macroinvertebrates step by step',
    steps: [
      {
        id: 'start',
        question: 'Does the organism have legs?',
        options: [
          { id: 'has-legs', label: 'Yes, has legs', nextStepId: 'leg-count' },
          { id: 'no-legs', label: 'No legs', nextStepId: 'body-shape' },
        ],
      },
      {
        id: 'leg-count',
        question: 'How many legs does it have?',
        options: [
          { id: 'six-legs', label: '6 legs', resultId: 'mayfly' },
          { id: 'eight-legs', label: '8 legs', resultId: 'water-spider' },
          { id: 'many-legs', label: 'Many legs', resultId: 'crayfish' },
        ],
      },
      {
        id: 'body-shape',
        question: 'What is the body shape?',
        options: [
          { id: 'worm-like', label: 'Worm-like', resultId: 'aquatic-worm' },
          { id: 'flat', label: 'Flat', resultId: 'flatworm' },
          { id: 'round', label: 'Round', resultId: 'snail' },
        ],
      },
    ],
    results: {
      mayfly: {
        id: 'mayfly',
        name: 'Mayfly',
        scientificName: 'Ephemeroptera',
        description: 'Common aquatic insect with three tails and gills on abdomen',
        imageUrl: '/images/species/mayfly.jpg',
        habitat: 'Fast-moving streams',
        characteristics: ['Three tails', 'Gills on abdomen', 'Six legs'],
      },
      'water-spider': {
        id: 'water-spider',
        name: 'Water Spider',
        scientificName: 'Araneae',
        description: 'Aquatic spider that lives underwater',
        imageUrl: '/images/species/water-spider.jpg',
        habitat: 'Still or slow-moving water',
        characteristics: ['Eight legs', 'Hairy body', 'Breathes air'],
      },
      crayfish: {
        id: 'crayfish',
        name: 'Crayfish',
        scientificName: 'Cambaridae',
        description: 'Large crustacean with claws',
        imageUrl: '/images/species/crayfish.jpg',
        habitat: 'Streams and rivers',
        characteristics: ['Large claws', 'Many legs', 'Hard shell'],
      },
      'aquatic-worm': {
        id: 'aquatic-worm',
        name: 'Aquatic Worm',
        scientificName: 'Oligochaeta',
        description: 'Segmented worm found in sediment',
        imageUrl: '/images/species/aquatic-worm.jpg',
        habitat: 'Muddy bottoms',
        characteristics: ['Segmented body', 'No legs', 'Slender'],
      },
      flatworm: {
        id: 'flatworm',
        name: 'Flatworm',
        scientificName: 'Turbellaria',
        description: 'Flat, unsegmented worm',
        imageUrl: '/images/species/flatworm.jpg',
        habitat: 'Under rocks',
        characteristics: ['Flat body', 'No segments', 'Smooth'],
      },
      snail: {
        id: 'snail',
        name: 'Aquatic Snail',
        scientificName: 'Gastropoda',
        description: 'Mollusk with spiral shell',
        imageUrl: '/images/species/snail.jpg',
        habitat: 'Various aquatic habitats',
        characteristics: ['Spiral shell', 'Soft body', 'Single foot'],
      },
    },
  };
}

/**
 * Get habitat guide data
 */
export function getHabitatGuides(): HabitatData[] {
  return [
    {
      id: 'cold-water-stream',
      name: 'Cold-Water Stream',
      description: 'Mountain streams with cold, clear water, ideal for trout',
      imageUrl: '/images/habitats/cold-stream.jpg',
      characteristics: [
        'Water temperature below 20°C',
        'High dissolved oxygen',
        'Rocky substrate',
        'Fast-moving water',
        'Forested riparian zone',
      ],
      commonSpecies: [
        { id: 'brook-trout', name: 'Brook Trout' },
        { id: 'mayfly', name: 'Mayfly' },
        { id: 'stonefly', name: 'Stonefly' },
      ],
      conservationStatus: 'Vulnerable',
      threats: [
        'Warming water temperatures',
        'Sedimentation',
        'Habitat fragmentation',
        'Pollution',
      ],
      conservationActions: [
        'Riparian buffer restoration',
        'Stream bank stabilization',
        'Water quality monitoring',
        'Habitat enhancement',
      ],
    },
    {
      id: 'warm-water-lake',
      name: 'Warm-Water Lake',
      description: 'Lakes and reservoirs with warm water, supporting bass and other warm-water species',
      imageUrl: '/images/habitats/warm-lake.jpg',
      characteristics: [
        'Water temperature above 20°C',
        'Deeper water',
        'Varied substrate',
        'Aquatic vegetation',
        'Slower-moving water',
      ],
      commonSpecies: [
        { id: 'largemouth-bass', name: 'Largemouth Bass' },
        { id: 'bluegill', name: 'Bluegill' },
        { id: 'crayfish', name: 'Crayfish' },
      ],
      conservationStatus: 'Stable',
      threats: [
        'Eutrophication',
        'Invasive species',
        'Habitat loss',
        'Overfishing',
      ],
      conservationActions: [
        'Aquatic vegetation management',
        'Invasive species control',
        'Habitat structure installation',
        'Stocking programs',
      ],
    },
  ];
}

/**
 * Get seasonal guide - what to look for each season
 */
export function getSeasonalGuide(season: 'spring' | 'summer' | 'fall' | 'winter') {
  const guides: Record<string, { title: string; activities: string[]; species: string[] }> = {
    spring: {
      title: 'Spring Field Guide',
      activities: [
        'Watch for spawning fish in shallow water',
        'Observe emerging aquatic insects',
        'Monitor water temperature changes',
        'Look for new plant growth',
      ],
      species: ['Brook Trout (spawning)', 'Mayflies', 'Stoneflies', 'Wildflowers'],
    },
    summer: {
      title: 'Summer Field Guide',
      activities: [
        'Monitor water levels',
        'Observe fish behavior in warm water',
        'Identify macroinvertebrates',
        'Document habitat conditions',
      ],
      species: ['Largemouth Bass', 'Bluegill', 'Dragonflies', 'Aquatic Plants'],
    },
    fall: {
      title: 'Fall Field Guide',
      activities: [
        'Observe fall colors',
        'Monitor water temperature cooling',
        'Document species preparing for winter',
        'Collect leaf samples',
      ],
      species: ['Migrating Birds', 'Fall Spawning Fish', 'Fungi', 'Changing Vegetation'],
    },
    winter: {
      title: 'Winter Field Guide',
      activities: [
        'Observe ice formation',
        'Monitor water temperature',
        'Look for overwintering species',
        'Document winter habitat conditions',
      ],
      species: ['Overwintering Insects', 'Ice-Adapted Fish', 'Winter Birds', 'Bare Trees'],
    },
  };

  return guides[season] || guides.spring;
}

