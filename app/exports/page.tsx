'use client';
import { useState } from 'react';

export default function ExportPage(){
  const [json, setJson] = useState('{"example":"session"}');
  const [track, setTrack] = useState('Brookies');
  const [team, setTeam] = useState('');
  const [status, setStatus] = useState<string>('');
  const [statusOD, setStatusOD] = useState<string>('');

  const saveLocal = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'wla-session-export.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const pushGoogle = async () => {
    setStatus('Uploading to Google Drive...');
    try{
      const res = await fetch('/api/storage/google/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: JSON.parse(json), track, team })
      });
      const out = await res.json();
      if(res.ok && out.ok){ setStatus(`Uploaded: ${out.name}`); }
      else{ setStatus(`Error: ${out.error || 'unknown'}`); }
    }catch(e:any){ setStatus(`Error: ${e.message}`); }
  };

  const generate = () => {
    try{
      const points = JSON.parse(localStorage.getItem('wla-points') || '[]');
      const readings = JSON.parse(localStorage.getItem('wla-map-readings') || '[]');
      const journal = JSON.parse(localStorage.getItem('wla-journal-entries') || '[]');
      const payload = {
        generatedAt: new Date().toISOString(),
        track, team,
        device: { ua: navigator.userAgent, lang: navigator.language },
        points, readings, journal
      };
      setJson(JSON.stringify(payload, null, 2));
      setStatus('Generated from local state.');
    }catch(e:any){
      setStatus(`Generate error: ${e.message}`);
    }
  };

  const pushOneDrive = async () => {
    setStatusOD('Uploading to OneDrive...');
    try{
      const res = await fetch('/api/storage/onedrive/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: JSON.parse(json), track, team })
      });
      const out = await res.json();
      if(res.ok && out.ok){ setStatusOD(`Uploaded: ${out.name}`); }
      else{ setStatusOD(`Error: ${out.error || 'unknown'}`); }
    }catch(e:any){ setStatusOD(`Error: ${e.message}`); }
  };

  return (
    <section className="section">
      <h1>Export</h1>
      <p>Export to your device or to Google Drive. Sign in on the Auth page to enable Drive.</p>
      <div className="row">
        <div className="card section">
          <label>Track
            <select value={track} onChange={e=>setTrack(e.target.value)}>
              <option>Bucktails</option><option>Bass</option><option>Brookies</option><option>Gobblers</option><option>Ursids</option>
            </select>
          </label>
          <label>Team Name
            <input value={team} onChange={e=>setTeam(e.target.value)} placeholder="e.g., Brookies Blue"/>
          </label>
        </div>
        <div className="card section" style={{flex:'2 1 520px'}}>
          <h3>Session JSON</h3>
          <textarea style={{width:'100%', minHeight: 220}} value={json} onChange={e=>setJson(e.target.value)} />
        </div>
      </div>
      <div className="row">
        <button onClick={generate}>Generate session JSON</button>
        <button onClick={saveLocal}>Save to device</button>
        <button onClick={pushGoogle}>Push to Google Drive</button>
        <button onClick={pushOneDrive}>Push to OneDrive</button>
        <a className="btn" href="/api/storage/dropbox/export">Dropbox (stub)</a>
      </div>
      <p><strong>Google:</strong> {status || '—'}</p>
      <p><strong>OneDrive:</strong> {statusOD || '—'}</p>
    </section>
  );
}
