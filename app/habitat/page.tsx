'use client';
import { useState } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
export default function Habitat(){
  const [species, setSpecies] = useState('Brook Trout');
  const [score, setScore] = useState(0);
  const { award } = usePoints();
  const simulate = () => { setScore(s => s + 10); award(10, 'habitat-sim'); };
  return (
    <section className="section">
      <h1>Habitat Builder</h1>
      <p>Pick a species and set water quality, cover, flow, and temperature to design a suitable habitat. Earn points for valid combos.</p>
      <select value={species} onChange={e=>setSpecies(e.target.value)}>
        <option>Brook Trout</option><option>Largemouth Bass</option><option>Smallmouth Bass</option><option>Channel Catfish</option>
      </select>
      <div className="row">
        <div className="card section">
          <h3>Parameters (stub)</h3>
          <label>Water Temp (°C) <input type="number" /></label>
          <label>pH <input type="number" /></label>
          <label>Cover (%) <input type="number" /></label>
          <button onClick={simulate}>Simulate</button>
        </div>
        <div className="card section">
          <h3>Result</h3>
          <p>Score: {score}</p>
        </div>
      </div>
    </section>
  );
}
