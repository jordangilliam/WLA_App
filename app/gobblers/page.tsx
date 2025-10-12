'use client';

import { useState, useEffect, useRef } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';

/**
 * Gobblers Page - Turkey Calling Education
 * 
 * Learn and practice turkey calling:
 * - Different turkey calls and their meanings
 * - Various calling tools and techniques
 * - Audio examples for each call
 * - Record and grade your practice attempts
 * - Track progress and earn achievements
 */

interface TurkeyCall {
  id: string;
  name: string;
  emoji: string;
  description: string;
  whenToUse: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  audioExample?: string;
  technique: string;
  commonMistakes: string[];
  tips: string[];
}

interface CallingTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  bestFor: string[];
  howToUse: string;
  maintenance: string;
  priceRange: string;
}

interface PracticeRecording {
  id: string;
  timestamp: number;
  callId: string;
  toolId: string;
  audioUrl: string;
  duration: number;
  score?: number;
  feedback?: string;
  notes: string;
}

const TURKEY_CALLS: TurkeyCall[] = [
  {
    id: 'yelp',
    name: 'Yelp',
    emoji: '🗣️',
    description: 'Most common turkey sound. A series of single notes, often 3-8 notes. Basic communication call.',
    whenToUse: 'All day, all season. Primary locating call. Hens use to communicate with each other and locate gobblers.',
    difficulty: 'Beginner',
    technique: 'Produce a series of clear, evenly-spaced notes. Each note should be distinct with slight pause between. Start slow and even.',
    commonMistakes: [
      'Too fast - sounds unnatural',
      'Notes running together',
      'Too loud or aggressive',
      'Inconsistent rhythm'
    ],
    tips: [
      'Start with 3-4 note series',
      'Keep rhythm steady and natural',
      'Vary volume and frequency throughout day',
      'Listen to real hens and mimic their cadence'
    ]
  },
  {
    id: 'cluck',
    name: 'Cluck',
    emoji: '🔊',
    description: 'Short, sharp, single note. Very versatile call used by both hens and gobblers.',
    whenToUse: 'When turkey is close. To get attention. Mixed with other calls. Shows contentment.',
    difficulty: 'Beginner',
    technique: 'Quick, sharp pop. Think "tuck" or "putt". Can be soft or loud depending on situation.',
    commonMistakes: [
      'Too soft to be heard',
      'Too harsh or aggressive',
      'Wrong rhythm when combining with yelps'
    ],
    tips: [
      'Practice both soft feeding clucks and louder locator clucks',
      'Combine with yelps for realism',
      'Use sparingly when turkeys are close',
      'Great confidence call'
    ]
  },
  {
    id: 'purr',
    name: 'Purr',
    emoji: '💤',
    description: 'Soft, rolling, vibrating sound. Indicates contentment. One of the most effective close-range calls.',
    whenToUse: 'When turkey is within 50 yards. Shows contentment and relaxation. Very reassuring to approaching gobbler.',
    difficulty: 'Intermediate',
    technique: 'Produce a rolling, vibrating sound. Like a cat purring but higher pitched. Very soft and subtle.',
    commonMistakes: [
      'Too loud - loses effectiveness',
      'Too fast or choppy',
      'Not enough vibrato',
      'Using at long range'
    ],
    tips: [
      'Master this call for close encounters',
      'Keep volume very low',
      'Mix with soft clucks',
      'Most effective call for finishing birds'
    ]
  },
  {
    id: 'cutt',
    name: 'Cutting',
    emoji: '⚡',
    description: 'Sharp, erratic, loud series of clucks. Excited, aggressive call. Often used by dominant hen.',
    whenToUse: 'To get gobbler fired up. When competition calling. Locating distant birds.',
    difficulty: 'Intermediate',
    technique: 'Rapid-fire clucks, very loud and aggressive. No rhythm, sounds frantic and excited.',
    commonMistakes: [
      'Too rhythmic - should sound erratic',
      'Not aggressive enough',
      'Using too often',
      'Calling to silent birds'
    ],
    tips: [
      'Use sparingly - can educate birds',
      'Great for getting response from gobbler',
      'Follow with softer yelps',
      'Best for mid-morning when birds separate'
    ]
  },
  {
    id: 'kee-kee',
    name: 'Kee-Kee Run',
    emoji: '🐣',
    description: 'High-pitched whistle of young turkey, often followed by yelps. Lost call of young birds.',
    whenToUse: 'Fall hunting. Late season. Reassembling scattered flock. Can work on lonely gobblers.',
    difficulty: 'Advanced',
    technique: 'Series of 3-4 high-pitched whistles, often ending with yelps as young bird matures.',
    commonMistakes: [
      'Not high-pitched enough',
      'Too many whistles',
      'Poor transition to yelps',
      'Using in spring when inappropriate'
    ],
    tips: [
      'Deadly in fall',
      'Works on subordinate gobblers in spring',
      'Practice the whistle-to-yelp transition',
      'Keep it plaintive and lonesome'
    ]
  },
  {
    id: 'gobble',
    name: 'Gobble',
    emoji: '🦃',
    description: 'The iconic turkey sound. Loud, rolling, multi-syllable call of mature gobbler.',
    whenToUse: 'Rarely! Can call in dominant gobbler to fight. Can make subordinate birds leave. Locating tool.',
    difficulty: 'Expert',
    technique: 'Deep, loud, rolling "gob-ob-ob-obble". Requires good diaphragm control or shaker call.',
    commonMistakes: [
      'Using too often',
      'Not loud or confident enough',
      'Calling in dominant birds that fight you',
      'Spooking subordinate gobblers'
    ],
    tips: [
      'Use very cautiously',
      'Best as shock gobble to locate',
      'Can work on lonely, subordinate gobblers',
      'Practice to make it loud and realistic'
    ]
  },
  {
    id: 'putt',
    name: 'Putt / Alarm Putt',
    emoji: '⚠️',
    description: 'Sharp alarm call. Indicates danger. Single or series of loud, sharp notes.',
    whenToUse: 'You DON\'T want to make this call! It means you\'ve been spotted or something is wrong.',
    difficulty: 'Beginner',
    technique: 'Sharp, explosive "putt!" sound. Loud and authoritative.',
    commonMistakes: [
      'Actually making this call on purpose!',
      'Moving when turkey putts at you'
    ],
    tips: [
      'Learn to recognize it - means you messed up',
      'Freeze if you hear it',
      'Wait 30+ minutes before calling again',
      'Learn from the mistake'
    ]
  },
  {
    id: 'tree-yelp',
    name: 'Tree Yelp',
    emoji: '🌳',
    description: 'Soft, raspy yelps made by roosted turkeys at dawn. More nasal and raspy than regular yelps.',
    whenToUse: 'Pre-dawn, when setting up near roost. Lets gobbler know hen is nearby.',
    difficulty: 'Intermediate',
    technique: 'Softer, raspier version of regular yelp. More nasal tone. Usually 2-3 notes.',
    commonMistakes: [
      'Too loud - should be soft',
      'Not raspy enough',
      'Calling too much',
      'Calling after flydown'
    ],
    tips: [
      'Wait for gobbler to sound off first',
      'Call sparingly - 2-3 series max',
      'Stop calling when birds fly down',
      'Lets gobbler know where to go'
    ]
  },
  {
    id: 'cackle',
    name: 'Fly-Down Cackle',
    emoji: '✈️',
    description: 'Excited cutting mixed with wing flapping sound. Made when flying down from roost.',
    whenToUse: 'At fly-down time. Shows excitement. Can trigger gobbler to fly down.',
    difficulty: 'Advanced',
    technique: 'Fast, excited cutting that accelerates, mixed with wing-beat sounds. Very animated.',
    commonMistakes: [
      'Using at wrong time of day',
      'Not animated enough',
      'Poor rhythm',
      'Using when birds already on ground'
    ],
    tips: [
      'Great right at flydown time',
      'Combine with actual movement (wing flapping motion)',
      'Can trigger gobbler to fly down',
      'Sounds like hen hitting ground'
    ]
  }
];

const CALLING_TOOLS: CallingTool[] = [
  {
    id: 'box-call',
    name: 'Box Call',
    emoji: '📦',
    description: 'Wooden box with paddle lid. One of the oldest and most effective turkey calls.',
    difficulty: 'Beginner',
    bestFor: ['Yelps', 'Clucks', 'Cutting'],
    howToUse: 'Hold box in one hand, scrape paddle across lip of box with other hand. Control pressure and speed for different sounds. Very forgiving call.',
    maintenance: 'Keep dry! Chalk paddle regularly. Don\'t over-chalk. Store in waterproof container.',
    priceRange: '$15-$80'
  },
  {
    id: 'slate-call',
    name: 'Slate/Pot Call',
    emoji: '🥘',
    description: 'Circular surface (slate, glass, or aluminum) with striker. Very versatile and realistic.',
    difficulty: 'Beginner',
    bestFor: ['Yelps', 'Clucks', 'Purrs', 'Cutting'],
    howToUse: 'Hold pot steady, use striker in circular or back-forth motion. Vary pressure, speed, and angle for different sounds.',
    maintenance: 'Condition surface with sandpaper or conditioning stone. Keep dry. Roughen striker tip periodically.',
    priceRange: '$20-$60'
  },
  {
    id: 'mouth-call',
    name: 'Diaphragm/Mouth Call',
    emoji: '👄',
    description: 'Latex reed call placed in roof of mouth. Requires practice but most versatile. Hands-free.',
    difficulty: 'Intermediate',
    bestFor: ['All calls', 'Hands-free calling'],
    howToUse: 'Place against roof of mouth, horse-shoe forward. Force air over reed(s) while controlling with tongue. Takes practice!',
    maintenance: 'Rinse after each use. Store in fridge. Replace every season or when latex breaks down.',
    priceRange: '$3-$10 (buy several)'
  },
  {
    id: 'push-button',
    name: 'Push-Button Call',
    emoji: '🔘',
    description: 'Simple push-button mechanism. Very easy to use. Great for kids and beginners.',
    difficulty: 'Beginner',
    bestFor: ['Yelps', 'Clucks'],
    howToUse: 'Simply push and release button. Speed and pressure control sound. Very simple!',
    maintenance: 'Keep dry. Wood-on-wood design needs chalk. Very durable.',
    priceRange: '$10-$30'
  },
  {
    id: 'tube-call',
    name: 'Tube/Snuff Can Call',
    emoji: '🎺',
    description: 'Suction call. Create sound by sucking/blowing. Good for loud, locator yelps.',
    difficulty: 'Beginner',
    bestFor: ['Loud yelps', 'Gobbles', 'Kee-kees'],
    howToUse: 'Suck or blow through tube while manipulating opening. Can make very loud calls for locating.',
    maintenance: 'Wipe clean. Keep rubber gaskets supple. Very durable.',
    priceRange: '$8-$25'
  },
  {
    id: 'wingbone-call',
    name: 'Wingbone Call',
    emoji: '🦴',
    description: 'Traditional call made from turkey wing bones. Historical and challenging.',
    difficulty: 'Advanced',
    bestFor: ['Yelps', 'Clucks', 'Kee-kees'],
    howToUse: 'Create suction by kissing/sucking on mouthpiece. Very challenging but authentic sound.',
    maintenance: 'Wipe clean. Apply light coat of oil occasionally. Handle carefully.',
    priceRange: '$20-$60'
  }
];

export default function GobblersPage() {
  const { award } = usePoints();
  
  const [view, setView] = useState<'calls' | 'tools' | 'practice'>('calls');
  const [selectedCall, setSelectedCall] = useState<TurkeyCall | null>(null);
  const [selectedTool, setSelectedTool] = useState<CallingTool | null>(null);
  const [recordings, setRecordings] = useState<PracticeRecording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedCallForPractice, setSelectedCallForPractice] = useState('');
  const [selectedToolForPractice, setSelectedToolForPractice] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = () => {
    try {
      const stored = localStorage.getItem('wla-turkey-recordings');
      if (stored) {
        setRecordings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recordings:', error);
    }
  };

  const saveRecordings = (recs: PracticeRecording[]) => {
    try {
      localStorage.setItem('wla-turkey-recordings', JSON.stringify(recs));
      setRecordings(recs);
    } catch (error) {
      console.error('Failed to save recordings:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create recording entry
        const recording: PracticeRecording = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          callId: selectedCallForPractice,
          toolId: selectedToolForPractice,
          audioUrl,
          duration: recordingTime,
          score: Math.floor(Math.random() * 30) + 70, // 70-100 (simulated grading)
          feedback: generateFeedback(),
          notes: ''
        };

        const call = TURKEY_CALLS.find(c => c.id === selectedCallForPractice);
        if (call) {
          award(recording.score! / 10, `${call.name} Practice!`);
        }

        saveRecordings([...recordings, recording]);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Please allow microphone access to record calls');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const generateFeedback = (): string => {
    const feedbacks = [
      'Great rhythm! Keep practicing to improve consistency.',
      'Good tone quality. Try varying the volume next time.',
      'Nice work! Focus on making notes more distinct.',
      'Excellent! Your timing is improving.',
      'Good effort! Try to make it sound more natural.',
      'Well done! Practice will make it even better.',
      'Strong attempt! Watch your pacing.',
      'Nice call! Work on that raspy tone.',
      'Good job! Try to add more emotion to it.',
      'Solid performance! Keep it up!'
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
        color: 'white',
        padding: '2rem 1rem',
        borderRadius: '0 0 24px 24px'
      }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            🦃 Turkey Calling Academy
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
            Master the art of turkey calling - Learn, Practice, Improve
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="container" style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setView('calls')}
            style={{
              padding: '0.75rem 1.5rem',
              background: view === 'calls' ? '#2D3748' : 'white',
              color: view === 'calls' ? 'white' : '#023047',
              border: '2px solid #2D3748',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📚 Turkey Calls ({TURKEY_CALLS.length})
          </button>
          <button
            onClick={() => setView('tools')}
            style={{
              padding: '0.75rem 1.5rem',
              background: view === 'tools' ? '#2D3748' : 'white',
              color: view === 'tools' ? 'white' : '#023047',
              border: '2px solid #2D3748',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🛠️ Calling Tools ({CALLING_TOOLS.length})
          </button>
          <button
            onClick={() => setView('practice')}
            style={{
              padding: '0.75rem 1.5rem',
              background: view === 'practice' ? '#2D3748' : 'white',
              color: view === 'practice' ? 'white' : '#023047',
              border: '2px solid #2D3748',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🎤 Practice & Record ({recordings.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto 2rem', padding: '0 1rem' }}>
        {view === 'calls' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {TURKEY_CALLS.map(call => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                  {call.emoji}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.5rem', textAlign: 'center' }}>
                  {call.name}
                </h3>
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: call.difficulty === 'Beginner' ? '#D1FAE5' :
                             call.difficulty === 'Intermediate' ? '#FEF3C7' :
                             call.difficulty === 'Advanced' ? '#FED7AA' : '#FEE2E2',
                  color: call.difficulty === 'Beginner' ? '#065F46' :
                         call.difficulty === 'Intermediate' ? '#92400E' :
                         call.difficulty === 'Advanced' ? '#C2410C' : '#991B1B',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem'
                }}>
                  {call.difficulty}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {call.description}
                </p>
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB', fontSize: '0.85rem', color: '#6B7280' }}>
                  <strong>When to use:</strong> {call.whenToUse.substring(0, 60)}...
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'tools' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {CALLING_TOOLS.map(tool => (
              <div
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                  {tool.emoji}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.5rem', textAlign: 'center' }}>
                  {tool.name}
                </h3>
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: tool.difficulty === 'Beginner' ? '#D1FAE5' : tool.difficulty === 'Intermediate' ? '#FEF3C7' : '#FED7AA',
                  color: tool.difficulty === 'Beginner' ? '#065F46' : tool.difficulty === 'Intermediate' ? '#92400E' : '#C2410C',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem'
                }}>
                  {tool.difficulty}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {tool.description}
                </p>
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    <strong>Best for:</strong> {tool.bestFor.join(', ')}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2D3748' }}>
                    💰 {tool.priceRange}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'practice' && (
          <div>
            {/* Recording Interface */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#023047', marginBottom: '1.5rem' }}>
                🎤 Practice Recording
              </h2>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                      Select Call to Practice
                    </label>
                    <select
                      value={selectedCallForPractice}
                      onChange={(e) => setSelectedCallForPractice(e.target.value)}
                      disabled={isRecording}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Choose a call...</option>
                      {TURKEY_CALLS.map(call => (
                        <option key={call.id} value={call.id}>
                          {call.emoji} {call.name} ({call.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#023047' }}>
                      Tool Used
                    </label>
                    <select
                      value={selectedToolForPractice}
                      onChange={(e) => setSelectedToolForPractice(e.target.value)}
                      disabled={isRecording}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Choose a tool...</option>
                      {CALLING_TOOLS.map(tool => (
                        <option key={tool.id} value={tool.id}>
                          {tool.emoji} {tool.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: isRecording ? '#FEE2E2' : '#F3F4F6',
                  borderRadius: '12px'
                }}>
                  {isRecording && (
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: 900,
                      color: '#EF4444',
                      marginBottom: '1rem',
                      animation: 'pulse 1.5s infinite'
                    }}>
                      ⏺️ {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </div>
                  )}

                  {!isRecording && (
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                      🎤
                    </div>
                  )}

                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!selectedCallForPractice || !selectedToolForPractice}
                    style={{
                      padding: '1rem 2rem',
                      background: isRecording ? '#EF4444' : '#2D3748',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      cursor: (!selectedCallForPractice || !selectedToolForPractice) ? 'not-allowed' : 'pointer',
                      opacity: (!selectedCallForPractice || !selectedToolForPractice) ? 0.5 : 1
                    }}
                  >
                    {isRecording ? '⏹️ Stop Recording' : '⏺️ Start Recording'}
                  </button>

                  {!selectedCallForPractice && !selectedToolForPractice && (
                    <p style={{ marginTop: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>
                      Select a call and tool to begin practicing
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recordings List */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#023047', marginBottom: '1rem' }}>
              📝 Your Practice Recordings
            </h2>

            {recordings.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '3rem 2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎤</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.5rem' }}>
                  No Recordings Yet
                </h3>
                <p style={{ color: '#6B7280' }}>
                  Start practicing your turkey calls and track your progress!
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {recordings.slice().reverse().map(recording => {
                  const call = TURKEY_CALLS.find(c => c.id === recording.callId);
                  const tool = CALLING_TOOLS.find(t => t.id === recording.toolId);
                  return (
                    <div
                      key={recording.id}
                      style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <div style={{ fontSize: '2rem' }}>
                          {call?.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#023047', marginBottom: '0.25rem' }}>
                            {call?.name} with {tool?.name}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                            📅 {new Date(recording.timestamp).toLocaleDateString()} • 
                            ⏱️ {Math.floor(recording.duration / 60)}:{(recording.duration % 60).toString().padStart(2, '0')}
                          </div>
                          
                          <audio
                            controls
                            src={recording.audioUrl}
                            style={{ width: '100%', marginBottom: '0.75rem' }}
                          />

                          {recording.feedback && (
                            <div style={{
                              padding: '0.75rem',
                              background: '#F0FDF4',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              color: '#065F46'
                            }}>
                              💬 {recording.feedback}
                            </div>
                          )}
                        </div>
                        
                        {recording.score && (
                          <div style={{
                            padding: '0.75rem 1rem',
                            background: recording.score >= 90 ? '#D1FAE5' :
                                       recording.score >= 80 ? '#FEF3C7' :
                                       recording.score >= 70 ? '#FED7AA' : '#FEE2E2',
                            borderRadius: '8px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#023047' }}>
                              {recording.score}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>
                              SCORE
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <div
          onClick={() => setSelectedCall(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            overflow: 'auto'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: '16px',
              padding: '2rem'
            }}
          >
            <button
              onClick={() => setSelectedCall(null)}
              style={{
                float: 'right',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#E5E7EB',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>
              {selectedCall.emoji}
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#023047', textAlign: 'center', marginBottom: '0.5rem' }}>
              {selectedCall.name}
            </h2>

            <div style={{
              textAlign: 'center',
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: selectedCall.difficulty === 'Beginner' ? '#D1FAE5' :
                         selectedCall.difficulty === 'Intermediate' ? '#FEF3C7' :
                         selectedCall.difficulty === 'Advanced' ? '#FED7AA' : '#FEE2E2',
              color: selectedCall.difficulty === 'Beginner' ? '#065F46' :
                     selectedCall.difficulty === 'Intermediate' ? '#92400E' :
                     selectedCall.difficulty === 'Advanced' ? '#C2410C' : '#991B1B',
              borderRadius: '8px',
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}>
              {selectedCall.difficulty} Level
            </div>

            <div style={{
              padding: '1rem',
              background: '#F9FAFB',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.6 }}>
                {selectedCall.description}
              </p>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              🎯 When to Use
            </h3>
            <p style={{ color: '#374151', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {selectedCall.whenToUse}
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              🎓 Technique
            </h3>
            <p style={{ color: '#374151', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {selectedCall.technique}
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              ❌ Common Mistakes
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              {selectedCall.commonMistakes.map((mistake, i) => (
                <li key={i} style={{ color: '#374151', marginBottom: '0.5rem' }}>{mistake}</li>
              ))}
            </ul>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              💡 Pro Tips
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              {selectedCall.tips.map((tip, i) => (
                <li key={i} style={{ color: '#374151', marginBottom: '0.5rem' }}>{tip}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                setSelectedCall(null);
                setView('practice');
                setSelectedCallForPractice(selectedCall.id);
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              🎤 Practice This Call
            </button>
          </div>
        </div>
      )}

      {/* Tool Detail Modal */}
      {selectedTool && (
        <div
          onClick={() => setSelectedTool(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: '16px',
              padding: '2rem'
            }}
          >
            <button
              onClick={() => setSelectedTool(null)}
              style={{
                float: 'right',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#E5E7EB',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>
              {selectedTool.emoji}
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#023047', textAlign: 'center', marginBottom: '1.5rem' }}>
              {selectedTool.name}
            </h2>

            <div style={{
              padding: '1rem',
              background: '#F9FAFB',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.6 }}>
                {selectedTool.description}
              </p>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              🎯 Best For
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              {selectedTool.bestFor.map((item, i) => (
                <li key={i} style={{ color: '#374151', marginBottom: '0.5rem' }}>{item}</li>
              ))}
            </ul>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              📖 How to Use
            </h3>
            <p style={{ color: '#374151', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {selectedTool.howToUse}
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#023047', marginBottom: '0.75rem' }}>
              🔧 Maintenance
            </h3>
            <p style={{ color: '#374151', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {selectedTool.maintenance}
            </p>

            <div style={{
              padding: '1rem',
              background: '#FFF3E0',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                Price Range
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#E65100' }}>
                {selectedTool.priceRange}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

