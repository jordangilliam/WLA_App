'use client';

import React, { useState } from 'react';

interface AgeGateProps {
  onVerify: (birthYear: number, isUnder13: boolean) => void;
  onCancel?: () => void;
}

export default function AgeGate({ onVerify, onCancel }: AgeGateProps) {
  const [birthYear, setBirthYear] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();

    // Validation
    if (!year || isNaN(year)) {
      setError('Please enter a valid year');
      return;
    }

    if (year < 1900 || year > currentYear) {
      setError(`Please enter a year between 1900 and ${currentYear}`);
      return;
    }

    const age = currentYear - year;

    if (age < 6) {
      setError('You must be at least 6 years old to use WildPraxis');
      return;
    }

    // Determine if under 13 (COPPA threshold)
    const isUnder13 = age < 13;

    onVerify(year, isUnder13);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      padding: '1rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2.5rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }}>
        {/* Icon & Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
          }}>
            🛡️
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#1E40AF',
            marginBottom: '0.5rem',
          }}>
            Age Verification
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
          }}>
            To protect your privacy, we need to verify your age
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="birthYear"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              What year were you born?
            </label>
            <input
              id="birthYear"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={birthYear}
              onChange={(e) => {
                setBirthYear(e.target.value);
                setError('');
              }}
              placeholder="e.g., 2010"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1.125rem',
                border: error ? '2px solid #EF4444' : '2px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = '#3B82F6';
              }}
              onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = '#E5E7EB';
              }}
              autoFocus
            />
            {error && (
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: '#EF4444',
              }}>
                {error}
              </p>
            )}
          </div>

          {/* Privacy Notice */}
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #DBEAFE',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#1E40AF',
              margin: 0,
            }}>
              🔒 <strong>Your Privacy Matters</strong>
              <br />
              We follow COPPA guidelines to protect young students. If you&apos;re under 13, we&apos;ll need parent/guardian consent.
            </p>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
          }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.875rem',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
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
              Continue
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: 'transparent',
                  color: '#6B7280',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Footer Links */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #E5E7EB',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            margin: 0,
          }}>
            By continuing, you agree to our{' '}
            <a
              href="/legal/terms"
              target="_blank"
              style={{
                color: '#3B82F6',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Terms of Service
            </a>
            {' and '}
            <a
              href="/legal/privacy"
              target="_blank"
              style={{
                color: '#3B82F6',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

