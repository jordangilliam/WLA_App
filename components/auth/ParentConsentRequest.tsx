'use client';

import React, { useState } from 'react';

interface ParentConsentRequestProps {
  studentName: string;
  studentEmail: string;
  onComplete: () => void;
}

export default function ParentConsentRequest({
  studentName,
  studentEmail,
  onComplete,
}: ParentConsentRequestProps) {
  const [parentEmail, setParentEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parentEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (parentEmail.toLowerCase() === studentEmail.toLowerCase()) {
      setError('Parent email must be different from student email');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/request-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_email: studentEmail,
          parent_email: parentEmail,
        }),
      });

      if (response.ok) {
        onComplete();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send consent request');
        setSubmitting(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
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
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
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
            👨‍👩‍👧‍👦
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#1E40AF',
            marginBottom: '0.5rem',
          }}>
            Parent/Guardian Consent Required
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            lineHeight: 1.6,
          }}>
            Because you&apos;re under 13, federal law (COPPA) requires your parent or guardian to approve your WildPraxis account.
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          background: '#DBEAFE',
          border: '2px solid #3B82F6',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#1E40AF',
            marginBottom: '1rem',
          }}>
            What happens next?
          </h3>
          <ol style={{
            margin: 0,
            paddingLeft: '1.5rem',
            color: '#1E3A8A',
            fontSize: '0.9375rem',
            lineHeight: 1.8,
          }}>
            <li>We&apos;ll send an email to your parent/guardian</li>
            <li>They&apos;ll review what data we collect and how we protect it</li>
            <li>They can approve or deny your account</li>
            <li>Once approved, you can start using WildPraxis!</li>
          </ol>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="parentEmail"
              style={{
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              Parent or Guardian Email Address
            </label>
            <input
              id="parentEmail"
              type="email"
              value={parentEmail}
              onChange={(e) => {
                setParentEmail(e.target.value);
                setError('');
              }}
              placeholder="parent@example.com"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                fontSize: '1rem',
                border: error ? '2px solid #EF4444' : '2px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                opacity: submitting ? 0.6 : 1,
              }}
              onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = '#3B82F6';
              }}
              onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = '#E5E7EB';
              }}
              required
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
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#6B7280',
            }}>
              Make sure this is an email your parent/guardian checks regularly!
            </p>
          </div>

          {/* Privacy Assurance */}
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#166534',
              margin: 0,
              lineHeight: 1.6,
            }}>
              🔒 <strong>Your Safety is Our Priority</strong>
              <br />
              We will NOT share your information with anyone. Your parent will only receive a consent form explaining how WildPraxis protects your data.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '1rem',
              background: submitting
                ? '#9CA3AF'
                : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {submitting ? '⏳ Sending...' : '📧 Send Consent Request'}
          </button>
        </form>

        {/* Help Text */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #E5E7EB',
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            textAlign: 'center',
            margin: 0,
          }}>
            <strong>Need help?</strong> Contact your teacher or email{' '}
            <a
              href="mailto:support@wildpraxis.org"
              style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: 600 }}
            >
              support@wildpraxis.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

