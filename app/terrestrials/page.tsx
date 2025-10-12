'use client';

import { useState } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import { TERRESTRIAL_CONSERVATION_HISTORY } from '@/lib/data/conservation-history';
import ConservationHistory from '@/components/ConservationHistory';
import LocalHistoryResearch from '@/components/LocalHistoryResearch';

export default function TerrestrialsPage() {
  const { award } = usePoints();
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

  const species = [
    {
      id: 'white-tailed-deer',
      name: 'White-tailed Deer',
      scientific: 'Odocoileus virginianus',
      emoji: '🦌',
      track: 'Bucktails',
      weight: '100-300 lbs',
      habitat: 'Forests, fields, suburbs',
      diet: 'Herbivore - browse, acorns, crops',
      signs: ['Tracks (2 hooves)', 'Rubs on trees', 'Scrapes', 'Oval droppings'],
      facts: [
        'Can run up to 30 mph and jump 8 feet high',
        'Fawns born with white spots for camouflage',
        'Bucks grow and shed antlers annually',
        'Most abundant large mammal in PA'
      ]
    },
    {
      id: 'black-bear',
      name: 'Black Bear',
      scientific: 'Ursus americanus',
      emoji: '🐻',
      track: 'Ursids',
      weight: '200-600 lbs',
      habitat: 'Forests, mountains, swamps',
      diet: 'Omnivore - plants, insects, carrion',
      signs: ['Large tracks with claws', 'Claw marks on trees', 'Scat with berries/seeds', 'Torn logs'],
      facts: [
        'PA has 20,000+ black bears',
        'Hibernate in winter (not true hibernation)',
        'Excellent climbers despite size',
        'Can smell food up to 5 miles away'
      ]
    },
    {
      id: 'coyote',
      name: 'Eastern Coyote',
      scientific: 'Canis latrans',
      emoji: '🐺',
      track: 'Bucktails',
      weight: '30-50 lbs',
      habitat: 'Forests, fields, suburban areas',
      diet: 'Carnivore/omnivore - rodents, deer, fruit',
      signs: ['Dog-like tracks', 'Scat with fur/bones', 'Howling at night', 'Den sites'],
      facts: [
        'Colonized PA in the 1930s',
        'Can run up to 40 mph',
        'Monogamous pairs raise pups together',
        'Help control rodent populations'
      ]
    },
    {
      id: 'red-fox',
      name: 'Red Fox',
      scientific: 'Vulpes vulpes',
      emoji: '🦊',
      track: 'Bucktails',
      weight: '10-15 lbs',
      habitat: 'Edge habitats, fields, forests',
      diet: 'Carnivore - mice, rabbits, birds',
      signs: ['Small canine tracks', 'Musky odor', 'Den under logs/rocks', 'Cached food'],
      facts: [
        'Excellent hearing - can hear mouse under snow',
        'Pouncing technique called "mousing"',
        'Kits born blind and dark colored',
        'Not closely related to gray fox'
      ]
    },
    {
      id: 'raccoon',
      name: 'Raccoon',
      scientific: 'Procyon lotor',
      emoji: '🦝',
      track: 'Ursids',
      weight: '15-40 lbs',
      habitat: 'Forests near water, urban areas',
      diet: 'Omnivore - everything!',
      signs: ['Hand-like tracks', 'Masked face sightings', 'Trash raiding', 'Latrines'],
      facts: [
        'Extremely dexterous front paws',
        'Can open containers and doors',
        'Active at night (nocturnal)',
        '"Wash" food in water (actually feeling for inedible parts)'
      ]
    },
    {
      id: 'eastern-cottontail',
      name: 'Eastern Cottontail',
      scientific: 'Sylvilagus floridanus',
      emoji: '🐰',
      track: 'Brookies',
      weight: '2-4 lbs',
      habitat: 'Fields, brush, edges',
      diet: 'Herbivore - grasses, bark, twigs',
      signs: ['Small hopping tracks', 'Round pellet droppings', 'Nests in grass', 'Nibbled vegetation'],
      facts: [
        'Can have 3-7 litters per year',
        'Born blind and hairless',
        'Freeze when danger approaches',
        'Important prey species for many predators'
      ]
    },
    {
      id: 'groundhog',
      name: 'Groundhog (Woodchuck)',
      scientific: 'Marmota monax',
      emoji: '🦫',
      track: 'Bucktails',
      weight: '5-14 lbs',
      habitat: 'Fields, meadows, forest edges',
      diet: 'Herbivore - grasses, clover, plants',
      signs: ['Burrow entrances', 'Mounds of dirt', 'Tracks with 4 front/5 back toes', 'Standing upright'],
      facts: [
        'True hibernators - heart rate drops to 5 bpm',
        'Pennsylvania\'s state animal (temporarily)',
        'Punxsutawney Phil predicts spring',
        'Can climb trees and swim'
      ]
    },
    {
      id: 'gray-squirrel',
      name: 'Eastern Gray Squirrel',
      scientific: 'Sciurus carolinensis',
      emoji: '🐿️',
      track: 'Brookies',
      weight: '1-1.5 lbs',
      habitat: 'Deciduous forests, parks',
      diet: 'Nuts, seeds, fungi, buds',
      signs: ['Bounding tracks', 'Chewed nut shells', 'Leaf nests (dreys)', 'Buried acorns'],
      facts: [
        'Bury thousands of nuts annually',
        'Don\'t remember all cache sites - plants trees!',
        'Black phase squirrels common in PA',
        'Important for forest regeneration'
      ]
    },
    {
      id: 'eastern-chipmunk',
      name: 'Eastern Chipmunk',
      scientific: 'Tamias striatus',
      emoji: '🐿️',
      track: 'Brookies',
      weight: '2-5 oz',
      habitat: 'Deciduous forests with ground cover',
      diet: 'Seeds, nuts, berries, insects',
      signs: ['Tiny tracks', 'Burrow entrances (2 inches)', 'Chip call', 'Cheek pouches full'],
      facts: [
        'Can carry food in cheek pouches',
        'Create extensive burrow systems',
        'Light hibernators - wake to eat',
        'Solitary except breeding season'
      ]
    },
    {
      id: 'striped-skunk',
      name: 'Striped Skunk',
      scientific: 'Mephitis mephitis',
      emoji: '🦨',
      track: 'Ursids',
      weight: '6-14 lbs',
      habitat: 'Fields, forests, suburban areas',
      diet: 'Omnivore - insects, small mammals, eggs',
      signs: ['Tracks with long claws', 'Strong musky odor', 'Dug up lawns', 'Den under structures'],
      facts: [
        'Can spray accurately up to 10 feet',
        'Warning displays: stamping, tail up, backing',
        'Spray is last resort defense',
        'Important for pest insect control'
      ]
    },
    {
      id: 'opossum',
      name: 'Virginia Opossum',
      scientific: 'Didelphis virginiana',
      emoji: '🦡',
      track: 'Bucktails',
      weight: '8-14 lbs',
      habitat: 'Forests, fields, urban areas',
      diet: 'Omnivore - opportunistic',
      signs: ['Tracks show opposable thumb', 'Naked tail tracks', 'Slow moving', 'Playing dead'],
      facts: [
        'Only marsupial in North America',
        'Babies develop in mother\'s pouch',
        'Immune to most snake venom',
        '"Playing possum" is involuntary shock'
      ]
    },
    {
      id: 'river-otter',
      name: 'River Otter',
      scientific: 'Lontra canadensis',
      emoji: '🦦',
      track: 'Brookies',
      weight: '15-30 lbs',
      habitat: 'Rivers, streams, lakes',
      diet: 'Carnivore - fish, crayfish, frogs',
      signs: ['Webbed tracks', 'Slides on banks', 'Spraints (scat)', 'Holes in ice'],
      facts: [
        'Can hold breath 8+ minutes',
        'Reintroduced to PA in 1980s',
        'Playful behavior (sliding, wrestling)',
        'Family groups travel together'
      ]
    }
  ];

  return (
    <section className="section">
      <div style={{
        background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)',
        padding: '3rem 2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          🦌 PA Terrestrial Wildlife
        </h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', opacity: 0.95 }}>
          Discover Pennsylvania&apos;s amazing land mammals - from white-tailed deer to black bears
        </p>
      </div>

      {/* Species Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {species.map(animal => (
          <div
            key={animal.id}
            onClick={() => setSelectedSpecies(selectedSpecies === animal.id ? null : animal.id)}
            style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: selectedSpecies === animal.id ? '3px solid #8B4513' : '3px solid transparent'
            }}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
              {animal.emoji}
            </div>
            <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>{animal.name}</h3>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#666', textAlign: 'center', marginBottom: '1rem' }}>
              {animal.scientific}
            </p>
            
            {selectedSpecies === animal.id && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
                <p><strong>Track:</strong> {animal.track}</p>
                <p><strong>Weight:</strong> {animal.weight}</p>
                <p><strong>Habitat:</strong> {animal.habitat}</p>
                <p><strong>Diet:</strong> {animal.diet}</p>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Signs to Look For:</h4>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  {animal.signs.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ul>

                <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Cool Facts:</h4>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  {animal.facts.map((fact, i) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    award(25, `Studied ${animal.name}`);
                  }}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '0.75rem',
                    background: '#8B4513',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ✅ Mark as Studied (+25 pts)
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Field Guide */}
      <div className="card" style={{ marginTop: '3rem' }}>
        <h2>📖 Using This Field Guide</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Click on any animal to learn more about it! Study the signs, tracks, and behaviors to 
          help you identify wildlife in the field.
        </p>

        <div style={{ padding: '1.5rem', background: '#f0f9ff', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <h3>🎯 Field Challenge</h3>
          <p>Use this guide to help you:</p>
          <ul style={{ lineHeight: '2', marginLeft: '2rem' }}>
            <li>Identify animal tracks on trails</li>
            <li>Recognize scat and other signs</li>
            <li>Understand habitat preferences</li>
            <li>Document wildlife observations in your journal</li>
          </ul>
        </div>

        <div style={{ padding: '1.5rem', background: '#fff9e6', borderRadius: '12px', border: '2px solid #ffd700' }}>
          <h3>⭐ Earn Points</h3>
          <p><strong>25 points</strong> for studying each species</p>
          <p><strong>50 points</strong> for documenting signs of 5 different species</p>
          <p><strong>100 points</strong> for photographing 3 different mammals</p>
        </div>
      </div>

      {/* Track Identification */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>🐾 Track Identification Quick Guide</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4>🦌 Deer (Ungulate)</h4>
            <p>• 2 hooves (cloven)</p>
            <p>• Heart-shaped print</p>
            <p>• Dewclaws in soft ground</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4>🐻 Bear (Plantigrade)</h4>
            <p>• 5 toes with claws</p>
            <p>• Large pad</p>
            <p>• Walks on flat foot</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4>🐺 Canine (Dog Family)</h4>
            <p>• 4 toes with claws</p>
            <p>• Oval shape</p>
            <p>• Claws always show</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4>🐰 Rabbit (Hopper)</h4>
            <p>• 4 front, 5 back toes</p>
            <p>• Large hind feet</p>
            <p>• Hopping pattern</p>
          </div>
        </div>
      </div>
    </section>

    {/* Conservation History Section */}
    <section className="section" style={{ marginTop: '2rem' }}>
      <ConservationHistory history={TERRESTRIAL_CONSERVATION_HISTORY} />
      
      <div style={{ marginTop: '2rem' }}>
        <LocalHistoryResearch />
      </div>
    </section>
  );
}

