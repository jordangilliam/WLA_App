'use client';

import { useState } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import Image from 'next/image';

export default function GamesPage() {
  const { award } = usePoints();
  const [activeTab, setActiveTab] = useState<'trout-tower' | 'coming-soon'>('trout-tower');

  return (
    <section className="section">
      <div style={{
        background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
        padding: '3rem 2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          🎮 WLA Games
        </h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', opacity: 0.95 }}>
          Learn through play! Test your skills with conservation-themed games
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setActiveTab('trout-tower')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'trout-tower' ? '#0077B6' : 'white',
            color: activeTab === 'trout-tower' ? 'white' : '#333',
            border: activeTab === 'trout-tower' ? 'none' : '2px solid #0077B6',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          🐟 Trout Tower
        </button>
        <button
          onClick={() => setActiveTab('coming-soon')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'coming-soon' ? '#0077B6' : 'white',
            color: activeTab === 'coming-soon' ? 'white' : '#333',
            border: activeTab === 'coming-soon' ? 'none' : '2px solid #0077B6',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          🎯 Coming Soon
        </button>
      </div>

      {/* Trout Tower */}
      {activeTab === 'trout-tower' && (
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🐟 Trout Tower</h2>
            <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
              Jump from platform to platform and climb as high as you can in this addictive endless tower climbing game!
            </p>
          </div>

          {/* Game Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ padding: '1.5rem', background: '#f0f9ff', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎮</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Classic Gameplay</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>
                Inspired by the legendary Icy Tower, climb endlessly and beat your high score
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f0fff4', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎨</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Enhanced Graphics</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>
                Beautiful OpenGL-powered graphics with smooth animations
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: '#fff5f7', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎵</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Immersive Audio</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>
                Engaging music and sound effects enhance the experience
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: '#fffbeb', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
              <h3 style={{ marginBottom: '0.5rem' }}>High Scores</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>
                Track your performance and compete for the top spot
              </p>
            </div>
          </div>

          {/* Screenshots */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>📸 Screenshots</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                <img src="/TroutTower/screenshots/Screenshot1.png" alt="Trout Tower Menu" style={{ width: '100%', display: 'block' }} />
                <div style={{ padding: '1rem', background: '#f9fafb', textAlign: 'center', fontWeight: 600 }}>
                  Main Menu
                </div>
              </div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                <img src="/TroutTower/screenshots/Screenshot2.png" alt="Trout Tower Gameplay" style={{ width: '100%', display: 'block' }} />
                <div style={{ padding: '1rem', background: '#f9fafb', textAlign: 'center', fontWeight: 600 }}>
                  In-Game Action
                </div>
              </div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                <img src="/TroutTower/screenshots/Screenshot3.png" alt="Trout Tower Jumping" style={{ width: '100%', display: 'block' }} />
                <div style={{ padding: '1rem', background: '#f9fafb', textAlign: 'center', fontWeight: 600 }}>
                  Platform Jumping
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ padding: '2rem', background: '#f0f9ff', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🕹️ Controls</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>⬅️➡️</div>
                <div>
                  <strong>Arrow Keys</strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Move left or right</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>⎵</div>
                <div>
                  <strong>Spacebar</strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Jump</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>P</div>
                <div>
                  <strong>P Key</strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Pause game</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>↩️</div>
                <div>
                  <strong>Enter</strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Select menu option</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Play */}
          <div style={{ padding: '2rem', background: '#fff9e6', borderRadius: '12px', marginBottom: '2rem', border: '2px solid #fbbf24' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎯 How to Play</h3>
            <ol style={{ lineHeight: '2', fontSize: '1.05rem', marginLeft: '1.5rem' }}>
              <li><strong>Jump Up</strong> - Guide your character from platform to platform</li>
              <li><strong>Build Speed</strong> - The faster you move, the higher you can jump</li>
              <li><strong>Perform Combos</strong> - Hit multiple platforms in quick succession for bonus points</li>
              <li><strong>Stay Alert</strong> - Don&apos;t fall! The tower scrolls as you climb</li>
              <li><strong>Beat Your Record</strong> - Try to reach new heights with each playthrough</li>
            </ol>
          </div>

          {/* Download Section */}
          <div style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀 Download & Play</h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
              Trout Tower is a desktop game. Download it to your computer to start playing!
            </p>

            {/* System Requirements */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(10px)',
              padding: '1.5rem', 
              borderRadius: '8px', 
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <h4 style={{ marginBottom: '1rem' }}>💻 System Requirements</h4>
              <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                <li><strong>Operating System:</strong> Windows 10/11</li>
                <li><strong>Java:</strong> JDK 8 or higher (included in download)</li>
                <li><strong>Memory:</strong> 512 MB RAM minimum</li>
                <li><strong>Graphics:</strong> OpenGL compatible graphics card</li>
              </ul>
            </div>

            {/* Download Options */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="/TroutTower/TroutTower.zip"
                download
                style={{
                  padding: '1rem 2rem',
                  background: 'white',
                  color: '#0077B6',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                📥 Download for Windows
              </a>
              <a
                href="https://github.com/jordangilliam/trouttower"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '1rem 2rem',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              >
                🐙 View on GitHub
              </a>
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
              Note: You may need to extract the ZIP file and run the included launcher
            </p>
          </div>

          {/* Installation Instructions */}
          <div style={{ marginTop: '2rem', padding: '2rem', background: '#f9fafb', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📦 Installation Instructions</h3>
            <ol style={{ lineHeight: '2', fontSize: '1.05rem', marginLeft: '1.5rem' }}>
              <li>Download the game ZIP file using the button above</li>
              <li>Extract the ZIP file to a folder on your computer</li>
              <li>Open the extracted folder and find <code style={{ background: '#e5e7eb', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>run.bat</code></li>
              <li>Double-click <code style={{ background: '#e5e7eb', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>run.bat</code> to start the game</li>
              <li>Enjoy climbing Trout Tower!</li>
            </ol>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                <strong>⚠️ Troubleshooting:</strong> If the game doesn&apos;t start, make sure you have Java installed. 
                You can download Java from <a href="https://www.java.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0077B6', fontWeight: 600 }}>java.com</a>
              </p>
            </div>
          </div>

          {/* Coming to Web */}
          <div style={{ marginTop: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🌐 Coming to Web!</h3>
            <p style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
              We&apos;re working on a browser-based version of Trout Tower so you can play directly 
              in your web browser without downloading anything. Stay tuned!
            </p>
          </div>
        </div>
      )}

      {/* Coming Soon */}
      {activeTab === 'coming-soon' && (
        <div className="card">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>🎯 More Games Coming Soon!</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', background: '#f0f9ff', borderRadius: '12px', textAlign: 'center', opacity: 0.7 }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐠</div>
              <h3>Species ID Challenge</h3>
              <p style={{ color: '#666' }}>Test your knowledge identifying Pennsylvania fish, birds, and wildlife</p>
              <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '1rem' }}>Coming Soon</p>
            </div>

            <div style={{ padding: '2rem', background: '#f0fff4', borderRadius: '12px', textAlign: 'center', opacity: 0.7 }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎣</div>
              <h3>Fishing Simulator</h3>
              <p style={{ color: '#666' }}>Experience realistic fishing in PA watersheds with different techniques and species</p>
              <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '1rem' }}>In Development</p>
            </div>

            <div style={{ padding: '2rem', background: '#fff5f7', borderRadius: '12px', textAlign: 'center', opacity: 0.7 }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌲</div>
              <h3>Habitat Builder</h3>
              <p style={{ color: '#666' }}>Create optimal wildlife habitats and learn about ecosystem management</p>
              <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '1rem' }}>Planned</p>
            </div>

            <div style={{ padding: '2rem', background: '#fffbeb', borderRadius: '12px', textAlign: 'center', opacity: 0.7 }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🦌</div>
              <h3>Wildlife Tracker</h3>
              <p style={{ color: '#666' }}>Follow animal tracks and signs to discover and document wildlife</p>
              <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '1rem' }}>Planned</p>
            </div>
          </div>

          <div style={{ marginTop: '3rem', padding: '2rem', background: '#f9fafb', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>💡 Have Game Ideas?</h3>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem' }}>
              We&apos;d love to hear your suggestions for conservation-themed games!
            </p>
            <p style={{ fontSize: '0.95rem', color: '#999' }}>
              Contact your WLA instructor or email us with your ideas
            </p>
          </div>
        </div>
      )}
    </section>
  );
}



