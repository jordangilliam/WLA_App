'use client';
import { useState } from 'react';

interface AutomationJob {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  icon: string;
  category: 'reporting' | 'compliance' | 'operations' | 'analysis';
  lastRun?: Date;
  status?: 'idle' | 'running' | 'success' | 'error';
}

const AUTOMATIONS: AutomationJob[] = [
  {
    id: 'daily-digest',
    name: 'Daily Cohort Digest',
    description: 'Generate daily summary of cohort activities and upload to cloud storage',
    endpoint: '/api/automations/daily-digest',
    icon: '📊',
    category: 'reporting'
  },
  {
    id: 'anomaly-scan',
    name: 'Engagement Anomaly Detection',
    description: 'Analyze student engagement patterns and flag anomalies for intervention',
    endpoint: '/api/automations/anomaly-scan',
    icon: '🔍',
    category: 'analysis'
  },
  {
    id: 'outreach-pack',
    name: 'Outreach Verification Pack',
    description: 'Build verification receipts for student outreach activities with documentation',
    endpoint: '/api/automations/outreach-pack',
    icon: '📋',
    category: 'compliance'
  },
  {
    id: 'grant-pack',
    name: 'Grant Reporting Package',
    description: 'Assemble comprehensive grant report with metrics, narratives, and supporting data',
    endpoint: '/api/automations/grant-pack',
    icon: '💰',
    category: 'reporting'
  },
  {
    id: 'board-bundle',
    name: 'Board Meeting Bundle',
    description: 'Create quarterly board report with summary metrics and session data',
    endpoint: '/api/automations/board-bundle',
    icon: '📑',
    category: 'reporting'
  },
  {
    id: 'retention',
    name: 'Data Retention Sweep',
    description: 'Generate data retention compliance report based on policy',
    endpoint: '/api/automations/retention',
    icon: '🗄️',
    category: 'compliance'
  },
  {
    id: 'workforce',
    name: 'Workforce Jobs Normalizer',
    description: 'Normalize and categorize conservation career postings for student access',
    endpoint: '/api/automations/workforce',
    icon: '💼',
    category: 'operations'
  }
];

export default function AdminAutomations() {
  const [track, setTrack] = useState('Brookies');
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [jobData, setJobData] = useState<Record<string, any>>({
    sessions: '[]',
    series: '[]',
    outreach: '[]',
    jobs: '[]',
    grantName: 'PA Game Commission Grant',
    narrative: 'This program advances youth conservation leadership with equitable access to field experiences.',
    timeframe: 'FY25 Q1',
    summary: 'Quarterly update: Strong engagement across all tracks with measurable conservation outcomes.',
    policyDays: 180
  });
  const [results, setResults] = useState<Record<string, { status: string; time: Date; message?: string }>>({});
  const [showScheduler, setShowScheduler] = useState(false);

  const runAutomation = async (job: AutomationJob) => {
    setResults({
      ...results,
      [job.id]: { status: 'running', time: new Date() }
    });

    try {
      let body: any = { track };

      // Build request body based on job type
      switch (job.id) {
        case 'daily-digest':
          body.sessions = JSON.parse(jobData.sessions || '[]');
          break;
        case 'anomaly-scan':
          body.series = JSON.parse(jobData.series || '[]');
          break;
        case 'outreach-pack':
          body.entries = JSON.parse(jobData.outreach || '[]');
          break;
        case 'grant-pack':
          body = {
            ...body,
            grantName: jobData.grantName,
            timeframe: jobData.timeframe,
            narrative: jobData.narrative,
            sessions: JSON.parse(jobData.sessions || '[]')
          };
          break;
        case 'board-bundle':
          body.summary = jobData.summary;
          body.sessions = JSON.parse(jobData.sessions || '[]');
          break;
        case 'retention':
          body.policyDays = jobData.policyDays;
          break;
        case 'workforce':
          body.jobs = JSON.parse(jobData.jobs || '[]');
          break;
      }

      const res = await fetch(job.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json().catch(() => ({}));

      setResults({
        ...results,
        [job.id]: {
          status: res.ok ? 'success' : 'error',
          time: new Date(),
          message: res.ok ? 'Completed successfully' : (data.error || `Error: ${res.status}`)
        }
      });
    } catch (error: any) {
      setResults({
        ...results,
        [job.id]: {
          status: 'error',
          time: new Date(),
          message: error.message
        }
      });
    }
  };

  const categoryColors = {
    reporting: 'linear-gradient(135deg, #0077B6, #023047)',
    compliance: 'linear-gradient(135deg, #9D4EDD, #7209B7)',
    operations: 'linear-gradient(135deg, #06D6A0, #059669)',
    analysis: 'linear-gradient(135deg, #FFB703, #FB8500)'
  };

  const groupedJobs = AUTOMATIONS.reduce((acc, job) => {
    if (!acc[job.category]) acc[job.category] = [];
    acc[job.category].push(job);
    return acc;
  }, {} as Record<string, AutomationJob[]>);

  return (
    <div>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #023047, #0077B6)',
        color: 'white',
        padding: '3rem 1.5rem',
        marginBottom: '2rem',
        borderRadius: '16px'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          ⚙️ Admin Automations
        </h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Automated workflows for reporting, compliance, and operations management
        </p>
      </section>

      {/* Global Settings */}
      <div className="card section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Global Settings</h3>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>
              These settings apply to all automation jobs
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <span style={{ fontWeight: 600 }}>Track:</span>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '2px solid #E5E7EB',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                <option>Brookies</option>
                <option>Bass</option>
                <option>Bucktails</option>
                <option>Gobblers</option>
                <option>Ursids</option>
              </select>
            </label>
            <button
              onClick={() => setShowScheduler(!showScheduler)}
              className="btn-outline"
            >
              📅 {showScheduler ? 'Hide' : 'Show'} Scheduler
            </button>
          </div>
        </div>

        {showScheduler && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: '#F8F9FA',
            borderRadius: '12px'
          }}>
            <h4 style={{ marginTop: 0 }}>Cron Schedule Setup</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>Daily Digest:</strong>
                <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: 'white', borderRadius: '4px' }}>
                  0 6 * * * (Daily at 6 AM)
                </code>
              </div>
              <div>
                <strong>Anomaly Scan:</strong>
                <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: 'white', borderRadius: '4px' }}>
                  0 */4 * * * (Every 4 hours)
                </code>
              </div>
              <div>
                <strong>Board Bundle:</strong>
                <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: 'white', borderRadius: '4px' }}>
                  0 0 1 */3 * (Quarterly)
                </code>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '1rem', marginBottom: 0 }}>
              Configure these in Vercel → Project → Settings → Cron Jobs
            </p>
          </div>
        )}
      </div>

      {/* Automation Jobs by Category */}
      {Object.entries(groupedJobs).map(([category, jobs]) => (
        <div key={category} style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '4px',
              height: '32px',
              background: categoryColors[category as keyof typeof categoryColors],
              borderRadius: '999px'
            }} />
            <h2 style={{ margin: 0, textTransform: 'capitalize' }}>
              {category} Automations
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {jobs.map((job) => {
              const result = results[job.id];
              return (
                <div
                  key={job.id}
                  className="card section"
                  style={{
                    borderLeft: `4px solid`,
                    borderLeftColor: categoryColors[job.category].match(/#[\w]+/)?.[0] || '#0077B6'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>{job.icon}</div>
                    {result && (
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background:
                          result.status === 'running' ? '#FEF3C7' :
                          result.status === 'success' ? '#D1FAE5' :
                          result.status === 'error' ? '#FEE2E2' : '#F8F9FA',
                        color:
                          result.status === 'running' ? '#92400E' :
                          result.status === 'success' ? '#065F46' :
                          result.status === 'error' ? '#991B1B' : '#6B7280'
                      }}>
                        {result.status === 'running' && '⏳ '}
                        {result.status === 'success' && '✓ '}
                        {result.status === 'error' && '✗ '}
                        {result.status}
                      </div>
                    )}
                  </div>

                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{job.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                    {job.description}
                  </p>

                  {result?.time && (
                    <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1rem' }}>
                      Last run: {result.time.toLocaleString()}
                      {result.message && (
                        <div style={{ marginTop: '0.25rem', fontWeight: 600 }}>
                          {result.message}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}
                      className="btn-outline"
                      style={{ flex: 1 }}
                    >
                      {activeJob === job.id ? 'Hide' : 'Configure'}
                    </button>
                    <button
                      onClick={() => runAutomation(job)}
                      className="btn-success"
                      disabled={result?.status === 'running'}
                      style={{ flex: 1 }}
                    >
                      {result?.status === 'running' ? 'Running...' : 'Run Now'}
                    </button>
                  </div>

                  {/* Configuration Panel */}
                  {activeJob === job.id && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: '#F8F9FA',
                      borderRadius: '8px'
                    }}>
                      <h4 style={{ marginTop: 0, fontSize: '1rem' }}>Configuration</h4>
                      {job.id === 'daily-digest' && (
                        <textarea
                          value={jobData.sessions}
                          onChange={(e) => setJobData({ ...jobData, sessions: e.target.value })}
                          placeholder='[{"date":"2025-01-15","students":25,"points":450}]'
                          style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '2px solid #E5E7EB',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem'
                          }}
                        />
                      )}
                      {job.id === 'anomaly-scan' && (
                        <textarea
                          value={jobData.series}
                          onChange={(e) => setJobData({ ...jobData, series: e.target.value })}
                          placeholder='[{"email":"student@example.com","week":1,"points":50}]'
                          style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '2px solid #E5E7EB',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem'
                          }}
                        />
                      )}
                      {job.id === 'grant-pack' && (
                        <>
                          <input
                            value={jobData.grantName}
                            onChange={(e) => setJobData({ ...jobData, grantName: e.target.value })}
                            placeholder="Grant Name"
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              marginBottom: '0.5rem',
                              borderRadius: '6px',
                              border: '2px solid #E5E7EB'
                            }}
                          />
                          <input
                            value={jobData.timeframe}
                            onChange={(e) => setJobData({ ...jobData, timeframe: e.target.value })}
                            placeholder="Timeframe (e.g., FY25 Q1)"
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              marginBottom: '0.5rem',
                              borderRadius: '6px',
                              border: '2px solid #E5E7EB'
                            }}
                          />
                          <textarea
                            value={jobData.narrative}
                            onChange={(e) => setJobData({ ...jobData, narrative: e.target.value })}
                            placeholder="Grant narrative"
                            style={{
                              width: '100%',
                              minHeight: '80px',
                              padding: '0.75rem',
                              borderRadius: '6px',
                              border: '2px solid #E5E7EB'
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Help Section */}
      <div className="card section" style={{ background: '#F8F9FA' }}>
        <h3>📚 Automation Guide</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4>Running Jobs</h4>
            <ul style={{ lineHeight: 1.8, fontSize: '0.9rem' }}>
              <li>Click "Configure" to set job parameters</li>
              <li>Enter JSON data in the provided fields</li>
              <li>Click "Run Now" to execute</li>
              <li>Check status indicator for results</li>
            </ul>
          </div>
          <div>
            <h4>Scheduling</h4>
            <ul style={{ lineHeight: 1.8, fontSize: '0.9rem' }}>
              <li>Set up cron jobs in Vercel dashboard</li>
              <li>Use endpoint URLs from each job</li>
              <li>Configure secret for authentication</li>
              <li>Test with manual runs first</li>
            </ul>
          </div>
          <div>
            <h4>Best Practices</h4>
            <ul style={{ lineHeight: 1.8, fontSize: '0.9rem' }}>
              <li>Test with small datasets first</li>
              <li>Monitor job execution times</li>
              <li>Review error messages</li>
              <li>Keep data backups</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
