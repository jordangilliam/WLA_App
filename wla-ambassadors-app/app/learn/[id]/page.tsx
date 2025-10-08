
import React from 'react';
import lessons from '../_catalog';
import { LessonView } from '../_Lesson';
import Link from 'next/link';

export default function LessonPage({ params }:{ params: { id: string } }){
  const lesson = lessons.find(l=> l.id === params.id);
  const idx = lessons.findIndex(l=> l?.id === params.id);
  const nextId = (idx>=0 && idx < lessons.length-1) ? lessons[idx+1].id : null;
  if(!lesson) return (<section className="section"><p>Lesson not found.</p><Link href="/learn">Back</Link></section>);
  return (<LessonView lesson={lesson} onDone={()=>{ if(nextId) window.location.href = `/learn/${nextId}`; else window.location.href = '/learn'; }} />);
}
