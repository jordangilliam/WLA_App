'use client';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

(mapboxgl as any).accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type Reading = { id: string; lat: number; lon: number; waterTempC?: number; ph?: number; flowCfs?: number; notes?: string; };

export default function MapPage(){
  const ref = useRef<HTMLDivElement|null>(null);
  const mapRef = useRef<mapboxgl.Map|null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(()=>{
    // Load saved readings
    try { const raw = localStorage.getItem('wla-map-readings'); if(raw) setReadings(JSON.parse(raw)); } catch {}
  },[]);

  useEffect(()=>{
    try { localStorage.setItem('wla-map-readings', JSON.stringify(readings)); } catch {}
  },[readings]);
  const [form, setForm] = useState<Partial<Reading>>({});

  useEffect(()=>{
    if(ref.current && !mapRef.current){
      mapRef.current = new mapboxgl.Map({ container: ref.current, style: 'mapbox://styles/mapbox/outdoors-v12', center: [-79.9959, 40.4406], zoom: 8 });
    }
    return ()=>{ mapRef.current?.remove(); mapRef.current = null; }
  },[]);

  useEffect(()=>{
    const map = mapRef.current;
    if(!map) return;
    (map as any)._wlaMarkers?.forEach((m: mapboxgl.Marker)=>m.remove());
    const markers: mapboxgl.Marker[] = [];
    readings.forEach(r=>{
      const el = document.createElement('div');
      el.style.width='10px'; el.style.height='10px'; el.style.borderRadius='50%'; el.style.background='var(--wla-blue)';
      const marker = new mapboxgl.Marker({ element: el }).setLngLat([r.lon, r.lat]).addTo(map);
      markers.push(marker);
    });
    (map as any)._wlaMarkers = markers;
  },[readings]);

  const addReading = () => {
    if(form.lat==null || form.lon==null) return alert('Enter lat/lon');
    const r: Reading = { id: crypto.randomUUID(), lat: Number(form.lat), lon: Number(form.lon), waterTempC: form.waterTempC ? Number(form.waterTempC) : undefined, ph: form.ph ? Number(form.ph) : undefined, flowCfs: form.flowCfs ? Number(form.flowCfs) : undefined, notes: form.notes || '' };
    setReadings(arr => [...arr, r]);
  };

  return (
    <section className="section">
      <h1>Watershed Monitors</h1>
      <div className="row">
        <div className="card section" style={{flex:'1 1 360px'}}>
          <h3>New Reading</h3>
          <div className="row">
            <input placeholder="Lat" onChange={e=>setForm({...form,lat:e.target.valueAsNumber})} type="number" step="any"/>
            <input placeholder="Lon" onChange={e=>setForm({...form,lon:e.target.valueAsNumber})} type="number" step="any"/>
          </div>
          <div className="row">
            <input placeholder="Water Temp (°C)" onChange={e=>setForm({...form,waterTempC:e.target.valueAsNumber})} type="number" step="any"/>
            <input placeholder="pH" onChange={e=>setForm({...form,ph:e.target.valueAsNumber})} type="number" step="any"/>
            <input placeholder="Flow (cfs)" onChange={e=>setForm({...form,flowCfs:e.target.valueAsNumber})} type="number" step="any"/>
          </div>
          <textarea placeholder="Notes" onChange={e=>setForm({...form,notes:e.target.value})} />
          <button onClick={addReading}>Add</button>
          <a className="btn" href="/exports">Export</a>
        </div>
        <div className="card section" style={{flex:'2 1 520px'}}>
          <div ref={ref} style={{width:'100%', height:'420px', borderRadius:'12px', overflow:'hidden'}}/>
        </div>
      </div>
    </section>
  );
}
