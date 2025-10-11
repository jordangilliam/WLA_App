/**
 * Sample lessons for demonstration
 * Replace with real content when ready
 */

import type { Lesson } from '../types/lesson.types';

export const sampleLessons: Lesson[] = [
  {
    id: 'sample-watershed-basics',
    slug: 'watershed-basics',
    track: 'Brookies',
    title: 'Watershed Basics & Brook Trout Habitat',
    description: 'Learn how watersheds connect land and water, and why they matter for brook trout conservation.',
    estimatedMinutes: 25,
    difficulty: 'beginner',
    objectives: [
      'Define what a watershed is and identify its key components',
      'Explain how land use affects water quality',
      'Describe the ideal habitat conditions for brook trout',
      'Understand the role of riparian buffers in stream health',
    ],
    content: `## What is a Watershed?

A **watershed** (also called a drainage basin) is an area of land where all the water that falls on it drains to a common point - like a stream, river, or lake.

### Key Components

**High Ground (Ridges)**
- Water flows downhill from ridge tops
- These are the boundaries of watersheds

**Streams and Rivers**
- Collect water from the landscape
- Transport nutrients and sediment
- Provide habitat for aquatic life

**Riparian Zones**
- Vegetated areas along streams
- Act as natural filters
- Provide shade and habitat

## Why Watersheds Matter for Brook Trout

Brook trout are considered an **indicator species** - their presence tells us about overall ecosystem health.

### Ideal Brook Trout Habitat

Brook trout need:
- **Cold water** (below 68°F / 20°C)
- **High dissolved oxygen** (>7 mg/L)
- **Clean gravel substrate** for spawning
- **Stable stream flows** year-round
- **Abundant invertebrate food sources**

### Threats to Brook Trout

1. **Warming temperatures** from climate change and loss of tree cover
2. **Sedimentation** from erosion and construction
3. **Pollution** from agriculture and urban runoff
4. **Habitat fragmentation** from dams and culverts
5. **Competition** from non-native trout species

## Taking Action

As conservation ambassadors, you can:

- Monitor water temperature and pH
- Identify macroinvertebrates as bioindicators
- Plant trees along streambanks
- Report pollution or habitat degradation
- Educate others about watershed protection

### Field Activity

Visit a local stream and observe:
- Water clarity and temperature
- Riparian vegetation
- Evidence of erosion
- Macroinvertebrates present
- Signs of human impact

Document your findings in the app's field journal!`,
    quiz: [
      {
        id: 'q1',
        prompt: 'What is a watershed?',
        choices: [
          'A building where water is stored',
          'An area of land where water drains to a common point',
          'A type of fish habitat',
          'A water treatment facility',
        ],
        correctIndex: 1,
        explanation: 'A watershed is the land area that drains to a common water body. Think of it like a bathtub - all water flows to the drain (the stream or river).',
      },
      {
        id: 'q2',
        prompt: 'What is the ideal water temperature range for brook trout?',
        choices: [
          'Above 75°F',
          'Between 70-80°F',
          'Below 68°F',
          'Temperature doesn\'t matter',
        ],
        correctIndex: 2,
        explanation: 'Brook trout are cold-water fish that require temperatures below 68°F (20°C). Warmer water holds less oxygen, which stresses the fish.',
      },
      {
        id: 'q3',
        prompt: 'Why are riparian buffers important?',
        choices: [
          'They only provide shade',
          'They filter pollutants, provide shade, and prevent erosion',
          'They are only for wildlife',
          'They have no impact on water quality',
        ],
        correctIndex: 1,
        explanation: 'Riparian buffers serve multiple critical functions: filtering pollutants before they reach the stream, providing shade to keep water cool, stabilizing banks to prevent erosion, and providing habitat for both aquatic and terrestrial species.',
      },
      {
        id: 'q4',
        prompt: 'Brook trout are considered an indicator species because:',
        choices: [
          'They are the biggest fish',
          'Their presence indicates healthy ecosystem conditions',
          'They indicate the presence of pollution',
          'They show where to fish',
        ],
        correctIndex: 1,
        explanation: 'Indicator species are sensitive to environmental changes. Because brook trout require such specific conditions (cold, clean, oxygen-rich water), their presence indicates a healthy stream ecosystem.',
      },
    ],
    resources: [
      {
        label: 'DCNR Watershed Education',
        url: 'https://watersheded.dcnr.pa.gov/',
        type: 'article',
      },
      {
        label: 'Brook Trout Fact Sheet',
        url: 'https://www.fishandboat.com/Resource/Documents/brooktrout.pdf',
        type: 'pdf',
      },
    ],
    standards: [
      'PDE Env & Ecology 4.1.12.A - Biodiversity',
      'PDE Env & Ecology 4.2.12.C - Water Systems',
      'NGSS MS-LS2-4 - Ecosystem Dynamics',
    ],
    tags: ['watersheds', 'brook trout', 'water quality', 'conservation'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // More sample lessons can be added here...
];

