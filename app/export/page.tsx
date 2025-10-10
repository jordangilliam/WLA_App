/**
 * Data Export & Backup Page
 * Allows users to export their progress to various destinations
 */

'use client';

import { useState } from 'react';
import { useExport } from '@/lib/hooks/useExport';
import type { ExportDestination, ExportFormat } from '@/lib/types/export.types';

export default function ExportPage() {
  const { exportData, exporting, lastExport } = useExport();
  const [selectedDestination, setSelectedDestination] = useState<ExportDestination>('local');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [includeJournal, setIncludeJournal] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async () => {
    setShowSuccess(false);
    
    const result = await exportData(selectedDestination, {
      format: selectedFormat,
      includeJournal,
      userName: 'WLA Ambassador', // In production, get from user profile
      userEmail: 'ambassador@example.com', // In production, get from session
      track: 'Bucktails', // In production, get from user profile
    });

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const destinations: Array<{
    id: ExportDestination;
    name: string;
    icon: string;
    description: string;
    available: boolean;
  }> = [
    {
      id: 'local',
      name: 'Download Locally',
      icon: '💾',
      description: 'Download your data as a file to your computer',
      available: true,
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      icon: '📊',
      description: 'Export to a Google Spreadsheet (requires Google sign-in)',
      available: true,
    },
    {
      id: 'onedrive',
      name: 'Microsoft OneDrive',
      icon: '☁️',
      description: 'Save to your OneDrive (requires Microsoft sign-in)',
      available: true,
    },
    {
      id: 'katie-cassidy',
      name: 'Send to Katie Cassidy',
      icon: '📧',
      description: 'Automatically email your progress report to Katie',
      available: true,
    },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          marginBottom: '0.5rem',
          color: '#111827',
        }}>
          💾 Export Your Data
        </h1>
        <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>
          Back up your progress, share with mentors, or download for your records
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && lastExport?.success && (
        <div style={{
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{ fontSize: '1.5rem' }}>✅</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Export Successful!</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              {selectedDestination === 'local' && 'File downloaded to your computer'}
              {selectedDestination === 'google-sheets' && 'Data exported to Google Sheets'}
              {selectedDestination === 'onedrive' && 'Data saved to OneDrive'}
              {selectedDestination === 'katie-cassidy' && 'Progress report sent to Katie Cassidy'}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {lastExport && !lastExport.success && (
        <div style={{
          background: '#FEE2E2',
          color: '#991B1B',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Export Failed</div>
          <div style={{ fontSize: '0.9rem' }}>{lastExport.error}</div>
        </div>
      )}

      {/* Destination Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: '#374151',
        }}>
          1. Choose Destination
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {destinations.map((dest) => (
            <button
              key={dest.id}
              onClick={() => setSelectedDestination(dest.id)}
              disabled={!dest.available}
              style={{
                padding: '1.5rem',
                background: selectedDestination === dest.id ? '#E0F2FE' : 'white',
                border: `2px solid ${selectedDestination === dest.id ? '#0077B6' : '#E5E7EB'}`,
                borderRadius: '12px',
                cursor: dest.available ? 'pointer' : 'not-allowed',
                opacity: dest.available ? 1 : 0.5,
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dest.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#111827' }}>
                {dest.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                {dest.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection (for local/onedrive) */}
      {(selectedDestination === 'local' || selectedDestination === 'onedrive') && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#374151',
          }}>
            2. Choose Format
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {(['csv', 'json'] as ExportFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                style={{
                  padding: '1rem 2rem',
                  background: selectedFormat === format ? '#0077B6' : 'white',
                  color: selectedFormat === format ? 'white' : '#374151',
                  border: `2px solid ${selectedFormat === format ? '#0077B6' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                }}
              >
                {format}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: '#374151',
        }}>
          {selectedDestination === 'local' || selectedDestination === 'onedrive' ? '3' : '2'}. Options
        </h2>
        
        <div style={{
          background: '#F9FAFB',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            padding: '0.75rem',
            borderRadius: '8px',
            transition: 'background 0.2s',
          }}
            onMouseOver={(e) => e.currentTarget.style.background = '#F3F4F6'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <input
              type="checkbox"
              checked={includeJournal}
              onChange={(e) => setIncludeJournal(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#111827' }}>Include Journal Entries</div>
              <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                Export your field notes and observations along with progress data
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={exporting}
        style={{
          width: '100%',
          padding: '1.25rem',
          background: exporting ? '#9CA3AF' : 'linear-gradient(135deg, #0077B6, #023047)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: exporting ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
        }}
      >
        {exporting ? (
          <>
            <div className="spinner" style={{
              width: '20px',
              height: '20px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            Exporting...
          </>
        ) : (
          <>
            <span>📤</span>
            Export Data
          </>
        )}
      </button>

      {/* Info Box */}
      <div style={{
        marginTop: '2rem',
        background: '#FEF3C7',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #FCD34D',
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem' }}>💡</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#92400E' }}>
              Your Data is Safe
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#78350F', fontSize: '0.9rem' }}>
              <li>All exports are encrypted during transmission</li>
              <li>You control who has access to your data</li>
              <li>Data never leaves your browser for local exports</li>
              <li>Cloud exports require your explicit permission</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

