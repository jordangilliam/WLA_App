
'use client';
import React from 'react';
import Link from 'next/link';
import lessons from './_catalog';

export default function LearnHome(){
  const tracks = Array.from(new Set(lessons.map(l=>l.track)));
  const grouped: Record<string, any[]> = {};
  tracks.forEach(t => grouped[t] = lessons.filter(l=>l.track===t));

  return (
    <section className="section">
      <h1>Learn</h1>
      <p>Pick a track. Complete lessons, take quizzes, and earn points that count toward your team.</p>
      {tracks.map(t=> (
        <div className="section" key={t}>
          <h2>{t}</h2>
          <ul>
            {grouped[t].map(l=> (<li key={l.id}><Link href={`/learn/${l.id}`}>{l.title}</Link> — ~{l.minutes} min</li>))}
          </ul>
        </div>
      ))}
    </section>
  );
}
