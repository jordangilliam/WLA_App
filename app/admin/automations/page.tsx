'use client';
import { useState } from 'react';

export default function Automations(){
  const [track, setTrack] = useState('Brookies');
  const [sessions, setSessions] = useState('[]');
  const [series, setSeries] = useState('[]');
  const [outreach, setOutreach] = useState('[]');
  const [grantName, setGrantName] = useState('Sample Grant');
  const [narrative, setNarrative] = useState('This program advances youth conservation leadership with equitable access.');
  const [timeframe, setTimeframe] = useState('FY25');
  const [summary, setSummary] = useState('Quarterly update and outcomes.');
  const [jobs, setJobs] = useState('[]');
  const [status, setStatus] = useState<string>('—');

  const post = async (url: string, body: any) => {
    setStatus(`Running ${url}...`);
    const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const out = await res.json().catch(()=>({}));
    setStatus(res.ok ? `Done ${url}` : `Error ${url}: ${out.error || res.status}`);
    console.log(out);
  };

  return (
    <section className="section">
      <h1>Admin Automations</h1>
      <p>Status: <strong>{status}</strong></p>
      <label>Track
        <select value={track} onChange={e=>setTrack(e.target.value)}>
          <option>Bucktails</option><option>Bass</option><option>Brookies</option><option>Gobblers</option><option>Ursids</option>
        </select>
      </label>

      <div className="row">
        <div className="card section">
          <h3>Daily Cohort Digest</h3>
          <textarea style={{width:'100%',minHeight:120}} value={sessions} onChange={e=>setSessions(e.target.value)} placeholder='Paste sessions JSON array'/>
          <button onClick={()=>post('/api/automations/daily-digest',{ track, sessions: JSON.parse(sessions||'[]') })}>Generate & Upload</button>
        </div>
        <div className="card section">
          <h3>Engagement Anomaly Scan</h3>
          <textarea style={{width:'100%',minHeight:120}} value={series} onChange={e=>setSeries(e.target.value)} placeholder='[{email,week,points}, ...]'/>
          <button onClick={()=>post('/api/automations/anomaly-scan',{ track, series: JSON.parse(series||'[]') })}>Run & Upload</button>
        </div>
      </div>

      <div className="row">
        <div className="card section">
          <h3>Outreach Verification Pack</h3>
          <textarea style={{width:'100%',minHeight:120}} value={outreach} onChange={e=>setOutreach(e.target.value)} placeholder='[{student,email,activity,date,hours,supervisor,notes,artifacts:[...]}, ...]'/>
          <button onClick={()=>post('/api/automations/outreach-pack',{ track, entries: JSON.parse(outreach||'[]') })}>Build Receipts</button>
        </div>
        <div className="card section">
          <h3>Grant Pack Builder</h3>
          <input value={grantName} onChange={e=>setGrantName(e.target.value)} placeholder='Grant Name'/>
          <input value={timeframe} onChange={e=>setTimeframe(e.target.value)} placeholder='Timeframe'/>
          <textarea style={{width:'100%',minHeight:80}} value={narrative} onChange={e=>setNarrative(e.target.value)} placeholder='Narrative'/>
          <textarea style={{width:'100%',minHeight:120}} value={sessions} onChange={e=>setSessions(e.target.value)} placeholder='Paste sessions JSON array'/>
          <button onClick={()=>post('/api/automations/grant-pack',{ grantName, track, timeframe, narrative, sessions: JSON.parse(sessions||'[]') })}>Assemble & Upload</button>
        </div>
      </div>

      <div className="row">
        <div className="card section">
          <h3>Board Bundle</h3>
          <textarea style={{width:'100%',minHeight:80}} value={summary} onChange={e=>setSummary(e.target.value)} placeholder='Quarterly summary.'/>
          <textarea style={{width:'100%',minHeight:120}} value={sessions} onChange={e=>setSessions(e.target.value)} placeholder='Paste sessions JSON array'/>
          <button onClick={()=>post('/api/automations/board-bundle',{ track, summary, sessions: JSON.parse(sessions||'[]') })}>Assemble & Upload</button>
        </div>
        <div className="card section">
          <h3>Data Retention Sweep (report)</h3>
          <button onClick={()=>post('/api/automations/retention',{ policyDays: 180 })}>Generate Plan</button>
        </div>
      </div>

      <div className="row">
        <div className="card section">
          <h3>Workforce Jobs Normalizer</h3>
          <textarea style={{width:'100%',minHeight:120}} value={jobs} onChange={e=>setJobs(e.target.value)} placeholder='[{title,org,location,url,skills:[...],certs:[...],deadline}, ...]'/>
          <button onClick={()=>post('/api/automations/workforce',{ track, jobs: JSON.parse(jobs||'[]') })}>Normalize & Upload</button>
        </div>
      </div>
    </section>
  );
}
