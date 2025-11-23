'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const ICONS = {
  award: '/images/icons/award.jpg',
  map: '/images/icons/Map.jpg',
  habitat: '/images/icons/Habitat.png',
  macro: '/images/icons/Micor(Macro).png',
}

const featureHighlights = [
  { label: 'Authentication & User Management', status: 'Live', accent: '#22C55E' },
  { label: 'Classes & Student Oversight', status: 'Live', accent: '#22C55E' },
  { label: 'Field Journals & Observations', status: 'Live', accent: '#22C55E' },
  { label: 'Educational Content & Keys', status: 'Live', accent: '#22C55E' },
  { label: 'Organization Management', status: 'In Flight', accent: '#FACC15' },
  { label: 'Subscriptions & Billing', status: 'In Flight', accent: '#FACC15' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/api/auth/signin')
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(circle at 15% 20%, rgba(29,166,219,0.18), transparent 45%), radial-gradient(circle at 85% 0%, rgba(234,126,55,0.2), transparent 40%), #F5F7FB',
        }}
      >
        <div
          className="animate-spin rounded-full border-4 border-white/20 border-t-white"
          style={{ width: '54px', height: '54px' }}
        />
      </div>
    )
  }

  if (!session) return null

  const cardStyle = {
    background: 'white',
    borderRadius: '24px',
    padding: '1.75rem',
    border: '1px solid rgba(148,163,184,0.2)',
    boxShadow: '0 20px 55px rgba(15,23,42,0.08)',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 15% 20%, rgba(29,166,219,0.18), transparent 45%), radial-gradient(circle at 85% 0%, rgba(234,126,55,0.15), transparent 40%), #F7FAFF',
        paddingBottom: '4rem',
      }}
    >
      <section
        style={{
          maxWidth: '1200px',
          margin: '1.5rem auto',
          padding: '3rem 2rem',
          borderRadius: '32px',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          background: 'linear-gradient(135deg, #0B1C2C 0%, #053047 55%, #0EA5E9 100%)',
          boxShadow: '0 35px 70px rgba(5,48,71,0.45)',
        }}
      >
        <Image
          src="/images/hero/Hero BAckground.jpg"
          alt="Admin hero"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.12 }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: 0, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
            Executive Console · Wildlife Leadership Academy
          </p>
          <h1 style={{ margin: '0.6rem 0', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 900 }}>
            Welcome, {session.user?.name || session.user?.email}
          </h1>
          <p style={{ margin: '0 0 1.5rem', color: 'rgba(255,255,255,0.9)', maxWidth: '680px', lineHeight: 1.5 }}>
            Core infrastructure is deployed. The remaining enterprise tooling arrives in the next milestone—here’s a live look at what’s online vs. shipping soon.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/dashboard/teacher')}
              style={{
                border: 'none',
                borderRadius: '16px',
                padding: '0.85rem 1.4rem',
                background: 'white',
                color: '#053047',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Open Teacher HQ
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: '16px',
                padding: '0.85rem 1.4rem',
                background: 'transparent',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Return to App
            </button>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Image src={ICONS.habitat} alt="Deployment" width={50} height={50} style={{ borderRadius: '14px' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>Core App Deployed Successfully</h2>
              <p style={{ margin: '0.35rem 0 0', color: '#5E6A82' }}>Admin modules are rolling out in phases. Here’s the status board.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {featureHighlights.map((feature) => (
              <div
                key={feature.label}
                style={{
                  padding: '1rem',
                  borderRadius: '18px',
                  background: 'rgba(249,250,251,0.9)',
                  border: '1px solid rgba(226,232,240,0.8)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{feature.label}</span>
                  <span
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: feature.accent,
                      background: `${feature.accent}1A`,
                    }}
                  >
                    {feature.status}
                  </span>
                </div>
                <div style={{ height: '4px', borderRadius: '999px', background: 'rgba(148,163,184,0.3)' }}>
                  <div
                    style={{
                      width: feature.status === 'Live' ? '100%' : '45%',
                      height: '100%',
                      borderRadius: '999px',
                      background: feature.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {[
            {
              title: 'Teacher Dashboard',
              description: 'Manage classes, missions, and rosters.',
              action: () => router.push('/dashboard/teacher'),
              gradient: 'linear-gradient(135deg, #0F766E, #22C55E)',
              icon: ICONS.award,
            },
            {
              title: 'Student Dashboard',
              description: 'Preview the learner experience.',
              action: () => router.push('/dashboard/student'),
              gradient: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
              icon: ICONS.map,
            },
            {
              title: 'Back to Home',
              description: 'Return to the main conservation app.',
              action: () => router.push('/'),
              gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)',
              icon: ICONS.macro,
            },
          ].map((card) => (
            <button
              key={card.title}
              onClick={card.action}
              style={{
                border: 'none',
                borderRadius: '24px',
                padding: '1.5rem',
                textAlign: 'left',
                color: 'white',
                background: card.gradient,
                boxShadow: '0 25px 55px rgba(15,23,42,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
                  <Image src={card.icon} alt={card.title} width={34} height={34} style={{ borderRadius: '12px' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>{card.title}</h3>
                  <p style={{ margin: 0, opacity: 0.85 }}>{card.description}</p>
                </div>
              </div>
              <span style={{ fontWeight: 700 }}>Open →</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
