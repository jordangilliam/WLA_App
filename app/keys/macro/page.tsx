'use client';
import { useState } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
type Step = { q: string; a: string; points?: number };
const steps: Step[] = [
  { q: 'Does it have a shell?', a: 'yes → go to 2 / no → go to 3' },
  { q: 'Shell spiraled?', a: 'yes: snail (Gastropoda) / no: clam (Bivalvia)', points: 5 },
  { q: 'Has 6 legs?', a: 'yes → go to 4 / no → go to 5' },
  { q: 'Single tail?', a: 'yes: mayfly nymph (Ephemeroptera) / no → go to 6', points: 5 },
  { q: '8 legs?', a: 'yes: water mite (Acari) / no: amphipod/isopod', points: 5 },
  { q: '3 tails + gills on abdomen?', a: 'yes: stonefly (Plecoptera) / no: caddisfly/dragonfly etc.', points: 5 }
];
export default function MacroKey(){
  const [i, setI] = useState(0);
  const { award } = usePoints();
  const next = () => { const s = steps[i]; if(s.points){ award(s.points, 'macro-key-correct'); } setI((i+1)%steps.length); };
  return (
    <section className="section">
      <h1>Macro-Invertebrate Key</h1>
      <p>Practice ID, earn points, and link out to PocketMacros for official logging.</p>
      <p><a className="btn" href="https://www.pocketmacros.com" target="_blank">Open PocketMacros</a></p>
      <div className="card section">
        <h3>Step {i+1}</h3>
        <p><strong>{steps[i].q}</strong></p>
        <p>{steps[i].a}</p>
        <button onClick={next}>Next</button>
      </div>
    </section>
  );
}
