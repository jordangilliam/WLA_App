
import React from 'react';

type QuizQ = {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
  explain?: string;
};

export type Lesson = {
  id: string;
  track: string;
  title: string;
  minutes: number;
  body: string;
  quiz?: QuizQ[];
  resources?: {label:string, url:string}[];
  standards?: string[];
};

export function awardPoints(delta: number, reason: string){
  try{
    const raw = localStorage.getItem('wla-points') || '[]';
    const arr = JSON.parse(raw);
    arr.push({ ts: Date.now(), delta, reason });
    localStorage.setItem('wla-points', JSON.stringify(arr));
  }catch{}
}

function mdToHtml(md: string){
  let html = md
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((https?:[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html.split('\n\n').map(p => p.match(/^<h[1-3]>/) ? p : `<p>${p}</p>`).join('\n');
  return html;
}

export function LessonView({ lesson, onDone }:{lesson: Lesson, onDone: ()=>void}){
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [result, setResult] = React.useState<string>('');

  const submit = () => {
    if(!lesson.quiz || !lesson.quiz.length){ onDone(); return; }
    let correct = 0;
    for(const q of lesson.quiz){
      if (answers[q.id] === q.answer) correct++;
    }
    const pct = Math.round(100 * correct / lesson.quiz.length);
    const pts = Math.round((correct / Math.max(1, lesson.quiz.length)) * 10);
    awardPoints(pts, `Quiz: ${lesson.title}`);
    setResult(`You scored ${pct}% — +${pts} pts`);
  };

  return (
    <article className="section">
      <h1>{lesson.title}</h1>
      <p><strong>Track:</strong> {lesson.track} • <strong>~{lesson.minutes} min</strong></p>
      <div dangerouslySetInnerHTML={{ __html: mdToHtml(lesson.body) }} />
      {lesson.resources?.length ? (
        <div className="section">
          <h3>Resources</h3>
          <ul>
            {lesson.resources.map((r,i)=>(<li key={i}><a href={r.url} target="_blank" rel="noopener">{r.label}</a></li>))}
          </ul>
        </div>
      ):null}
      {lesson.standards?.length ? (
        <p className="muted">Standards: {lesson.standards.join(' • ')}</p>
      ):null}

      {lesson.quiz?.length ? (
        <div className="section">
          <h3>Check your understanding</h3>
          {lesson.quiz.map(q=>(
            <div key={q.id} style={{marginBottom:12}}>
              <p><strong>{q.prompt}</strong></p>
              {q.choices.map((c,idx)=>(
                <label key={idx} style={{display:'block', marginBottom:6}}>
                  <input type="radio" name={q.id} onChange={()=>setAnswers({...answers,[q.id]:idx})} checked={answers[q.id]===idx}/> {c}
                </label>
              ))}
              {typeof answers[q.id] !== 'undefined' && answers[q.id]===q.answer && q.explain ? <p className="muted">✓ {q.explain}</p> : null}
            </div>
          ))}
          <button onClick={submit}>Submit quiz</button>
          <p><strong>{result}</strong></p>
          <button onClick={onDone}>Next lesson</button>
        </div>
      ):(
        <div className="section">
          <button onClick={()=>{ awardPoints(5, `Completed: ${lesson.title}`); onDone(); }}>Mark complete (+5 pts)</button>
        </div>
      )}
    </article>
  );
}
