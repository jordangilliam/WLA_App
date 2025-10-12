'use client';
import { useState, useEffect } from 'react';

interface ExportData {
  generatedAt: string;
  track: string;
  team: string;
  device: {
    ua: string;
    lang: string;
  };
  points: any[];
  readings: any[];
  journal: any[];
  birdObservations?: any[];
  habitatDesigns?: any[];
}

export default function ExportsPage() {
  const [track, setTrack] = useState('Brookies');
  const [team, setTeam] = useState('');
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [format, setFormat] = useState<'json' | 'csv' | 'txt'>('json');
  const [status, setStatus] = useState<Record<string, string>>({});
  const [includeOptions, setIncludeOptions] = useState({
    points: true,
    readings: true,
    journal: true,
    birds: true,
    habitat: true
  });

  useEffect(() => {
    generateExport();
  }, []);

  const generateExport = () => {
    try {
      const points = JSON.parse(localStorage.getItem('wla-points') || '[]');
      const readings = JSON.parse(localStorage.getItem('wla-map-readings') || '[]');
      const journal = JSON.parse(localStorage.getItem('wla-journal-entries') || '[]');
      const birdObs = JSON.parse(localStorage.getItem('wla-bird-obs') || '[]');
      const habitatHistory = JSON.parse(localStorage.getItem('wla-habitat-history') || '[]');

      const data: ExportData = {
        generatedAt: new Date().toISOString(),
        track,
        team,
        device: {
          ua: navigator.userAgent,
          lang: navigator.language
        },
        points: includeOptions.points ? points : [],
        readings: includeOptions.readings ? readings : [],
        journal: includeOptions.journal ? journal : [],
        birdObservations: includeOptions.birds ? birdObs : [],
        habitatDesigns: includeOptions.habitat ? habitatHistory : []
      };

      setExportData(data);
      setStatus({ ...status, generate: '✓ Data generated from local storage' });
    } catch (e: any) {
      setStatus({ ...status, generate: `✗ Error: ${e.message}` });
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    if (!exportData) return;
    const json = JSON.stringify(exportData, null, 2);
    const filename = `wla-export-${track}-${Date.now()}.json`;
    downloadFile(json, filename, 'application/json');
    setStatus({ ...status, json: `✓ Downloaded ${filename}` });
  };

  const exportAsCSV = () => {
    if (!exportData) return;
    
    // CSV for journal entries
    let csv = 'Type,Title,Content,Date,Location,Tags,Weather\n';
    exportData.journal.forEach((entry: any) => {
      const row = [
        entry.type,
        `"${(entry.title || '').replace(/"/g, '""')}"`,
        `"${(entry.content || '').replace(/"/g, '""')}"`,
        new Date(entry.timestamp).toISOString(),
        entry.location ? `"${entry.location.lat},${entry.location.lng}"` : '',
        `"${(entry.tags || []).join(', ')}"`,
        entry.weather || ''
      ].join(',');
      csv += row + '\n';
    });

    const filename = `wla-journal-${track}-${Date.now()}.csv`;
    downloadFile(csv, filename, 'text/csv');
    setStatus({ ...status, csv: `✓ Downloaded ${filename}` });
  };

  const exportAsText = () => {
    if (!exportData) return;
    
    let text = `WLA Conservation Portfolio Export\n`;
    text += `=${'='.repeat(50)}\n\n`;
    text += `Generated: ${new Date(exportData.generatedAt).toLocaleString()}\n`;
    text += `Track: ${exportData.track}\n`;
    text += `Team: ${exportData.team || 'N/A'}\n\n`;

    // Points Summary
    text += `\nPOINTS SUMMARY\n${'='.repeat(50)}\n`;
    const totalPoints = exportData.points.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    text += `Total Points: ${totalPoints}\n`;
    text += `Activities: ${exportData.points.length}\n\n`;

    // Journal Entries
    text += `\nJOURNAL ENTRIES (${exportData.journal.length})\n${'='.repeat(50)}\n`;
    exportData.journal.forEach((entry: any, idx: number) => {
      text += `\n[${idx + 1}] ${entry.title}\n`;
      text += `Type: ${entry.type} | Date: ${new Date(entry.timestamp).toLocaleDateString()}\n`;
      if (entry.weather) text += `Weather: ${entry.weather}\n`;
      if (entry.tags?.length) text += `Tags: ${entry.tags.join(', ')}\n`;
      text += `\n${entry.content}\n`;
      text += `${'-'.repeat(40)}\n`;
    });

    // Water Quality Readings
    if (exportData.readings.length > 0) {
      text += `\nWATER QUALITY READINGS (${exportData.readings.length})\n${'='.repeat(50)}\n`;
      exportData.readings.forEach((r: any, idx: number) => {
        text += `\n[${idx + 1}] Location: ${r.lat}, ${r.lon}\n`;
        if (r.waterTempC) text += `Water Temp: ${r.waterTempC}°C\n`;
        if (r.ph) text += `pH: ${r.ph}\n`;
        if (r.flowCfs) text += `Flow: ${r.flowCfs} cfs\n`;
        if (r.notes) text += `Notes: ${r.notes}\n`;
      });
    }

    // Bird Observations
    if (exportData.birdObservations && exportData.birdObservations.length > 0) {
      text += `\n\nBIRD OBSERVATIONS (${exportData.birdObservations.length})\n${'='.repeat(50)}\n`;
      exportData.birdObservations.forEach((bird: any, idx: number) => {
        text += `\n[${idx + 1}] ${bird.species}\n`;
        text += `Date: ${new Date(bird.timestamp).toLocaleString()}\n`;
        text += `Duration: ${Math.floor(bird.duration / 60)}:${(bird.duration % 60).toString().padStart(2, '0')}\n`;
        text += `Habitat: ${bird.habitat}\n`;
        if (bird.behavior) text += `Behavior: ${bird.behavior}\n`;
        if (bird.notes) text += `Notes: ${bird.notes}\n`;
      });
    }

    const filename = `wla-portfolio-${track}-${Date.now()}.txt`;
    downloadFile(text, filename, 'text/plain');
    setStatus({ ...status, txt: `✓ Downloaded ${filename}` });
  };

  const pushToCloud = async (provider: 'google' | 'onedrive' | 'dropbox') => {
    if (!exportData) return;
    
    setStatus({ ...status, [provider]: '⏳ Uploading...' });
    
    try {
      const res = await fetch(`/api/storage/${provider}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: exportData, track, team })
      });

      const result = await res.json();

      if (res.ok && result.ok) {
        setStatus({ ...status, [provider]: `✓ Uploaded: ${result.name || 'Success'}` });
      } else {
        setStatus({ ...status, [provider]: `✗ Error: ${result.error || 'Upload failed'}` });
      }
    } catch (e: any) {
      setStatus({ ...status, [provider]: `✗ Error: ${e.message}` });
    }
  };

  const getDataSummary = () => {
    if (!exportData) return null;

    return {
      points: exportData.points.length,
      totalPoints: exportData.points.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      journal: exportData.journal.length,
      readings: exportData.readings.length,
      birds: exportData.birdObservations?.length || 0,
      habitat: exportData.habitatDesigns?.length || 0
    };
  };

  const summary = getDataSummary();

  return (
    <div>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #06D6A0, #059669)',
        color: 'white',
        padding: '3rem 1.5rem',
        marginBottom: '2rem',
        borderRadius: '16px'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          💾 Data Export Center
        </h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Export your conservation portfolio in multiple formats or sync to cloud storage
        </p>
      </section>

      {/* Data Summary */}
      {summary && (
        <div className="row" style={{ marginBottom: '2rem' }}>
          <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #FFB703, #FB8500)', color: 'white' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{summary.totalPoints}</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>Total Points</p>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>{summary.points} activities</p>
          </div>
          <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #9D4EDD, #7209B7)', color: 'white' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{summary.journal}</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>Journal Entries</p>
          </div>
          <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #0077B6, #023047)', color: 'white' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{summary.readings}</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>Water Readings</p>
          </div>
          <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #06D6A0, #059669)', color: 'white' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{summary.birds}</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>Bird Observations</p>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="card section" style={{ marginBottom: '2rem' }}>
        <h3>Export Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <label style={{ margin: 0 }}>
            <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Track:</span>
            <select
              value={track}
              onChange={(e) => {
                setTrack(e.target.value);
                setTimeout(generateExport, 100);
              }}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
            >
              <option>Brookies</option>
              <option>Bass</option>
              <option>Bucktails</option>
              <option>Gobblers</option>
              <option>Ursids</option>
            </select>
          </label>
          <label style={{ margin: 0 }}>
            <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Team Name:</span>
            <input
              value={team}
              onChange={(e) => {
                setTeam(e.target.value);
                setTimeout(generateExport, 100);
              }}
              placeholder="e.g., Brookies Blue Squad"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '2px solid #E5E7EB' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>Include in Export:</span>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {Object.entries(includeOptions).map(([key, value]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => {
                    setIncludeOptions({ ...includeOptions, [key]: e.target.checked });
                    setTimeout(generateExport, 100);
                  }}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ textTransform: 'capitalize' }}>{key}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={generateExport}
          className="btn-outline"
        >
          🔄 Regenerate Export Data
        </button>
        {status.generate && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: status.generate.startsWith('✓') ? '#059669' : '#DC2626' }}>
            {status.generate}
          </div>
        )}
      </div>

      {/* Download Options */}
      <div className="row" style={{ marginBottom: '2rem' }}>
        <div className="card section" style={{ flex: 1 }}>
          <h3>📥 Download Locally</h3>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Save to your device in various formats for offline access or import into other tools
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={exportAsJSON}
              className="btn-success"
              style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}
            >
              <span>📄 JSON Format</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Complete data</span>
            </button>
            <button
              onClick={exportAsCSV}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}
            >
              <span>📊 CSV Format</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Spreadsheet ready</span>
            </button>
            <button
              onClick={exportAsText}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}
            >
              <span>📝 Text Format</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Portfolio report</span>
            </button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {status.json && <div style={{ fontSize: '0.85rem', color: '#059669', marginBottom: '0.25rem' }}>{status.json}</div>}
            {status.csv && <div style={{ fontSize: '0.85rem', color: '#059669', marginBottom: '0.25rem' }}>{status.csv}</div>}
            {status.txt && <div style={{ fontSize: '0.85rem', color: '#059669' }}>{status.txt}</div>}
          </div>
        </div>

        <div className="card section" style={{ flex: 1 }}>
          <h3>☁️ Cloud Storage</h3>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Sync to cloud storage for backup and sharing. Sign in on the Auth page to enable.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => pushToCloud('google')}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}
            >
              <span>📁 Google Drive</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Auto-sync</span>
            </button>
            <button
              onClick={() => pushToCloud('onedrive')}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}
            >
              <span>📂 OneDrive</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Microsoft</span>
            </button>
            <button
              onClick={() => pushToCloud('dropbox')}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}
            >
              <span>📦 Dropbox</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Beta</span>
            </button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {status.google && <div style={{ fontSize: '0.85rem', color: status.google.startsWith('✓') ? '#059669' : status.google.startsWith('⏳') ? '#FB8500' : '#DC2626', marginBottom: '0.25rem' }}>{status.google}</div>}
            {status.onedrive && <div style={{ fontSize: '0.85rem', color: status.onedrive.startsWith('✓') ? '#059669' : status.onedrive.startsWith('⏳') ? '#FB8500' : '#DC2626', marginBottom: '0.25rem' }}>{status.onedrive}</div>}
            {status.dropbox && <div style={{ fontSize: '0.85rem', color: status.dropbox.startsWith('✓') ? '#059669' : status.dropbox.startsWith('⏳') ? '#FB8500' : '#DC2626' }}>{status.dropbox}</div>}
          </div>
        </div>
      </div>

      {/* Format Guide */}
      <div className="card section" style={{ background: '#F8F9FA' }}>
        <h3>📚 Export Format Guide</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4>JSON Format</h4>
            <ul style={{ lineHeight: 1.8, fontSize: '0.9rem' }}>
              <li>Complete data structure</li>
              <li>Import into other apps</li>
              <li>Developer-friendly</li>
              <li>Includes all metadata</li>
            </ul>
          </div>
          <div>
            <h4>CSV Format</h4>
            <ul style={{ lineHeight: 1.8, fontSize: '0.9rem' }}>
              <li>Opens in Excel/Sheets</li>
              <li>Easy data analysis</li>
              <li>Journal entries focus</li>
              <li>Lightweight format</li>
            </ul>
          </div>
          <div>
            <h4>Text Format</h4>
            <ul style={{ lineHeight: 1.8, fontSize: '0.9rem' }}>
              <li>Human-readable portfolio</li>
              <li>Print-ready report</li>
              <li>All activities documented</li>
              <li>Share with mentors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
