'use client';
import { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'photography' | 'video' | 'audio' | 'writing' | 'presentation';
  icon: string;
  content: {
    type: 'tips' | 'template' | 'guide' | 'reference';
    items: string[];
  };
}

const RESOURCES: Resource[] = [
  {
    id: 'exposure-triangle',
    title: 'Exposure Triangle Basics',
    description: 'Master the three pillars of photography for wildlife documentation',
    category: 'photography',
    icon: '📸',
    content: {
      type: 'guide',
      items: [
        '**Aperture (f-stop):** Controls depth of field',
        '• Large aperture (f/2.8): Blurry background, good for portraits',
        '• Small aperture (f/11): Everything in focus, good for landscapes',
        '• Wildlife tip: Use f/5.6 for balance',
        '',
        '**Shutter Speed:** Controls motion blur',
        '• Fast (1/1000s): Freeze action (birds in flight)',
        '• Medium (1/250s): General wildlife photography',
        '• Slow (1/30s): Flowing water effects',
        '• Rule: 1/focal length minimum (100mm lens = 1/100s)',
        '',
        '**ISO:** Controls sensor sensitivity',
        '• Low (100-400): Bright conditions, best quality',
        '• Medium (800-1600): Overcast days',
        '• High (3200+): Low light, more grain',
        '• Modern cameras handle ISO 800 well'
      ]
    }
  },
  {
    id: 'wildlife-composition',
    title: 'Wildlife Photography Composition',
    description: 'Composition rules for compelling wildlife images',
    category: 'photography',
    icon: '🦌',
    content: {
      type: 'tips',
      items: [
        'Rule of Thirds: Place subject on intersection points',
        'Eye Level: Get down to animal\'s eye level for intimacy',
        'Leading Lines: Use streams, branches to guide viewer\'s eye',
        'Negative Space: Give animals "room to look"',
        'Fill the Frame: Get close (safely) for impact',
        'Golden Hour: Shoot 1 hour after sunrise or before sunset',
        'Patience: Wait for interesting behavior, not just presence',
        'Clean Background: Avoid distracting elements',
        'Focus on Eyes: Sharp eyes are critical',
        'Burst Mode: Use for action shots'
      ]
    }
  },
  {
    id: 'video-shot-types',
    title: 'Video Shot Types',
    description: 'Essential shot types for conservation storytelling',
    category: 'video',
    icon: '🎥',
    content: {
      type: 'reference',
      items: [
        '**ECU (Extreme Close-Up):** Eyes, details, emotions',
        '**CU (Close-Up):** Face, small subject fills frame',
        '**MCU (Medium Close-Up):** Head and shoulders',
        '**MS (Medium Shot):** Waist up, shows gestures',
        '**MWS (Medium Wide Shot):** Full body with context',
        '**WS (Wide Shot):** Subject in environment',
        '**EWS (Extreme Wide Shot):** Establishing, landscape',
        '',
        '**Camera Movements:**',
        '• Pan: Horizontal swivel (follow subject)',
        '• Tilt: Vertical swivel (tree trunk to canopy)',
        '• Zoom: Change focal length (use sparingly)',
        '• Track/Dolly: Camera moves with subject',
        '',
        '**Pro Tips:**',
        '• Start wide to establish context',
        '• Use variety of shots (10+ types per sequence)',
        '• Hold each shot 5+ seconds minimum',
        '• Collect B-roll (cutaway shots)'
      ]
    }
  },
  {
    id: 'field-audio',
    title: 'Field Audio Recording',
    description: 'Capture quality natural soundscapes and interviews',
    category: 'audio',
    icon: '🎤',
    content: {
      type: 'tips',
      items: [
        'Use external mic (phone mic picks up handling noise)',
        'Windscreen: Essential for outdoor recording',
        'Get Close: Within 2 feet for interviews',
        'Monitor Audio: Use headphones, check levels',
        'Natural Sound: Record 30s of ambience for each location',
        'Quiet Times: Dawn recording avoids traffic',
        'Backup Recording: Phone + recorder redundancy',
        'File Naming: Location-Date-Subject format',
        'Bird Songs: Record in mono, 48kHz sampling',
        'Post-Processing: Normalize volume, reduce noise'
      ]
    }
  },
  {
    id: 'shot-list-template',
    title: 'Shot List Template',
    description: 'Pre-production planning template',
    category: 'video',
    icon: '📋',
    content: {
      type: 'template',
      items: [
        '# Project: [Conservation Video Title]',
        '',
        '## Scene 1: [Location Name]',
        '**Setup:** What we\'re filming and why',
        '',
        '### Shot 1.1',
        '• Type: Establishing Wide Shot',
        '• Lens: 24mm',
        '• Action: Pan across stream',
        '• Audio: Natural sound (water)',
        '• Duration: 10 seconds',
        '• Notes: Golden hour light',
        '',
        '### Shot 1.2',
        '• Type: Medium Shot',
        '• Lens: 50mm',
        '• Action: Student collecting water sample',
        '• Audio: Natural + dialogue',
        '• Duration: 15 seconds',
        '• Notes: Focus on hands',
        '',
        '### Shot 1.3',
        '• Type: Close-Up',
        '• Lens: 100mm',
        '• Action: Water sample in test tube',
        '• Audio: Natural sound',
        '• Duration: 5 seconds',
        '',
        '## B-Roll Needed:',
        '• Stream flowing over rocks',
        '• Macro shots of insects',
        '• Tree canopy',
        '• Equipment close-ups',
        '• Team interactions'
      ]
    }
  },
  {
    id: 'video-treatment',
    title: 'Video Treatment Template',
    description: 'Creative brief for conservation stories',
    category: 'video',
    icon: '📝',
    content: {
      type: 'template',
      items: [
        '# Video Treatment: [Project Title]',
        '',
        '**Logline:**',
        'One sentence describing the story',
        'Example: "A team of youth ambassadors restore a degraded trout stream through hands-on conservation"',
        '',
        '**Target Audience:**',
        '• Who will watch this?',
        '• What do they care about?',
        '• What should they learn/feel?',
        '',
        '**Look & Feel:**',
        '• Tone: Inspiring, Educational, Documentary',
        '• Pacing: Medium (not too fast)',
        '• Color Grade: Natural, earthy tones',
        '• Music: Acoustic, hopeful',
        '',
        '**Story Structure (3 Acts):**',
        '',
        '**Act 1 - Setup (25%):**',
        '• Introduce the problem/challenge',
        '• Meet the students/team',
        '• Establish stakes',
        '',
        '**Act 2 - Confrontation (50%):**',
        '• Show the work being done',
        '• Obstacles and learning',
        '• Character development',
        '',
        '**Act 3 - Resolution (25%):**',
        '• Results and impact',
        '• Reflection and growth',
        '• Call to action',
        '',
        '**Key Scenes:**',
        '1. Stream before restoration',
        '2. Team planning session',
        '3. Planting native vegetation',
        '4. Water quality testing',
        '5. Stream after (time-lapse)',
        '',
        '**Interview Questions:**',
        '• Why is this stream important?',
        '• What did you learn?',
        '• How will this help wildlife?',
        '• What\'s next?'
      ]
    }
  },
  {
    id: 'field-notes',
    title: 'Scientific Field Notes',
    description: 'Professional documentation standards',
    category: 'writing',
    icon: '📓',
    content: {
      type: 'guide',
      items: [
        '**Header Information:**',
        '• Date, time, location (GPS coordinates)',
        '• Weather conditions',
        '• Observer name(s)',
        '• Project/purpose',
        '',
        '**Observation Format:**',
        '• Who/What: Species, behavior',
        '• Where: Specific habitat details',
        '• When: Time of observation',
        '• How: Method of observation',
        '• Why: Context, significance',
        '',
        '**Best Practices:**',
        '✓ Write in pencil (waterproof)',
        '✓ Be specific and quantitative',
        '✓ Sketch diagrams when helpful',
        '✓ Cross-reference photos with notes',
        '✓ Record negatives (what you didn\'t see)',
        '✓ Note uncertainties ("possibly", "appeared to")',
        '✓ Write legibly for future reference',
        '✓ Date every page',
        '',
        '**Data Recording:**',
        '• Use standard units (metric)',
        '• Include measurement precision',
        '• Record raw data, analyze later',
        '• Duplicate critical data',
        '• Note equipment used',
        '',
        '**Example Entry:**',
        '*Yellow Breeches Creek, Cumberland Co., PA*',
        '*Date: 2025-10-12, 06:30-08:00*',
        '*Weather: Clear, 12°C, light breeze*',
        '*Observer: J. Smith*',
        '',
        '*Water quality measurements:*',
        '*- Temp: 14.2°C (thermometer ±0.5°)*',
        '*- pH: 7.4 (test kit)*',
        '*- DO: 8.2 mg/L (probe)*',
        '',
        '*Macroinvertebrate survey (kick net, 30s):*',
        '*- Stonefly nymphs: 12*',
        '*- Mayfly nymphs: 8*',
        '*- Caddisfly larvae: 15*',
        '*Notes: High diversity, excellent water quality*'
      ]
    }
  },
  {
    id: 'presentation-tips',
    title: 'Effective Presentations',
    description: 'Deliver compelling conservation talks',
    category: 'presentation',
    icon: '🎤',
    content: {
      type: 'tips',
      items: [
        '**Slide Design:**',
        '• One idea per slide',
        '• Large, readable fonts (30pt+)',
        '• High-quality images',
        '• Minimal text (6 words per line, 6 lines max)',
        '• Consistent color scheme',
        '',
        '**Story Structure:**',
        '1. Hook: Start with surprising fact or question',
        '2. Problem: What\'s the conservation issue?',
        '3. Solution: What you did/learned',
        '4. Results: Impact and data',
        '5. Call to Action: What audience should do',
        '',
        '**Delivery Tips:**',
        '• Practice 3+ times',
        '• Know your first sentence cold',
        '• Make eye contact with audience',
        '• Speak slowly and clearly',
        '• Use pauses for emphasis',
        '• Show enthusiasm!',
        '• Tell stories, not just facts',
        '• Use "we" not "I"',
        '',
        '**Handling Q&A:**',
        '• Repeat question for audience',
        '• It\'s okay to say "I don\'t know"',
        '• Offer to follow up with answer',
        '• Thank questioner',
        '• Keep answers brief (1-2 minutes)',
        '',
        '**Technical Setup:**',
        '• Test equipment beforehand',
        '• Have backup (USB drive, cloud)',
        '• Arrive 15 minutes early',
        '• Bring presenter notes',
        '• Water bottle nearby'
      ]
    }
  }
];

export default function MediaPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Resources', icon: '📚', color: 'linear-gradient(135deg, #0077B6, #023047)' },
    { id: 'photography', name: 'Photography', icon: '📸', color: 'linear-gradient(135deg, #FFB703, #FB8500)' },
    { id: 'video', name: 'Video', icon: '🎥', color: 'linear-gradient(135deg, #9D4EDD, #7209B7)' },
    { id: 'audio', name: 'Audio', icon: '🎤', color: 'linear-gradient(135deg, #06D6A0, #059669)' },
    { id: 'writing', name: 'Writing', icon: '📓', color: 'linear-gradient(135deg, #FF6B35, #FF8C42)' },
    { id: 'presentation', name: 'Presentations', icon: '🎤', color: 'linear-gradient(135deg, #0077B6, #00B4D8)' }
  ];

  const filteredResources = RESOURCES.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #9D4EDD, #7209B7)',
        color: 'white',
        padding: '3rem 1.5rem',
        marginBottom: '2rem',
        borderRadius: '16px'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          🎬 Media & Documentation Resources
        </h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Professional techniques for documenting your conservation work
        </p>
      </section>

      {/* Search and Filter */}
      <div className="card section" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="🔍 Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            border: '2px solid #E5E7EB',
            borderRadius: '12px',
            marginBottom: '1rem'
          }}
        />

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeCategory === cat.id ? cat.color : 'white',
                color: activeCategory === cat.id ? 'white' : '#374151',
                border: '2px solid #E5E7EB',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredResources.map((resource) => {
          const category = categories.find(c => c.id === resource.category);
          const isExpanded = expandedResource === resource.id;

          return (
            <div
              key={resource.id}
              className="card section"
              style={{
                borderLeft: `4px solid`,
                borderLeftColor: category?.color.match(/#[\w]+/)?.[0] || '#0077B6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{resource.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: category?.color || '#F8F9FA',
                    color: 'white',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem'
                  }}>
                    {resource.category}
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{resource.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.5 }}>
                    {resource.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setExpandedResource(isExpanded ? null : resource.id)}
                className={isExpanded ? "btn-success" : "btn-outline"}
                style={{ width: '100%' }}
              >
                {isExpanded ? '📖 Hide Content' : '📖 View Content'}
              </button>

              {isExpanded && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.5rem',
                  background: '#F8F9FA',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    fontFamily: resource.content.type === 'template' ? 'monospace' : 'inherit'
                  }}>
                    {resource.content.items.map((item, idx) => {
                      // Parse markdown-style formatting
                      const isBold = item.startsWith('**') && item.includes(':**');
                      const isBullet = item.startsWith('•') || item.startsWith('-');
                      const isHeader = item.startsWith('#');
                      
                      if (item === '') return <br key={idx} />;
                      
                      if (isHeader) {
                        return (
                          <div key={idx} style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
                            {item.replace(/^#+\s*/, '')}
                          </div>
                        );
                      }
                      
                      if (isBold) {
                        const parts = item.split(':**');
                        return (
                          <div key={idx} style={{ fontWeight: 700, marginTop: '0.75rem' }}>
                            {parts[0].replace(/\*\*/g, '')}:{parts[1] || ''}
                          </div>
                        );
                      }
                      
                      if (isBullet) {
                        return (
                          <div key={idx} style={{ marginLeft: '1.5rem' }}>
                            {item}
                          </div>
                        );
                      }
                      
                      return <div key={idx}>{item}</div>;
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6B7280' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#374151' }}>No resources found</h3>
          <p>Try adjusting your search or filter</p>
        </div>
      )}

      {/* Equipment Checklist */}
      <section className="card section" style={{ background: '#F8F9FA', marginTop: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>🎒 Field Documentation Checklist</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="card section" style={{ background: 'white' }}>
            <h3>Photography</h3>
            <ul style={{ lineHeight: 2, fontSize: '0.9rem' }}>
              <li>Camera (or phone)</li>
              <li>Extra batteries</li>
              <li>Memory cards (multiple)</li>
              <li>Lens cloth</li>
              <li>Weather protection</li>
              <li>Tripod (optional)</li>
            </ul>
          </div>
          <div className="card section" style={{ background: 'white' }}>
            <h3>Audio/Video</h3>
            <ul style={{ lineHeight: 2, fontSize: '0.9rem' }}>
              <li>Recording device</li>
              <li>External microphone</li>
              <li>Windscreen/deadcat</li>
              <li>Headphones</li>
              <li>Backup recorder</li>
              <li>Extra batteries</li>
            </ul>
          </div>
          <div className="card section" style={{ background: 'white' }}>
            <h3>Documentation</h3>
            <ul style={{ lineHeight: 2, fontSize: '0.9rem' }}>
              <li>Field notebook</li>
              <li>Pencils (waterproof)</li>
              <li>Ruler/measuring tape</li>
              <li>GPS device</li>
              <li>Watch/timer</li>
              <li>Smartphone (backup)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
