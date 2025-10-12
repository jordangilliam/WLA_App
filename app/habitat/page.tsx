'use client';
import { useState, useEffect } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';

interface HabitatParams {
  waterTempC: number;
  ph: number;
  dissolvedOxygen: number;
  cover: number;
  flow: number;
  depth: number;
}

interface SpeciesRequirements {
  id: string;
  name: string;
  track: string;
  emoji: string;
  description: string;
  points: number;
  requirements: {
    waterTempC: { min: number; max: number; ideal: { min: number; max: number } };
    ph: { min: number; max: number; ideal: { min: number; max: number } };
    dissolvedOxygen: { min: number; ideal: number };
    cover: { min: number; ideal: number };
    flow: { min: number; max: number; ideal: { min: number; max: number } };
    depth: { min: number; max: number };
  };
}

const SPECIES: SpeciesRequirements[] = [
  {
    id: 'brook-trout',
    name: 'Brook Trout',
    track: 'Brookies',
    emoji: '🎣',
    description: 'Sensitive cold-water species requiring pristine conditions',
    points: 15,
    requirements: {
      waterTempC: { min: 4, max: 18, ideal: { min: 10, max: 14 } },
      ph: { min: 6.0, max: 8.0, ideal: { min: 6.5, max: 7.5 } },
      dissolvedOxygen: { min: 7.0, ideal: 9.0 },
      cover: { min: 40, ideal: 60 },
      flow: { min: 0.3, max: 1.5, ideal: { min: 0.5, max: 1.0 } },
      depth: { min: 20, max: 150 }
    }
  },
  {
    id: 'largemouth-bass',
    name: 'Largemouth Bass',
    track: 'Bass',
    emoji: '🐟',
    description: 'Warm-water generalist, tolerates various conditions',
    points: 8,
    requirements: {
      waterTempC: { min: 10, max: 32, ideal: { min: 20, max: 28 } },
      ph: { min: 6.5, max: 8.5, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 3.0, ideal: 6.0 },
      cover: { min: 30, ideal: 50 },
      flow: { min: 0.0, max: 0.5, ideal: { min: 0.0, max: 0.2 } },
      depth: { min: 50, max: 600 }
    }
  },
  {
    id: 'smallmouth-bass',
    name: 'Smallmouth Bass',
    track: 'Bass',
    emoji: '🐠',
    description: 'Cool-water species preferring rocky streams and lakes',
    points: 10,
    requirements: {
      waterTempC: { min: 8, max: 27, ideal: { min: 18, max: 24 } },
      ph: { min: 6.5, max: 8.5, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 5.0, ideal: 7.5 },
      cover: { min: 35, ideal: 55 },
      flow: { min: 0.2, max: 1.2, ideal: { min: 0.4, max: 0.8 } },
      depth: { min: 30, max: 400 }
    }
  },
  {
    id: 'channel-catfish',
    name: 'Channel Catfish',
    track: 'Bass',
    emoji: '🐈',
    description: 'Bottom-dwelling species tolerant of lower oxygen',
    points: 6,
    requirements: {
      waterTempC: { min: 12, max: 32, ideal: { min: 22, max: 28 } },
      ph: { min: 6.0, max: 9.0, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 2.5, ideal: 5.0 },
      cover: { min: 20, ideal: 40 },
      flow: { min: 0.0, max: 0.8, ideal: { min: 0.1, max: 0.4 } },
      depth: { min: 40, max: 800 }
    }
  },
  {
    id: 'rainbow-trout',
    name: 'Rainbow Trout',
    track: 'Brookies',
    emoji: '🌈',
    description: 'Hardy cold-water species, stocked in PA streams',
    points: 10,
    requirements: {
      waterTempC: { min: 0, max: 20, ideal: { min: 12, max: 16 } },
      ph: { min: 6.5, max: 8.5, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 6.0, ideal: 8.0 },
      cover: { min: 30, ideal: 50 },
      flow: { min: 0.3, max: 2.0, ideal: { min: 0.5, max: 1.2 } },
      depth: { min: 25, max: 200 }
    }
  },
  {
    id: 'brown-trout',
    name: 'Brown Trout',
    track: 'Brookies',
    emoji: '🟤',
    description: 'Most tolerant trout species, thrives in varied habitats',
    points: 12,
    requirements: {
      waterTempC: { min: 2, max: 24, ideal: { min: 12, max: 18 } },
      ph: { min: 6.5, max: 8.5, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 5.5, ideal: 8.0 },
      cover: { min: 40, ideal: 65 },
      flow: { min: 0.2, max: 1.8, ideal: { min: 0.4, max: 1.0 } },
      depth: { min: 20, max: 300 }
    }
  },
  {
    id: 'yellow-perch',
    name: 'Yellow Perch',
    track: 'Bass',
    emoji: '🟡',
    description: 'Schooling fish common in PA lakes and reservoirs',
    points: 7,
    requirements: {
      waterTempC: { min: 4, max: 26, ideal: { min: 18, max: 22 } },
      ph: { min: 6.5, max: 8.5, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 4.0, ideal: 6.5 },
      cover: { min: 25, ideal: 45 },
      flow: { min: 0.0, max: 0.3, ideal: { min: 0.0, max: 0.1 } },
      depth: { min: 40, max: 500 }
    }
  },
  {
    id: 'bluegill',
    name: 'Bluegill Sunfish',
    track: 'Bass',
    emoji: '🔵',
    description: 'Popular panfish, found in warm-water habitats statewide',
    points: 6,
    requirements: {
      waterTempC: { min: 12, max: 32, ideal: { min: 22, max: 28 } },
      ph: { min: 6.5, max: 8.5, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 3.5, ideal: 6.0 },
      cover: { min: 30, ideal: 50 },
      flow: { min: 0.0, max: 0.4, ideal: { min: 0.0, max: 0.2 } },
      depth: { min: 30, max: 400 }
    }
  },
  {
    id: 'muskellunge',
    name: 'Muskellunge',
    track: 'Bass',
    emoji: '🦈',
    description: 'Top predator in PA lakes, requires large habitat',
    points: 20,
    requirements: {
      waterTempC: { min: 8, max: 26, ideal: { min: 15, max: 22 } },
      ph: { min: 7.0, max: 9.0, ideal: { min: 7.5, max: 8.5 } },
      dissolvedOxygen: { min: 5.0, ideal: 7.5 },
      cover: { min: 40, ideal: 60 },
      flow: { min: 0.0, max: 0.5, ideal: { min: 0.0, max: 0.2 } },
      depth: { min: 100, max: 1000 }
    }
  },
  {
    id: 'walleye',
    name: 'Walleye',
    track: 'Bass',
    emoji: '🌙',
    description: 'Prized sport fish, active at dawn and dusk',
    points: 18,
    requirements: {
      waterTempC: { min: 4, max: 25, ideal: { min: 15, max: 21 } },
      ph: { min: 6.5, max: 8.5, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 5.0, ideal: 7.0 },
      cover: { min: 30, ideal: 50 },
      flow: { min: 0.0, max: 0.6, ideal: { min: 0.1, max: 0.4 } },
      depth: { min: 50, max: 800 }
    }
  },
  {
    id: 'fallfish',
    name: 'Fallfish',
    track: 'Brookies',
    emoji: '🥈',
    description: 'Largest native PA minnow, builds impressive gravel nests',
    points: 8,
    requirements: {
      waterTempC: { min: 5, max: 26, ideal: { min: 15, max: 22 } },
      ph: { min: 6.5, max: 8.5, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 5.0, ideal: 7.5 },
      cover: { min: 35, ideal: 55 },
      flow: { min: 0.2, max: 1.5, ideal: { min: 0.4, max: 1.0 } },
      depth: { min: 25, max: 200 }
    }
  },
  {
    id: 'american-eel',
    name: 'American Eel',
    track: 'Brookies',
    emoji: '🐍',
    description: 'Migratory species, travels between ocean and freshwater',
    points: 14,
    requirements: {
      waterTempC: { min: 8, max: 28, ideal: { min: 18, max: 24 } },
      ph: { min: 6.0, max: 8.5, ideal: { min: 6.5, max: 8.0 } },
      dissolvedOxygen: { min: 4.0, ideal: 6.5 },
      cover: { min: 50, ideal: 70 },
      flow: { min: 0.0, max: 1.0, ideal: { min: 0.1, max: 0.5 } },
      depth: { min: 30, max: 600 }
    }
  },
  {
    id: 'northern-salamander',
    name: 'Northern Two-lined Salamander',
    track: 'All',
    emoji: '🦎',
    description: 'Stream-dwelling amphibian, indicator of water quality',
    points: 12,
    requirements: {
      waterTempC: { min: 2, max: 20, ideal: { min: 8, max: 16 } },
      ph: { min: 6.0, max: 7.5, ideal: { min: 6.5, max: 7.0 } },
      dissolvedOxygen: { min: 6.0, ideal: 8.5 },
      cover: { min: 60, ideal: 80 },
      flow: { min: 0.1, max: 1.0, ideal: { min: 0.2, max: 0.6 } },
      depth: { min: 5, max: 50 }
    }
  },
  {
    id: 'spring-peeper',
    name: 'Spring Peeper (Tadpole)',
    track: 'All',
    emoji: '🐸',
    description: 'Iconic spring chorus frog, breeds in vernal pools',
    points: 10,
    requirements: {
      waterTempC: { min: 5, max: 25, ideal: { min: 12, max: 20 } },
      ph: { min: 5.5, max: 8.0, ideal: { min: 6.0, max: 7.5 } },
      dissolvedOxygen: { min: 4.0, ideal: 7.0 },
      cover: { min: 40, ideal: 60 },
      flow: { min: 0.0, max: 0.2, ideal: { min: 0.0, max: 0.1 } },
      depth: { min: 10, max: 80 }
    }
  },
  {
    id: 'american-bullfrog',
    name: 'American Bullfrog (Tadpole)',
    track: 'All',
    emoji: '🐊',
    description: 'Largest PA frog, tadpoles can take 2 years to metamorphose',
    points: 8,
    requirements: {
      waterTempC: { min: 10, max: 30, ideal: { min: 20, max: 28 } },
      ph: { min: 6.0, max: 8.5, ideal: { min: 6.5, max: 8.0 } },
      dissolvedOxygen: { min: 3.0, ideal: 6.0 },
      cover: { min: 35, ideal: 55 },
      flow: { min: 0.0, max: 0.3, ideal: { min: 0.0, max: 0.1 } },
      depth: { min: 30, max: 300 }
    }
  },
  {
    id: 'crayfish',
    name: 'Appalachian Brook Crayfish',
    track: 'All',
    emoji: '🦞',
    description: 'Native crayfish, important for nutrient cycling',
    points: 9,
    requirements: {
      waterTempC: { min: 4, max: 24, ideal: { min: 12, max: 20 } },
      ph: { min: 6.5, max: 8.5, ideal: { min: 7.0, max: 8.0 } },
      dissolvedOxygen: { min: 5.0, ideal: 7.5 },
      cover: { min: 50, ideal: 70 },
      flow: { min: 0.1, max: 1.2, ideal: { min: 0.3, max: 0.8 } },
      depth: { min: 10, max: 150 }
    }
  },
  {
    id: 'freshwater-mussel',
    name: 'Eastern Elliptio Mussel',
    track: 'All',
    emoji: '🦪',
    description: 'Filter feeder that cleans water, endangered in many areas',
    points: 16,
    requirements: {
      waterTempC: { min: 5, max: 28, ideal: { min: 15, max: 24 } },
      ph: { min: 7.0, max: 8.5, ideal: { min: 7.5, max: 8.0 } },
      dissolvedOxygen: { min: 6.0, ideal: 8.0 },
      cover: { min: 30, ideal: 50 },
      flow: { min: 0.1, max: 1.0, ideal: { min: 0.2, max: 0.6 } },
      depth: { min: 20, max: 400 }
    }
  },
  {
    id: 'hellgrammite',
    name: 'Hellgrammite (Dobsonfly Larva)',
    track: 'All',
    emoji: '🪲',
    description: 'Pollution-intolerant predator, indicator of excellent water quality',
    points: 18,
    requirements: {
      waterTempC: { min: 2, max: 22, ideal: { min: 10, max: 18 } },
      ph: { min: 6.5, max: 8.0, ideal: { min: 6.8, max: 7.5 } },
      dissolvedOxygen: { min: 7.0, ideal: 9.0 },
      cover: { min: 60, ideal: 80 },
      flow: { min: 0.3, max: 1.5, ideal: { min: 0.5, max: 1.2 } },
      depth: { min: 10, max: 100 }
    }
  },
  {
    id: 'stonefly',
    name: 'Giant Stonefly Nymph',
    track: 'All',
    emoji: '🦗',
    description: 'Highly sensitive to pollution, found only in pristine streams',
    points: 20,
    requirements: {
      waterTempC: { min: 0, max: 18, ideal: { min: 8, max: 14 } },
      ph: { min: 6.5, max: 8.0, ideal: { min: 7.0, max: 7.5 } },
      dissolvedOxygen: { min: 8.0, ideal: 10.0 },
      cover: { min: 55, ideal: 75 },
      flow: { min: 0.4, max: 1.8, ideal: { min: 0.6, max: 1.4 } },
      depth: { min: 10, max: 80 }
    }
  },
  {
    id: 'mayfly',
    name: 'Blue-Winged Olive Mayfly',
    track: 'All',
    emoji: '🦟',
    description: 'Common pollution-sensitive insect, important trout food',
    points: 14,
    requirements: {
      waterTempC: { min: 2, max: 22, ideal: { min: 10, max: 18 } },
      ph: { min: 6.5, max: 8.0, ideal: { min: 7.0, max: 7.5 } },
      dissolvedOxygen: { min: 6.5, ideal: 8.5 },
      cover: { min: 45, ideal: 65 },
      flow: { min: 0.2, max: 1.5, ideal: { min: 0.4, max: 1.0 } },
      depth: { min: 10, max: 100 }
    }
  }
];

export default function HabitatBuilder() {
  const { award } = usePoints();
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesRequirements>(SPECIES[0]);
  const [params, setParams] = useState<HabitatParams>({
    waterTempC: 15,
    ph: 7.0,
    dissolvedOxygen: 8.0,
    cover: 50,
    flow: 0.5,
    depth: 100
  });
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<Array<{species: string; score: number; timestamp: number}>>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('wla-habitat-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const calculateScore = (): number => {
    const req = selectedSpecies.requirements;
    let totalScore = 0;
    let maxScore = 0;
    const newFeedback: string[] = [];

    // Water Temperature (25%)
    maxScore += 25;
    if (params.waterTempC < req.waterTempC.min || params.waterTempC > req.waterTempC.max) {
      newFeedback.push(`❌ Water temperature (${params.waterTempC}°C) is outside tolerable range (${req.waterTempC.min}-${req.waterTempC.max}°C)`);
    } else if (params.waterTempC >= req.waterTempC.ideal.min && params.waterTempC <= req.waterTempC.ideal.max) {
      totalScore += 25;
      newFeedback.push(`✅ Water temperature (${params.waterTempC}°C) is ideal!`);
    } else {
      const distance = Math.min(
        Math.abs(params.waterTempC - req.waterTempC.ideal.min),
        Math.abs(params.waterTempC - req.waterTempC.ideal.max)
      );
      const rangeSize = req.waterTempC.max - req.waterTempC.min;
      const partialScore = Math.max(0, 25 - (distance / rangeSize * 25));
      totalScore += partialScore;
      newFeedback.push(`⚠️ Water temperature acceptable but not ideal (${params.waterTempC}°C, ideal: ${req.waterTempC.ideal.min}-${req.waterTempC.ideal.max}°C)`);
    }

    // pH (20%)
    maxScore += 20;
    if (params.ph < req.ph.min || params.ph > req.ph.max) {
      newFeedback.push(`❌ pH (${params.ph}) is outside tolerable range (${req.ph.min}-${req.ph.max})`);
    } else if (params.ph >= req.ph.ideal.min && params.ph <= req.ph.ideal.max) {
      totalScore += 20;
      newFeedback.push(`✅ pH (${params.ph}) is ideal!`);
    } else {
      const distance = Math.min(
        Math.abs(params.ph - req.ph.ideal.min),
        Math.abs(params.ph - req.ph.ideal.max)
      );
      const rangeSize = req.ph.max - req.ph.min;
      const partialScore = Math.max(0, 20 - (distance / rangeSize * 20));
      totalScore += partialScore;
      newFeedback.push(`⚠️ pH acceptable but not ideal (${params.ph}, ideal: ${req.ph.ideal.min}-${req.ph.ideal.max})`);
    }

    // Dissolved Oxygen (20%)
    maxScore += 20;
    if (params.dissolvedOxygen < req.dissolvedOxygen.min) {
      newFeedback.push(`❌ Dissolved oxygen (${params.dissolvedOxygen} mg/L) is too low (min: ${req.dissolvedOxygen.min})`);
    } else if (params.dissolvedOxygen >= req.dissolvedOxygen.ideal) {
      totalScore += 20;
      newFeedback.push(`✅ Dissolved oxygen (${params.dissolvedOxygen} mg/L) is ideal!`);
    } else {
      const distance = req.dissolvedOxygen.ideal - params.dissolvedOxygen;
      const rangeSize = req.dissolvedOxygen.ideal - req.dissolvedOxygen.min;
      const partialScore = Math.max(0, 20 - (distance / rangeSize * 20));
      totalScore += partialScore;
      newFeedback.push(`⚠️ Dissolved oxygen acceptable but not ideal (${params.dissolvedOxygen} mg/L, ideal: ${req.dissolvedOxygen.ideal}+)`);
    }

    // Cover (15%)
    maxScore += 15;
    if (params.cover < req.cover.min) {
      newFeedback.push(`❌ Cover (${params.cover}%) is insufficient (min: ${req.cover.min}%)`);
    } else if (params.cover >= req.cover.ideal) {
      totalScore += 15;
      newFeedback.push(`✅ Cover (${params.cover}%) is ideal!`);
    } else {
      const distance = req.cover.ideal - params.cover;
      const rangeSize = req.cover.ideal - req.cover.min;
      const partialScore = Math.max(0, 15 - (distance / rangeSize * 15));
      totalScore += partialScore;
      newFeedback.push(`⚠️ Cover acceptable but not ideal (${params.cover}%, ideal: ${req.cover.ideal}%+)`);
    }

    // Flow (10%)
    maxScore += 10;
    if (params.flow < req.flow.min || params.flow > req.flow.max) {
      newFeedback.push(`❌ Flow rate (${params.flow} m/s) is outside tolerable range (${req.flow.min}-${req.flow.max})`);
    } else if (params.flow >= req.flow.ideal.min && params.flow <= req.flow.ideal.max) {
      totalScore += 10;
      newFeedback.push(`✅ Flow rate (${params.flow} m/s) is ideal!`);
    } else {
      const distance = Math.min(
        Math.abs(params.flow - req.flow.ideal.min),
        Math.abs(params.flow - req.flow.ideal.max)
      );
      const rangeSize = req.flow.max - req.flow.min;
      const partialScore = Math.max(0, 10 - (distance / rangeSize * 10));
      totalScore += partialScore;
      newFeedback.push(`⚠️ Flow rate acceptable but not ideal (${params.flow} m/s, ideal: ${req.flow.ideal.min}-${req.flow.ideal.max})`);
    }

    // Depth (10%)
    maxScore += 10;
    if (params.depth < req.depth.min || params.depth > req.depth.max) {
      newFeedback.push(`❌ Depth (${params.depth} cm) is outside tolerable range (${req.depth.min}-${req.depth.max} cm)`);
    } else {
      totalScore += 10;
      newFeedback.push(`✅ Depth (${params.depth} cm) is suitable!`);
    }

    const finalScore = Math.round((totalScore / maxScore) * 100);
    setFeedback(newFeedback);
    return finalScore;
  };

  const simulate = () => {
    const newScore = calculateScore();
    setScore(newScore);
    setShowFeedback(true);

    // Award points based on score
    if (newScore >= 90) {
      award(selectedSpecies.points, `Excellent habitat for ${selectedSpecies.name}`);
    } else if (newScore >= 75) {
      award(Math.round(selectedSpecies.points * 0.75), `Good habitat for ${selectedSpecies.name}`);
    } else if (newScore >= 60) {
      award(Math.round(selectedSpecies.points * 0.5), `Acceptable habitat for ${selectedSpecies.name}`);
    }

    // Save to history
    const entry = {
      species: selectedSpecies.name,
      score: newScore,
      timestamp: Date.now()
    };
    const updated = [...history, entry];
    setHistory(updated);
    localStorage.setItem('wla-habitat-history', JSON.stringify(updated));
  };

  const reset = () => {
    setParams({
      waterTempC: 15,
      ph: 7.0,
      dissolvedOxygen: 8.0,
      cover: 50,
      flow: 0.5,
      depth: 100
    });
    setScore(0);
    setShowFeedback(false);
    setFeedback([]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'linear-gradient(135deg, #06D6A0, #059669)';
    if (score >= 75) return 'linear-gradient(135deg, #FFB703, #FB8500)';
    if (score >= 60) return 'linear-gradient(135deg, #FF8C42, #FF6B35)';
    return 'linear-gradient(135deg, #DC2626, #991B1B)';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent - Species will thrive!';
    if (score >= 75) return 'Good - Species can survive well';
    if (score >= 60) return 'Acceptable - Species may struggle';
    return 'Poor - Species unlikely to survive';
  };

  return (
    <div>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #A7C957, #06D6A0)',
        color: 'white',
        padding: '3rem 1.5rem',
        marginBottom: '2rem',
        borderRadius: '16px'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          🏞️ Habitat Builder Simulator
        </h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Design the perfect aquatic habitat! Adjust environmental parameters to meet species requirements and learn about ecosystem balance.
        </p>
      </section>

      <div className="row" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Controls */}
        <div className="card section" style={{ flex: '1 1 400px' }}>
          <h2>🎯 Target Species</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
            {SPECIES.map(species => (
              <button
                key={species.id}
                onClick={() => {
                  setSelectedSpecies(species);
                  setShowFeedback(false);
                }}
                style={{
                  padding: '1rem 0.5rem',
                  background: selectedSpecies.id === species.id ? 'linear-gradient(135deg, #0077B6, #023047)' : 'white',
                  color: selectedSpecies.id === species.id ? 'white' : '#374151',
                  border: selectedSpecies.id === species.id ? 'none' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{species.emoji}</div>
                {species.name}
              </button>
            ))}
          </div>

          <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>{selectedSpecies.emoji} {selectedSpecies.name}</h3>
            <p style={{ color: '#6B7280', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{selectedSpecies.description}</p>
            <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#FFD60A', color: '#023047', borderRadius: '999px', fontWeight: 700 }}>
              Up to {selectedSpecies.points} points
            </div>
          </div>

          <h3>🛠️ Environmental Parameters</h3>
          
          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Water Temperature</span>
              <span style={{ color: '#0077B6', fontWeight: 700 }}>{params.waterTempC}°C</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="0.5"
              value={params.waterTempC}
              onChange={(e) => setParams({...params, waterTempC: parseFloat(e.target.value)})}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>
              <span>0°C (freezing)</span>
              <span>35°C (very warm)</span>
            </div>
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>pH Level</span>
              <span style={{ color: '#0077B6', fontWeight: 700 }}>{params.ph}</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="10.0"
              step="0.1"
              value={params.ph}
              onChange={(e) => setParams({...params, ph: parseFloat(e.target.value)})}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>
              <span>4.0 (acidic)</span>
              <span>7.0 (neutral)</span>
              <span>10.0 (alkaline)</span>
            </div>
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Dissolved Oxygen</span>
              <span style={{ color: '#0077B6', fontWeight: 700 }}>{params.dissolvedOxygen} mg/L</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={params.dissolvedOxygen}
              onChange={(e) => setParams({...params, dissolvedOxygen: parseFloat(e.target.value)})}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>
              <span>0 (anoxic)</span>
              <span>12+ (supersaturated)</span>
            </div>
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Cover (rocks, logs, vegetation)</span>
              <span style={{ color: '#0077B6', fontWeight: 700 }}>{params.cover}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.cover}
              onChange={(e) => setParams({...params, cover: parseFloat(e.target.value)})}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>
              <span>0% (exposed)</span>
              <span>100% (dense cover)</span>
            </div>
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Flow Rate</span>
              <span style={{ color: '#0077B6', fontWeight: 700 }}>{params.flow} m/s</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.1"
              value={params.flow}
              onChange={(e) => setParams({...params, flow: parseFloat(e.target.value)})}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>
              <span>0 (still)</span>
              <span>2.5+ (fast rapids)</span>
            </div>
          </label>

          <label style={{ display: 'block', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Average Depth</span>
              <span style={{ color: '#0077B6', fontWeight: 700 }}>{params.depth} cm</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={params.depth}
              onChange={(e) => setParams({...params, depth: parseFloat(e.target.value)})}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>
              <span>10cm (shallow)</span>
              <span>1000cm (deep pool)</span>
            </div>
          </label>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={simulate}
              className="btn-success"
              style={{ flex: 1, fontSize: '1.1rem', padding: '1rem' }}
            >
              🔬 Evaluate Habitat
            </button>
            <button 
              onClick={reset}
              className="btn-outline"
              style={{ padding: '1rem 1.5rem' }}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: '1 1 400px' }}>
          {showFeedback ? (
            <div className="card section animate-slide-up">
              <div style={{
                background: getScoreColor(score),
                color: 'white',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                  {score}%
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 600 }}>
                  {getScoreLabel(score)}
                </div>
              </div>

              <h3 style={{ marginBottom: '1rem' }}>📊 Detailed Feedback</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {feedback.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: item.startsWith('✅') ? '#D1FAE5' : item.startsWith('⚠️') ? '#FEF3C7' : '#FEE2E2',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      lineHeight: 1.5
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#F8F9FA', borderRadius: '12px' }}>
                <h4 style={{ marginTop: 0 }}>💡 Improvement Tips</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                  {score < 60 && (
                    <>
                      <li>Check which parameters are outside the tolerable range</li>
                      <li>Focus on critical factors: temperature, oxygen, and pH</li>
                      <li>Compare your values to the species' ideal ranges</li>
                    </>
                  )}
                  {score >= 60 && score < 90 && (
                    <>
                      <li>Fine-tune parameters to reach ideal ranges</li>
                      <li>Small adjustments can make big improvements</li>
                      <li>Consider multiple factors working together</li>
                    </>
                  )}
                  {score >= 90 && (
                    <>
                      <li>Excellent work! Your habitat is optimal</li>
                      <li>Try designing habitats for other species</li>
                      <li>Challenge: Create a multi-species habitat</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card section" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6B7280' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏞️</div>
              <h3 style={{ color: '#374151' }}>Set Your Parameters</h3>
              <p>Adjust the environmental conditions and click "Evaluate Habitat" to see how well your design supports the selected species.</p>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="card section" style={{ marginTop: '2rem' }}>
              <h3>📜 Simulation History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                {history.slice().reverse().slice(0, 10).map((entry, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.75rem 1rem',
                      background: '#F8F9FA',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span>{entry.species}</span>
                    <span style={{ fontWeight: 700, color: entry.score >= 75 ? '#059669' : entry.score >= 60 ? '#FB8500' : '#DC2626' }}>
                      {entry.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Content */}
      <section className="section" style={{ background: '#F8F9FA', borderRadius: '16px', padding: '2rem', marginTop: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📚 Understanding Habitat Parameters</h2>
        <div className="row">
          <div className="card section" style={{ flex: 1 }}>
            <h3>🌡️ Water Temperature</h3>
            <p>Temperature affects metabolism, oxygen levels, and species distribution. Cold-water species like brook trout need temps below 20°C, while warm-water bass thrive at 20-28°C.</p>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>⚗️ pH Level</h3>
            <p>Measures acidity/alkalinity. Most PA fish prefer 6.5-8.5. Low pH can result from acid mine drainage or acid rain, while high pH may indicate alkaline geology.</p>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>💨 Dissolved Oxygen</h3>
            <p>Essential for respiration. Trout need 6+ mg/L, bass can tolerate 3+. Affected by temperature, flow, and photosynthesis. Critical for healthy aquatic ecosystems.</p>
          </div>
        </div>
        <div className="row" style={{ marginTop: '1rem' }}>
          <div className="card section" style={{ flex: 1 }}>
            <h3>🪵 Cover</h3>
            <p>Hiding spots from predators, shade, and feeding areas. Includes rocks, logs, undercut banks, and vegetation. Essential for survival and reproduction.</p>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>💧 Flow Rate</h3>
            <p>Water velocity in meters/second. Trout prefer flowing water (0.3-1.5 m/s) for oxygen, while bass like slower water (0-0.5 m/s) in pools and lakes.</p>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>📏 Depth</h3>
            <p>Varies by life stage and season. Shallow riffles for insects and spawning, deep pools for winter refuge and adult fish. Diversity creates better habitat.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
