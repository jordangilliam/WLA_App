'use client';
import { useState, useEffect } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  organization: string;
  type: 'workshop' | 'volunteer' | 'meeting' | 'field-work' | 'webinar';
  description: string;
  link?: string;
  points: number;
}

interface Official {
  name: string;
  title: string;
  agency: string;
  email?: string;
  phone?: string;
  region?: string;
}

interface Policy {
  title: string;
  status: 'proposed' | 'active' | 'comment-period' | 'passed';
  agency: string;
  summary: string;
  deadline?: string;
  link?: string;
}

const PA_OFFICIALS: Official[] = [
  {
    name: 'Pennsylvania Game Commission',
    title: 'State Wildlife Agency',
    agency: 'PGC',
    email: 'pgccomments@pa.gov',
    phone: '(717) 787-4250'
  },
  {
    name: 'Pennsylvania Fish & Boat Commission',
    title: 'State Fisheries Agency',
    agency: 'PFBC',
    email: 'ra-pfbcinfo@pa.gov',
    phone: '(717) 705-7800'
  },
  {
    name: 'PA Department of Conservation & Natural Resources',
    title: 'State Parks & Forests',
    agency: 'DCNR',
    email: 'dcnr-web-ra@pa.gov',
    phone: '(717) 787-2869'
  },
  {
    name: 'PA Department of Environmental Protection',
    title: 'Environmental Regulation',
    agency: 'DEP',
    email: 'ecomment@pa.gov',
    phone: '(717) 783-2300'
  },
  {
    name: 'National Wild Turkey Federation - PA Chapter',
    title: 'Conservation Partner',
    agency: 'NWTF',
    email: 'pennsylvania@nwtf.net',
    phone: '(717) 273-5714'
  },
  {
    name: 'Trout Unlimited - PA Council',
    title: 'Coldwater Conservation',
    agency: 'TU',
    email: 'pacouncil@tu.org'
  }
];

const SAMPLE_POLICIES: Policy[] = [
  {
    title: 'Chronic Wasting Disease Management Plan',
    status: 'comment-period',
    agency: 'PA Game Commission',
    summary: 'Proposed regulations for CWD surveillance and management in deer populations. Public comment period open until March 31.',
    deadline: '2025-03-31',
    link: 'https://www.pgc.pa.gov'
  },
  {
    title: 'Brook Trout Habitat Protection Initiative',
    status: 'proposed',
    agency: 'PA Fish & Boat Commission',
    summary: 'New regulations to protect wild brook trout streams from development and establish buffer zones.',
    link: 'https://www.fishandboat.com'
  },
  {
    title: 'Pennsylvania Clean Streams Law Update',
    status: 'active',
    agency: 'PA DEP',
    summary: 'Enhanced protections for headwater streams and wetlands, stricter erosion control requirements.',
    link: 'https://www.dep.pa.gov'
  }
];

const SAMPLE_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Stream Cleanup & Macroinvertebrate Survey',
    date: '2025-11-15',
    location: 'Yellow Breeches Creek, Cumberland County',
    organization: 'Cumberland Valley Chapter, TU',
    type: 'volunteer',
    description: 'Join us for a stream cleanup followed by hands-on macroinvertebrate sampling and identification. All equipment provided!',
    points: 20,
    link: 'https://www.tu.org'
  },
  {
    id: 'e2',
    title: 'Wildlife Camera Trap Workshop',
    date: '2025-11-20',
    location: 'Rothrock State Forest',
    organization: 'PA Game Commission',
    type: 'workshop',
    description: 'Learn to set up and monitor wildlife cameras for deer, bear, and turkey population surveys.',
    points: 15,
    link: 'https://www.pgc.pa.gov'
  },
  {
    id: 'e3',
    title: 'Coldwater Conservation Webinar',
    date: '2025-11-25',
    location: 'Virtual / Zoom',
    organization: 'Trout Unlimited',
    type: 'webinar',
    description: 'Climate change impacts on Pennsylvania brook trout and what we can do about it.',
    points: 10,
    link: 'https://www.tu.org'
  },
  {
    id: 'e4',
    title: 'Wild Turkey Brood Survey Training',
    date: '2025-12-01',
    location: 'Tioga State Forest',
    organization: 'National Wild Turkey Federation',
    type: 'field-work',
    description: 'Training for citizen scientists to conduct summer brood surveys and report data.',
    points: 20,
    link: 'https://www.nwtf.org'
  },
  {
    id: 'e5',
    title: 'PA Water Quality Monitoring Conference',
    date: '2025-12-10',
    location: 'Penn State University Park',
    organization: 'Alliance for Aquatic Resource Monitoring',
    type: 'meeting',
    description: 'Annual conference for volunteer water quality monitors. Present your findings!',
    points: 25,
    link: 'https://www.allianceforaquaticmonitoring.org'
  }
];

const TYPE_COLORS = {
  workshop: 'linear-gradient(135deg, #FFB703, #FB8500)',
  volunteer: 'linear-gradient(135deg, #06D6A0, #059669)',
  meeting: 'linear-gradient(135deg, #9D4EDD, #7209B7)',
  'field-work': 'linear-gradient(135deg, #0077B6, #023047)',
  webinar: 'linear-gradient(135deg, #A7C957, #6A994E)'
};

const TYPE_ICONS = {
  workshop: '🛠️',
  volunteer: '🤝',
  meeting: '📋',
  'field-work': '🔬',
  webinar: '💻'
};

export default function OutreachPage() {
  const { award } = usePoints();
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([]);
  const [completedEvents, setCompletedEvents] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: 'volunteer',
    points: 10
  });

  useEffect(() => {
    const savedRsvp = localStorage.getItem('wla-rsvp-events');
    if (savedRsvp) {
      try {
        setRsvpEvents(JSON.parse(savedRsvp));
      } catch {}
    }
    
    const savedCompleted = localStorage.getItem('wla-completed-events');
    if (savedCompleted) {
      try {
        setCompletedEvents(JSON.parse(savedCompleted));
      } catch {}
    }
  }, []);

  const rsvpEvent = (eventId: string) => {
    const updated = [...rsvpEvents, eventId];
    setRsvpEvents(updated);
    localStorage.setItem('wla-rsvp-events', JSON.stringify(updated));
  };

  const completeEvent = (event: Event) => {
    const updated = [...completedEvents, event.id];
    setCompletedEvents(updated);
    localStorage.setItem('wla-completed-events', JSON.stringify(updated));
    award(event.points, `Completed: ${event.title}`);
  };

  const filteredEvents = selectedType === 'all' 
    ? events 
    : events.filter(e => e.type === selectedType);

  const upcomingEvents = filteredEvents.filter(e => !completedEvents.includes(e.id));

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
          📢 Conservation Outreach & Advocacy
        </h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Connect with PA conservation organizations, attend events, track policies, and make your voice heard!
        </p>
      </section>

      {/* Stats */}
      <div className="row" style={{ marginBottom: '2rem' }}>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #06D6A0, #059669)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{rsvpEvents.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Events RSVPd</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #FFB703, #FB8500)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{completedEvents.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Events Completed</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #9D4EDD, #7209B7)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{PA_OFFICIALS.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Contacts</p>
        </div>
      </div>

      {/* Events Section */}
      <div className="card section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>📅 Upcoming Events</h2>
          <button 
            onClick={() => setShowAddEvent(!showAddEvent)}
            className="btn-outline"
          >
            {showAddEvent ? '❌ Cancel' : '➕ Add Event'}
          </button>
        </div>

        {/* Add Event Form */}
        {showAddEvent && (
          <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3>Add New Event</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title || ''}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
              />
              <input
                type="date"
                placeholder="Date"
                value={newEvent.date || ''}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location || ''}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
              />
              <input
                type="text"
                placeholder="Organization"
                value={newEvent.organization || ''}
                onChange={(e) => setNewEvent({...newEvent, organization: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
              />
              <select
                value={newEvent.type || 'volunteer'}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value as Event['type']})}
                style={{ padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
              >
                <option value="workshop">Workshop</option>
                <option value="volunteer">Volunteer</option>
                <option value="meeting">Meeting</option>
                <option value="field-work">Field Work</option>
                <option value="webinar">Webinar</option>
              </select>
              <textarea
                placeholder="Description"
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB', minHeight: '80px', fontFamily: 'inherit' }}
              />
              <button
                onClick={() => {
                  if (newEvent.title && newEvent.date && newEvent.location) {
                    const event: Event = {
                      id: `custom-${Date.now()}`,
                      title: newEvent.title,
                      date: newEvent.date,
                      location: newEvent.location || '',
                      organization: newEvent.organization || 'Custom Event',
                      type: newEvent.type || 'volunteer',
                      description: newEvent.description || '',
                      link: newEvent.link,
                      points: newEvent.points || 10
                    };
                    setEvents([...events, event]);
                    setShowAddEvent(false);
                    setNewEvent({ type: 'volunteer', points: 10 });
                  } else {
                    alert('Please fill in at least title, date, and location');
                  }
                }}
                className="btn-success"
              >
                ➕ Add Event
              </button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedType('all')}
            style={{
              padding: '0.75rem 1.5rem',
              background: selectedType === 'all' ? 'linear-gradient(135deg, #0077B6, #023047)' : 'white',
              color: selectedType === 'all' ? 'white' : '#374151',
              border: '2px solid #E5E7EB',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            All Events
          </button>
          {Object.keys(TYPE_COLORS).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '0.75rem 1.5rem',
                background: selectedType === type ? TYPE_COLORS[type as keyof typeof TYPE_COLORS] : 'white',
                color: selectedType === type ? 'white' : '#374151',
                border: '2px solid #E5E7EB',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              {TYPE_ICONS[type as keyof typeof TYPE_ICONS]} {type.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {upcomingEvents.map(event => (
            <div
              key={event.id}
              style={{
                padding: '1.5rem',
                background: 'white',
                border: rsvpEvents.includes(event.id) ? '3px solid #06D6A0' : '2px solid #E5E7EB',
                borderRadius: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: TYPE_COLORS[event.type],
                      color: 'white',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}>
                      {TYPE_ICONS[event.type]} {event.type.replace('-', ' ')}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>
                      📅 {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>{event.title}</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#6B7280' }}>
                    <div>📍 {event.location}</div>
                    <div>🏛️ {event.organization}</div>
                  </div>
                  
                  <p style={{ margin: '0 0 1rem 0', color: '#374151', lineHeight: 1.6 }}>
                    {event.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: '#FFD60A',
                      color: '#023047',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}>
                      +{event.points} points
                    </div>
                    {event.link && (
                      <a 
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#F8F9FA',
                          color: '#0077B6',
                          borderRadius: '999px',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          textDecoration: 'none'
                        }}
                      >
                        🔗 Learn More
                      </a>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                  {!rsvpEvents.includes(event.id) ? (
                    <button
                      onClick={() => rsvpEvent(event.id)}
                      className="btn-outline"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      ✋ RSVP
                    </button>
                  ) : (
                    <>
                      <div style={{
                        padding: '0.75rem',
                        background: '#D1FAE5',
                        color: '#065F46',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        ✅ RSVPd
                      </div>
                      <button
                        onClick={() => completeEvent(event)}
                        className="btn-success"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        🎉 Mark Complete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {upcomingEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
            <p>No events in this category. Check back later or add your own!</p>
          </div>
        )}
      </div>

      {/* Policy Tracker */}
      <div className="card section" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>📜 Policy Tracker</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {SAMPLE_POLICIES.map((policy, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.5rem',
                background: '#F8F9FA',
                borderRadius: '12px',
                borderLeft: `4px solid ${
                  policy.status === 'comment-period' ? '#DC2626' :
                  policy.status === 'proposed' ? '#FFB703' :
                  policy.status === 'active' ? '#06D6A0' :
                  '#9D4EDD'
                }`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{policy.title}</h3>
                  <div style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    🏛️ {policy.agency}
                  </div>
                </div>
                <div style={{
                  padding: '0.5rem 1rem',
                  background: 
                    policy.status === 'comment-period' ? '#FEE2E2' :
                    policy.status === 'proposed' ? '#FEF3C7' :
                    policy.status === 'active' ? '#D1FAE5' :
                    '#F3E8FF',
                  color:
                    policy.status === 'comment-period' ? '#991B1B' :
                    policy.status === 'proposed' ? '#92400E' :
                    policy.status === 'active' ? '#065F46' :
                    '#581C87',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  {policy.status}
                </div>
              </div>
              
              <p style={{ margin: '0 0 1rem 0', lineHeight: 1.6 }}>{policy.summary}</p>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {policy.deadline && (
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: '#FEE2E2',
                    color: '#991B1B',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    ⏰ Deadline: {new Date(policy.deadline).toLocaleDateString()}
                  </div>
                )}
                {policy.link && (
                  <a
                    href={policy.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    📝 Submit Comment
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Officials Directory */}
      <div className="card section">
        <h2 style={{ marginBottom: '1.5rem' }}>📞 Conservation Officials & Partners</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {PA_OFFICIALS.map((official, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.5rem',
                background: '#F8F9FA',
                borderRadius: '12px'
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{official.name}</h3>
              <div style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                {official.title}
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                background: '#0077B6',
                color: 'white',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                {official.agency}
              </div>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
                {official.email && (
                  <div>
                    📧 <a href={`mailto:${official.email}`} style={{ color: '#0077B6' }}>{official.email}</a>
                  </div>
                )}
                {official.phone && (
                  <div>
                    📱 <a href={`tel:${official.phone}`} style={{ color: '#0077B6' }}>{official.phone}</a>
                  </div>
                )}
                {official.region && (
                  <div style={{ color: '#6B7280' }}>
                    📍 {official.region}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Tips */}
      <section className="section" style={{ background: '#F8F9FA', borderRadius: '16px', padding: '2rem', marginTop: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>💡 Make Your Voice Heard</h2>
        <div className="row">
          <div className="card section" style={{ flex: 1 }}>
            <h3>📝 Submit Public Comments</h3>
            <ul style={{ lineHeight: 2 }}>
              <li>Read the full proposal</li>
              <li>Be specific and factual</li>
              <li>Share personal experiences</li>
              <li>Submit before deadline</li>
            </ul>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>🤝 Attend Meetings</h3>
            <ul style={{ lineHeight: 2 }}>
              <li>Game Commission meetings</li>
              <li>Township planning sessions</li>
              <li>Watershed association meetings</li>
              <li>Public hearings</li>
            </ul>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>📣 Advocate Effectively</h3>
            <ul style={{ lineHeight: 2 }}>
              <li>Know the science</li>
              <li>Build relationships</li>
              <li>Stay respectful</li>
              <li>Follow up consistently</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
