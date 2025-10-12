'use client';
import { useState, useMemo } from 'react';

type SessionPayload = {
  generatedAt?: string;
  track?: string;
  team?: string;
  device?: { ua?: string; lang?: string };
  points?: any[];
  readings?: any[];
  journal?: any[];
  [key: string]: any;
};

function toRows(items: SessionPayload[]) {
  return items.map((s, i) => {
    const totalPoints = Array.isArray(s.points) ? s.points.reduce((a:any,b:any)=>a+(b?.delta||0),0) : 0;
    const readingsCount = Array.isArray(s.readings) ? s.readings.length : 0;
    const journalCount = Array.isArray(s.journal) ? s.journal.length : 0;
    const email = s.email || s.userEmail || s.user?.email || 'unknown';
    return {
      idx: i+1,
      email,
      track: s.track || 'Unknown',
      team: s.team || 'NoTeam',
      totalPoints,
      readingsCount,
      journalCount,
      generatedAt: s.generatedAt || new Date().toISOString(),
      lang: s.device?.lang || '',
    };
  });
}

function toCSV(rows: any[]) {
  if(!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v:any) => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('\n') || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const lines = [headers.join(',')];
  rows.forEach(r => lines.push(headers.map(h=>esc(r[h])).join(',')));
  return lines.join('\n');
}

export default function WildPraxisExport(){
  const [files, setFiles] = useState<File[]>([]);
  const [sessions, setSessions] = useState<SessionPayload[]>([]);
  const [csv, setCsv] = useState<string>('');
  const [track, setTrack] = useState<string>('Brookies');
  const [statusG, setStatusG] = useState<string>('');
  const [statusM, setStatusM] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const rows = useMemo(()=> toRows(sessions), [sessions]);

  const as2d = () => {
    if(!rows.length) return [] as any[];
    const headers = Object.keys(rows[0]);
    const out: any[] = [headers];
    rows.forEach(r=> out.push(headers.map(h=> (r as any)[h] ?? '')));
    return out;
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const list = Array.from(e.dataTransfer.files || []);
    await ingest(list);
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    await ingest(list);
  };

  const ingest = async (list: File[]) => {
    const acc: SessionPayload[] = [...sessions];
    for(const f of list){
      if (!f.name.endsWith('.json')) continue;
      const text = await f.text();
      try {
        const obj = JSON.parse(text);
        acc.push(obj);
      } catch {}
    }
    setFiles(list);
    setSessions(acc);
  };

  const generate = () => {
    const r = toRows(sessions);
    const out = toCSV(r);
    setCsv(out);
  };

  const saveLocal = () => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `wildpraxis-export-${track}-${Date.now()}.csv`;
    a.click();
  };

  const pushGoogle = async () => {
    setStatusG('Uploading CSV to Google Drive...');
    try{
      const res = await fetch('/api/export/admin/google-csv', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ csv, track })
      });
      const out = await res.json();
      if(res.ok && out.ok){ setStatusG(`✅ Uploaded: ${out.name}`); }
      else{ setStatusG(`❌ Error: ${out.error || 'unknown'}`); }
    }catch(e:any){ setStatusG(`❌ Error: ${e.message}`); }
  };

  const pushOneDrive = async () => {
    setStatusM('Uploading CSV to OneDrive...');
    try{
      const res = await fetch('/api/export/admin/onedrive-csv', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ csv, track })
      });
      const out = await res.json();
      if(res.ok && out.ok){ setStatusM(`✅ Uploaded: ${out.name}`); }
      else{ setStatusM(`❌ Error: ${out.error || 'unknown'}`); }
    }catch(e:any){ setStatusM(`❌ Error: ${e.message}`); }
  };

  const appendGoogleSheet = async () => {
    try{
      const res = await fetch('/api/export/admin/google-sheets', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ rows: as2d() })
      });
      const out = await res.json();
      alert(res.ok ? '✅ Appended to Google Sheet' : '❌ Error: ' + (out.error || 'unknown'));
    }catch(e:any){ alert('❌ Error: ' + e.message); }
  };

  const appendOneDriveExcel = async () => {
    try{
      const res = await fetch('/api/export/admin/onedrive-excel', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ rows: as2d() })
      });
      const out = await res.json();
      alert(res.ok ? '✅ Appended to OneDrive Excel table' : '❌ Error: ' + (out.error || 'unknown'));
    }catch(e:any){ alert('❌ Error: ' + e.message); }
  };

  const clearData = () => {
    if (confirm('Clear all loaded data?')) {
      setFiles([]);
      setSessions([]);
      setCsv('');
      setStatusG('');
      setStatusM('');
    }
  };

  return (
    <section className="section">
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)',
        padding: '3rem 2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '0.5rem', 
          fontWeight: 800,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)' 
        }}>
          📊 WildPraxis Export
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.95, maxWidth: '700px', margin: '0 auto' }}>
          Batch process student session data and export to CSV, Google Drive, OneDrive, and Excel
        </p>
      </div>

      {/* Track Selector */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
          🎯 Select Track
        </label>
        <select 
          value={track} 
          onChange={e=>setTrack(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '2px solid #2E7D32',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="Bucktails">🦌 Bucktails</option>
          <option value="Bass">🐟 Bass</option>
          <option value="Brookies">🎣 Brookies</option>
          <option value="Gobblers">🦃 Gobblers</option>
          <option value="Ursids">🐻 Ursids</option>
        </select>
      </div>

      {/* File Upload Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Drop Zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e)=>{e.preventDefault(); setIsDragging(true);}}
          onDragLeave={()=>setIsDragging(false)}
          style={{
            background: isDragging ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' : 'white',
            border: isDragging ? '3px dashed #2E7D32' : '3px dashed #ccc',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isDragging ? '0 8px 24px rgba(46,125,50,0.2)' : '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
          <h3 style={{ marginBottom: '1rem', color: '#2E7D32' }}>Drop JSON Files Here</h3>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Drag and drop student session JSON files
          </p>
          <label style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: '#2E7D32',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.3s ease'
          }}>
            📂 Browse Files
            <input 
              type="file" 
              multiple 
              accept="application/json" 
              onChange={onPick}
              style={{ display: 'none' }}
            />
          </label>
          {files.length > 0 && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#E8F5E9', borderRadius: '8px' }}>
              <p style={{ fontWeight: 600, color: '#2E7D32' }}>
                ✅ {files.length} file{files.length !== 1 ? 's' : ''} loaded
              </p>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                {sessions.length} session{sessions.length !== 1 ? 's' : ''} ready to export
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div style={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>📈 Export Statistics</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{sessions.length}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Sessions</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{rows.length}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Processed Rows</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{track}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Selected Track</div>
            </div>
          </div>
          <button
            onClick={clearData}
            disabled={sessions.length === 0}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '0.75rem',
              background: sessions.length === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.25)',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 600,
              cursor: sessions.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🗑️ Clear All Data
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>⚡ Actions</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <button
            onClick={generate}
            disabled={sessions.length === 0}
            style={{
              padding: '1rem',
              background: sessions.length === 0 ? '#ccc' : '#2E7D32',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: sessions.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
          >
            📝 Generate CSV
          </button>
          <button
            onClick={saveLocal}
            disabled={!csv}
            style={{
              padding: '1rem',
              background: !csv ? '#ccc' : '#1976D2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: !csv ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
          >
            💾 Download CSV
          </button>
          <button
            onClick={pushGoogle}
            disabled={!csv}
            style={{
              padding: '1rem',
              background: !csv ? '#ccc' : '#EA4335',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: !csv ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
          >
            📤 Google Drive
          </button>
          <button
            onClick={pushOneDrive}
            disabled={!csv}
            style={{
              padding: '1rem',
              background: !csv ? '#ccc' : '#0078D4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: !csv ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
          >
            📤 OneDrive
          </button>
          <button
            onClick={appendGoogleSheet}
            disabled={rows.length === 0}
            style={{
              padding: '1rem',
              background: rows.length === 0 ? '#ccc' : '#34A853',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: rows.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
          >
            📊 Google Sheets
          </button>
          <button
            onClick={appendOneDriveExcel}
            disabled={rows.length === 0}
            style={{
              padding: '1rem',
              background: rows.length === 0 ? '#ccc' : '#217346',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: rows.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
          >
            📊 Excel Online
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {(statusG || statusM) && (
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ marginBottom: '1rem' }}>📢 Upload Status</h4>
          {statusG && (
            <div style={{ padding: '0.75rem', background: '#E8F5E9', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <strong>Google Drive:</strong> {statusG}
            </div>
          )}
          {statusM && (
            <div style={{ padding: '0.75rem', background: '#E3F2FD', borderRadius: '8px' }}>
              <strong>OneDrive:</strong> {statusM}
            </div>
          )}
        </div>
      )}

      {/* Data Preview */}
      {rows.length > 0 && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>👀 Data Preview</h3>
          <div style={{ overflowX: 'auto', maxHeight: '400px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#2E7D32', color: 'white' }}>
                <tr>
                  {rows[0] && Object.keys(rows[0]).map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                    {Object.keys(rows[0] || {}).map(h => (
                      <td key={h} style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                        {String((r as any)[h])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Debug (Collapsible) */}
      {csv && (
        <details style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
            🔧 CSV Raw Data (Click to expand)
          </summary>
          <textarea
            style={{
              width: '100%',
              minHeight: '200px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#f8f9fa'
            }}
            value={csv}
            onChange={e => setCsv(e.target.value)}
          />
        </details>
      )}

      {/* Help Section */}
      <div style={{
        background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
        padding: '2rem',
        borderRadius: '12px',
        marginTop: '2rem',
        border: '2px solid #1976D2'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#1565C0' }}>💡 How to Use</h3>
        <ol style={{ lineHeight: '2', color: '#333', marginLeft: '1.5rem' }}>
          <li><strong>Select Track:</strong> Choose the student track (Bucktails, Bass, Brookies, Gobblers, or Ursids)</li>
          <li><strong>Upload Files:</strong> Drag & drop or browse to select multiple student session JSON files</li>
          <li><strong>Generate CSV:</strong> Click &quot;Generate CSV&quot; to process the data</li>
          <li><strong>Export:</strong> Download locally or push directly to Google Drive, OneDrive, Google Sheets, or Excel</li>
          <li><strong>Share with Katie:</strong> All exports are ready to share with WLA program coordinators</li>
        </ol>
      </div>
    </section>
  );
}

