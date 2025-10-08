'use client';
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
    
    // Trigger storage event for PointsProvider
    window.dispatchEvent(new Event('storage'));
  }catch{}
}

function mdToHtml(md: string){
  let html = md
    .replace(/^### (.*)$/gm, '<h3 class="lesson-h3">$1</h3>')
    .replace(/^## (.*)$/gm, '<h2 class="lesson-h2">$1</h2>')
    .replace(/^# (.*)$/gm, '<h1 class="lesson-h1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\[(.+?)\]\((https?:[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="lesson-link">$1</a>');
  
  html = html.split('\n\n').map(p => p.match(/^<h[1-3]/) ? p : `<p class="lesson-p">${p}</p>`).join('\n');
  return html;
}

export function LessonView({ lesson, onDone }:{lesson: Lesson, onDone: ()=>void}){
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [result, setResult] = React.useState<string>('');
  const [showResult, setShowResult] = React.useState(false);

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
    setShowResult(true);
  };

  const trackColors: Record<string, string> = {
    'Brookies': '#0077B6',
    'Bass': '#06D6A0',
    'Bucktails': '#8B4513',
    'Gobblers': '#9D4EDD',
    'Ursids': '#2C1810',
    'All': '#023047'
  };

  return (
    <article className="section" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        background: trackColors[lesson.track] || '#023047',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
          <strong>Track:</strong> {lesson.track}
        </div>
        <h1 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{lesson.title}</h1>
        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          ⏱️ Estimated time: {lesson.minutes} minutes
        </div>
      </div>

      <div className="lesson-content" dangerouslySetInnerHTML={{ __html: mdToHtml(lesson.body) }} />

      {lesson.resources?.length ? (
        <div className="section" style={{ background: '#F8F9FA', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>📚 Resources</h3>
          <ul style={{ lineHeight: 2 }}>
            {lesson.resources.map((r,i)=>(
              <li key={i}>
                <a href={r.url} target="_blank" rel="noopener" className="lesson-link">{r.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ):null}

      {lesson.standards?.length ? (
        <div style={{ 
          background: '#FFF8E7', 
          padding: '1rem 1.5rem', 
          borderRadius: '8px',
          borderLeft: '4px solid #FFB703',
          fontSize: '0.9rem',
          marginTop: '1.5rem'
        }}>
          <strong>📋 Academic Standards:</strong><br/>
          {lesson.standards.join(' • ')}
        </div>
      ):null}

      {lesson.quiz?.length ? (
        <div className="section" style={{ background: 'white', border: '2px solid #E9ECEF', borderRadius: '12px', padding: '2rem', marginTop: '2rem' }}>
          <h3 style={{ marginTop: 0, color: '#023047' }}>✅ Check Your Understanding</h3>
          {lesson.quiz.map(q=>(
            <div key={q.id} style={{
              marginBottom: '1.5rem',
              padding: '1.5rem',
              background: '#F8F9FA',
              borderRadius: '8px'
            }}>
              <p style={{ fontWeight: 600, marginBottom: '1rem', color: '#023047' }}>{q.prompt}</p>
              {q.choices.map((c,idx)=>(
                <label key={idx} style={{
                  display:'block',
                  marginBottom:'0.75rem',
                  padding: '0.75rem 1rem',
                  background: answers[q.id]===idx ? '#E3F2FD' : 'white',
                  borderRadius: '6px',
                  border: `2px solid ${answers[q.id]===idx ? '#0077B6' : '#DEE2E6'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <input 
                    type="radio" 
                    name={q.id} 
                    onChange={()=>setAnswers({...answers,[q.id]:idx})} 
                    checked={answers[q.id]===idx}
                    style={{ marginRight: '0.75rem' }}
                  /> 
                  {c}
                </label>
              ))}
              {showResult && answers[q.id]===q.answer && q.explain ? (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#D1FAE5',
                  borderRadius: '6px',
                  color: '#065F46',
                  fontSize: '0.95rem'
                }}>
                  ✓ {q.explain}
                </div>
              ) : null}
            </div>
          ))}
          
          {!showResult ? (
            <button 
              onClick={submit}
              disabled={Object.keys(answers).length < lesson.quiz.length}
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                background: Object.keys(answers).length < lesson.quiz.length ? '#CCC' : 'linear-gradient(135deg, #0077B6, #023047)',
                color: 'white',
                border: 'none',
                cursor: Object.keys(answers).length < lesson.quiz.length ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => {
                if(Object.keys(answers).length >= lesson.quiz.length) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Submit Quiz
            </button>
          ) : (
            <div>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #06D6A0, #0077B6)',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1rem'
              }}>
                {result}
              </div>
              <button 
                onClick={onDone}
                style={{
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #FFB703, #FB8500)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Continue to Next Lesson →
              </button>
            </div>
          )}
        </div>
      ):(
        <div className="section" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={()=>{ awardPoints(5, `Completed: ${lesson.title}`); onDone(); }}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #06D6A0, #0077B6)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Mark Complete (+5 pts) ✓
          </button>
        </div>
      )}

      <style jsx>{`
        .lesson-content {
          font-size: 1.05rem;
          line-height: 1.8;
        }
        :global(.lesson-h2) {
          color: #023047;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.75rem;
        }
        :global(.lesson-h3) {
          color: #0077B6;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }
        :global(.lesson-p) {
          margin-bottom: 1rem;
        }
        :global(.inline-code) {
          background: #F8F9FA;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        :global(.lesson-link) {
          color: #0077B6;
          text-decoration: underline;
          font-weight: 500;
        }
        :global(.lesson-link:hover) {
          color: #023047;
        }
      `}</style>
    </article>
  );
}

