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
  // Allow unknown extra fields
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

export default function KatieExport(){
  const [files, setFiles] = useState<File[]>([]);
  const [sessions, setSessions] = useState<SessionPayload[]>([]);
  const [csv, setCsv] = useState<string>('');
  const [track, setTrack] = useState<string>('Brookies');
  const [statusG, setStatusG] = useState<string>('');
  const [statusM, setStatusM] = useState<string>('');

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
    a.download = `katie-export-${track}-${Date.now()}.csv`;
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
      if(res.ok && out.ok){ setStatusG(`Uploaded: ${out.name}`); }
      else{ setStatusG(`Error: ${out.error || 'unknown'}`); }
    }catch(e:any){ setStatusG(`Error: ${e.message}`); }
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
      if(res.ok && out.ok){ setStatusM(`Uploaded: ${out.name}`); }
      else{ setStatusM(`Error: ${out.error || 'unknown'}`); }
    }catch(e:any){ setStatusM(`Error: ${e.message}`); }
  };

  const appendGoogleSheet = async () => {
    try{
      const res = await fetch('/api/export/admin/google-sheets', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ rows: as2d() })
      });
      const out = await res.json();
      alert(res.ok ? 'Appended to Google Sheet' : 'Error: ' + (out.error || 'unknown'));
    }catch(e:any){ alert('Error: ' + e.message); }
  };

  const appendOneDriveExcel = async () => {
    try{
      const res = await fetch('/api/export/admin/onedrive-excel', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ rows: as2d() })
      });
      const out = await res.json();
      alert(res.ok ? 'Appended to OneDrive Excel table' : 'Error: ' + (out.error || 'unknown'));
    }catch(e:any){ alert('Error: ' + e.message); }
  };

  return (
    <section className="section">
      <h1>Katie Export — Batch CSV</h1>
      <p>Drag in multiple student session JSON files, review, generate CSV, and push to Google Drive and OneDrive admin folders.</p>
      <label>Track
        <select value={track} onChange={e=>setTrack(e.target.value)}>
          <option>Bucktails</option><option>Bass</option><option>Brookies</option><option>Gobblers</option><option>Ursids</option>
        </select>
      </label>
      <div className="row">
        <div className="card section" style={{flex:'1 1 360px'}} onDrop={onDrop} onDragOver={(e)=>e.preventDefault()}>
          <h3>Drop JSON files here</h3>
          <input type="file" multiple accept="application/json" onChange={onPick}/>
          <p>{files.length} files loaded</p>
          <button onClick={generate}>Generate CSV</button>
        </div>
        <div className="card section" style={{flex:'2 1 520px'}}>
          <h3>Preview</h3>
          <div style={{overflowX:'auto'}}>
            <table>
              <thead>
                <tr>{rows[0] && Object.keys(rows[0]).map(h=><th key={h} style={{textAlign:'left', padding:'4px 8px'}}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r,i)=>(
                  <tr key={i}>{Object.keys(rows[0]||{}).map(h=><td key={h} style={{padding:'4px 8px'}}>{String((r as any)[h])}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="row">
        <button onClick={saveLocal} disabled={!csv}>Save CSV locally</button>
        <button onClick={pushGoogle} disabled={!csv}>Push CSV to Google Drive</button>
        <button onClick={pushOneDrive} disabled={!csv}>Push CSV to OneDrive</button>
        <button onClick={appendGoogleSheet} disabled={!rows.length}>Append to Google Sheet</button>
        <button onClick={appendOneDriveExcel} disabled={!rows.length}>Append to OneDrive Table</button>
      </div>
      <p><strong>Google:</strong> {statusG || '—'}</p>
      <p><strong>OneDrive:</strong> {statusM || '—'}</p>
      <div className="section">
        <h3>CSV (debug)</h3>
        <textarea style={{width:'100%', minHeight: 160}} value={csv} onChange={e=>setCsv(e.target.value)} />
      </div>
    </section>
  );
}
