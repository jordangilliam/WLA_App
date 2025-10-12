'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AgeGate from '@/components/auth/AgeGate';
import ParentConsentRequest from '@/components/auth/ParentConsentRequest';

type SignupStep = 'role' | 'age-gate' | 'form' | 'consent' | 'complete';

export default function SignupPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<SignupStep>('role');
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [isUnder13, setIsUnder13] = useState(false);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    classCode: '',
    schoolName: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Choose Role
  const handleRoleSelect = (selectedRole: 'student' | 'teacher') => {
    setRole(selectedRole);
    
    if (selectedRole === 'student') {
      setStep('age-gate');
    } else {
      setStep('form'); // Teachers skip age gate
    }
  };

  // Step 2: Age Gate
  const handleAgeVerify = (year: number, under13: boolean) => {
    setBirthYear(year);
    setIsUnder13(under13);
    setStep('form');
  };

  // Step 3: Form Submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
          birth_year: birthYear,
          is_under_13: isUnder13,
          class_code: role === 'student' ? formData.classCode : undefined,
          school_name: role === 'teacher' ? formData.schoolName : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // If under 13, show consent request
      if (role === 'student' && isUnder13) {
        setStep('consent');
      } else {
        setStep('complete');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  // Step 4: Consent Complete
  const handleConsentComplete = () => {
    setStep('complete');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E8F4F8 0%, #F0F9F4 25%, #FFF8E7 50%, #F4F1E8 75%, #E3F2E1 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
    }}>
      {/* Age Gate Modal */}
      {step === 'age-gate' && (
        <AgeGate
          onVerify={handleAgeVerify}
          onCancel={() => {
            setStep('role');
            setRole(null);
          }}
        />
      )}

      {/* Consent Request Modal */}
      {step === 'consent' && (
        <ParentConsentRequest
          studentName={formData.name}
          studentEmail={formData.email}
          onComplete={handleConsentComplete}
        />
      )}

      {/* Main Signup Content */}
      {step !== 'age-gate' && step !== 'consent' && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          maxWidth: '500px',
          width: '100%',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #6B8E7F 0%, #4A6F5C 100%)',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌲</div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}>
              Join WildPraxis
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.9)',
              margin: '0.5rem 0 0 0',
            }}>
              Conservation education for the next generation
            </p>
          </div>

          <div style={{ padding: '2rem' }}>
            {/* Step 1: Role Selection */}
            {step === 'role' && (
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}>
                  I am a...
                </h2>

                <div style={{
                  display: 'grid',
                  gap: '1rem',
                }}>
                  <button
                    onClick={() => handleRoleSelect('student')}
                    style={{
                      padding: '2rem',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎒</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Student</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                      Learn about nature, earn badges, go on adventures!
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('teacher')}
                    style={{
                      padding: '2rem',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👨‍🏫</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Teacher/Educator</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                      Manage classes, track progress, inspire students!
                    </div>
                  </button>
                </div>

                <div style={{
                  marginTop: '1.5rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                }}>
                  Already have an account?{' '}
                  <a
                    href="/auth"
                    style={{
                      color: '#3B82F6',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign in
                  </a>
                </div>
              </div>
            )}

            {/* Step 3: Signup Form */}
            {step === 'form' && role && (
              <div>
                <button
                  onClick={() => {
                    setStep('role');
                    setRole(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#3B82F6',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                  }}
                >
                  ← Back
                </button>

                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1E40AF',
                  marginBottom: '0.5rem',
                }}>
                  {role === 'student' ? '🎒 Student' : '👨‍🏫 Teacher'} Signup
                </h2>
                
                {isUnder13 && (
                  <div style={{
                    background: '#DBEAFE',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#1E40AF',
                    marginBottom: '1rem',
                  }}>
                    ℹ️ Parent consent will be required after signup
                  </div>
                )}

                <form onSubmit={handleSignup}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={8}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  {role === 'student' && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                        Class Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.classCode}
                        onChange={(e) => setFormData({ ...formData, classCode: e.target.value.toUpperCase() })}
                        placeholder="e.g., ABC123"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '1rem',
                        }}
                      />
                      <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                        Get this from your teacher to join their class
                      </p>
                    </div>
                  )}

                  {role === 'teacher' && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                        School Name
                      </label>
                      <input
                        type="text"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        placeholder="e.g., Central High School"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '1rem',
                        }}
                      />
                    </div>
                  )}

                  {error && (
                    <div style={{
                      background: '#FEE2E2',
                      color: '#EF4444',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                    }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              </div>
            )}

            {/* Step 5: Complete */}
            {step === 'complete' && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                  {isUnder13 ? '📧' : '🎉'}
                </div>
                
                {isUnder13 ? (
                  <>
                    <h2 style={{
                      fontSize: '1.75rem',
                      fontWeight: 'bold',
                      color: '#1E40AF',
                      marginBottom: '1rem',
                    }}>
                      Consent Request Sent!
                    </h2>
                    <p style={{
                      fontSize: '1rem',
                      color: '#6B7280',
                      lineHeight: 1.6,
                      marginBottom: '2rem',
                    }}>
                      We&apos;ve sent an email to your parent/guardian. Once they approve, you&apos;ll be able to sign in and start your WildPraxis adventure!
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      marginBottom: '2rem',
                    }}>
                      Check your email for updates (usually within 24 hours).
                    </p>
                  </>
                ) : (
                  <>
                    <h2 style={{
                      fontSize: '1.75rem',
                      fontWeight: 'bold',
                      color: '#1E40AF',
                      marginBottom: '1rem',
                    }}>
                      Account Created!
                    </h2>
                    <p style={{
                      fontSize: '1rem',
                      color: '#6B7280',
                      lineHeight: 1.6,
                      marginBottom: '2rem',
                    }}>
                      Welcome to WildPraxis! You&apos;re ready to start your conservation journey.
                    </p>
                  </>
                )}

                <button
                  onClick={() => router.push('/auth')}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isUnder13 ? 'Got It!' : 'Sign In Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

