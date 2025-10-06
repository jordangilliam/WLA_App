'use client';
import { useState } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';

type Module = {
  id: string;
  title: string;
  icon: string;
  description: string;
  points: number;
  category: string;
  completed?: boolean;
};

const LEARNING_MODULES: Module[] = [
  { id: 'pa-history', title: 'PA Conservation History', icon: '📜', description: 'Learn about Pennsylvania\'s rich conservation heritage and wildlife recovery stories', points: 15, category: 'History' },
  { id: 'watershed', title: 'Watershed Science', icon: '💧', description: 'Understand stream ecology, water quality, and aquatic ecosystems', points: 20, category: 'Science' },
  { id: 'wildlife-id', title: 'Wildlife Identification', icon: '🦌', description: 'Master PA wildlife species, habitats, and behaviors', points: 15, category: 'Biology' },
  { id: 'native-traditions', title: 'Native American Traditions', icon: '🪶', description: 'Explore indigenous conservation wisdom and land stewardship', points: 15, category: 'Culture' },
  { id: 'habitat-restoration', title: 'Habitat Restoration', icon: '🌲', description: 'Learn techniques for restoring forests, wetlands, and streams', points: 20, category: 'Conservation' },
  { id: 'policy', title: 'Conservation Policy', icon: '⚖️', description: 'Understand wildlife laws, regulations, and advocacy', points: 15, category: 'Policy' },
  { id: 'climate-impact', title: 'Climate & Wildlife', icon: '🌡️', description: 'Explore climate change impacts on PA ecosystems', points: 20, category: 'Science' },
  { id: 'tracking', title: 'Wildlife Tracking', icon: '🐾', description: 'Master animal track and sign identification', points: 10, category: 'Skills' },
  { id: 'reintroduction', title: 'Species Reintroduction', icon: '🦅', description: 'Success stories: elk, river otter, peregrine falcon, and more', points: 15, category: 'Conservation' },
];

export default function Learn() {
  const { award } = usePoints();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(LEARNING_MODULES.map(m => m.category)))];
  const filteredModules = selectedCategory === 'All' 
    ? LEARNING_MODULES 
    : LEARNING_MODULES.filter(m => m.category === selectedCategory);

  const completeModule = (moduleId: string, points: number) => {
    if (!completed.has(moduleId)) {
      setCompleted(new Set(completed).add(moduleId));
      award(points, `learn-${moduleId}`);
    }
  };

  const totalPoints = LEARNING_MODULES.reduce((sum, m) => sum + m.points, 0);
  const earnedPoints = Array.from(completed).reduce((sum, id) => {
    const module = LEARNING_MODULES.find(m => m.id === id);
    return sum + (module?.points || 0);
  }, 0);
  const progress = (earnedPoints / totalPoints) * 100;

  return (
    <>
      <section className="section bg-green animate-slide-up" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'white' }}>📚 Learning Center</h1>
        <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          Master conservation science, wildlife biology, and PA natural history. Complete modules to earn points and badges!
        </p>
      </section>

      {/* Progress Tracker */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #023047, #0077B6)', color: 'white' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <div style={{ flex: '2' }}>
            <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Your Learning Progress</h2>
            <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.2)', height: '16px', marginBottom: '0.5rem' }}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #06D6A0, #FFB703)' }}></div>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>
              {completed.size} of {LEARNING_MODULES.length} modules completed • {earnedPoints}/{totalPoints} points
            </p>
          </div>
          <div style={{ fontSize: '4rem', textAlign: 'center' }}>
            {Math.round(progress)}%
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section">
        <h3>Filter by Category</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'btn-purple' : 'btn-outline'}
              style={{ fontSize: '0.9rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Learning Modules */}
      <div className="row">
        {filteredModules.map(module => {
          const isCompleted = completed.has(module.id);
          return (
            <div key={module.id} className="card section animate-slide-up" style={{
              opacity: isCompleted ? 0.7 : 1,
              borderLeft: isCompleted ? '4px solid var(--wla-green)' : '4px solid transparent'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
                {module.icon}
              </div>
              <div style={{ 
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: '#F8F9FA',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '0.75rem'
              }}>
                {module.category}
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>{module.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flexGrow: 1 }}>
                {module.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--wla-orange)' }}>
                  +{module.points} points
                </div>
                {isCompleted ? (
                  <div className="badge badge-green" style={{ fontSize: '0.9rem' }}>
                    ✓ Completed
                  </div>
                ) : (
                  <button 
                    onClick={() => completeModule(module.id, module.points)}
                    className="btn-success"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resources Section */}
      <section className="section" style={{ background: '#F8F9FA' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📖 Additional Resources</h2>
        <div className="row">
          <div className="card section">
            <h3>🎓 External Learning</h3>
            <ul style={{ lineHeight: 2 }}>
              <li><a href="https://www.pgc.pa.gov/Education/Pages/default.aspx" target="_blank" rel="noopener noreferrer">PA Game Commission Education</a></li>
              <li><a href="https://www.fishandboat.com/Education/Pages/default.aspx" target="_blank" rel="noopener noreferrer">PA Fish & Boat Commission</a></li>
              <li><a href="https://www.dcnr.pa.gov/Education/Pages/default.aspx" target="_blank" rel="noopener noreferrer">DCNR Environmental Education</a></li>
            </ul>
          </div>
          <div className="card section">
            <h3>📺 Video Tutorials</h3>
            <ul style={{ lineHeight: 2 }}>
              <li>Stream Sampling Techniques</li>
              <li>Macro-Invertebrate Identification</li>
              <li>Wildlife Camera Setup</li>
              <li>Habitat Assessment Protocols</li>
            </ul>
          </div>
          <div className="card section">
            <h3>📝 Quizzes & Assessments</h3>
            <p>Test your knowledge with interactive quizzes (coming soon):</p>
            <ul style={{ lineHeight: 2 }}>
              <li>PA Wildlife Quiz</li>
              <li>Water Quality Assessment</li>
              <li>Conservation Policy Test</li>
              <li>Field Skills Challenge</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}