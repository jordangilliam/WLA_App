'use client';
import { useState } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
export default function Journal(){
  const { award } = usePoints();
  const [entries, setEntries] = useState<{ text: string; photo?: string }[]>([]);

  // Load saved entries
  React.useEffect(()=>{
    try{ const raw = localStorage.getItem('wla-journal-entries'); if(raw) setEntries(JSON.parse(raw)); }catch{}
  },[]);

  React.useEffect(()=>{
    try{ localStorage.setItem('wla-journal-entries', JSON.stringify(entries)); }catch{}
  },[entries]);
  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if(!f) return;
    const url = URL.createObjectURL(f);
    setEntries(arr => [...arr, { text: '', photo: url }]); award(5, 'photo-upload');
  };
  const addText = () => { setEntries(arr => [...arr, { text: 'New note', photo: undefined }]); award(2, 'journal-entry'); };
  return (
    <section className="section">
      <h1>Journal & Gallery</h1>
      <div className="row">
        <div className="card section">
          <input type="file" accept="image/*" onChange={onPhoto} />
          <button onClick={addText}>Add journal note</button>
        </div>
        <div className="card section" style={{flex:'2 1 520px'}}>
          <h3>Your Entries</h3>
          {entries.map((e,i)=>(
            <div key={i} className="section" style={{marginBottom:'.6rem'}}>
              {e.photo && <img src={e.photo} alt="upload" style={{maxWidth:'100%', borderRadius:'8px'}}/>}
              <p>{e.text || '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
