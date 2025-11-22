'use client';

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-5xl font-bold mb-4 text-gradient">
            WLA Design System
          </h1>
          <p className="text-xl text-neutral-600">
            Built with your brand identity: WLA, String Theory Solutions, and WildPraxis
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Buttons</h2>
          <div className="card p-8">
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className="btn-accent">Accent Button</button>
              <button className="btn-ghost">Ghost Button</button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="btn-primary btn-sm">Small Button</button>
              <button className="btn-secondary">Regular Button</button>
              <button className="btn-accent btn-lg">Large Button</button>
            </div>
            <div className="mt-4">
              <button className="btn-primary" disabled>Disabled Button</button>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-hover">
              <div className="card-header">
                <h3 className="text-xl font-bold">Basic Card</h3>
              </div>
              <div className="card-body">
                <p className="text-neutral-600">
                  This card has a hover effect with lift animation.
                </p>
              </div>
            </div>

            <div className="card-interactive">
              <div className="card-header">
                <h3 className="text-xl font-bold">Interactive Card</h3>
              </div>
              <div className="card-body">
                <p className="text-neutral-600">
                  Click me! I have press feedback.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-bold">Static Card</h3>
              </div>
              <div className="card-body">
                <p className="text-neutral-600">
                  No hover effects on this one.
                </p>
              </div>
              <div className="card-footer">
                <button className="btn-primary btn-sm w-full">Action</button>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Badges & Tags</h2>
          <div className="card p-8">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="badge-blue">Blue Badge</span>
              <span className="badge-orange">Orange Badge</span>
              <span className="badge-gold">Gold Badge</span>
              <span className="badge-success">Success Badge</span>
            </div>
            <div className="flex gap-6">
              <div className="achievement-badge">
                <span className="text-2xl">🐟</span>
              </div>
              <div className="achievement-badge">
                <span className="text-2xl">🦅</span>
              </div>
              <div className="achievement-badge">
                <span className="text-2xl">🦌</span>
              </div>
            </div>
            <p className="text-sm text-neutral-500 mt-4">
              Hover over achievement badges to see the glow effect!
            </p>
          </div>
        </section>

        {/* Progress Bars Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Progress Bars</h2>
          <div className="card p-8 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Species Identified</span>
                <span className="text-neutral-600">75%</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Missions Completed</span>
                <span className="text-neutral-600">50%</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Field Hours</span>
                <span className="text-neutral-600">90%</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Species Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Species Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="species-card">
              <div className="species-card-image bg-gradient-to-br from-cyan-400 to-cyan-600"></div>
              <div className="species-card-overlay">
                <h3 className="species-card-title">Brook Trout</h3>
                <p className="species-card-subtitle">Salvelinus fontinalis</p>
              </div>
            </div>

            <div className="species-card">
              <div className="species-card-image bg-gradient-to-br from-orange-400 to-orange-600"></div>
              <div className="species-card-overlay">
                <h3 className="species-card-title">Wild Turkey</h3>
                <p className="species-card-subtitle">Meleagris gallopavo</p>
              </div>
            </div>

            <div className="species-card">
              <div className="species-card-image bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
              <div className="species-card-overlay">
                <h3 className="species-card-title">White-tailed Deer</h3>
                <p className="species-card-subtitle">Odocoileus virginianus</p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Markers Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Map Markers</h2>
          <div className="card p-8">
            <div className="flex gap-6 items-center">
              <div className="map-marker">
                <span className="text-xl">🐟</span>
              </div>
              <div className="map-marker">
                <span className="text-xl">🦅</span>
              </div>
              <div className="map-marker-active">
                <span className="text-xl">📍</span>
              </div>
            </div>
            <p className="text-sm text-neutral-500 mt-4">
              Hover over markers to see the pulse animation!
            </p>
          </div>
        </section>

        {/* Forms Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Form Elements</h2>
          <div className="card p-8 max-w-md">
            <div className="mb-4">
              <label className="label">Username</label>
              <input
                type="text"
                className="input"
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-4">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-4">
              <label className="label">Password (Error State)</label>
              <input
                type="password"
                className="input input-error"
                placeholder="••••••••"
              />
              <p className="text-red-500 text-sm mt-1">Password is too weak</p>
            </div>

            <button className="btn-primary w-full">Submit</button>
          </div>
        </section>

        {/* Loading States Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Loading States</h2>
          <div className="card p-8">
            <div className="flex items-center gap-6">
              <div className="spinner"></div>
              <div className="space-y-3 flex-1">
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Typography</h2>
          <div className="card p-8 space-y-4">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-bold">Heading 2</h2>
            <h3 className="text-2xl font-bold">Heading 3</h3>
            <h4 className="text-xl font-bold">Heading 4</h4>
            <p className="text-lg">Large paragraph text for important content.</p>
            <p className="text-base">
              Regular paragraph text for body content. This is the default text size.
            </p>
            <p className="text-sm text-neutral-600">
              Small text for secondary information or captions.
            </p>
            <p className="text-gradient text-2xl font-bold">
              Gradient text for special emphasis!
            </p>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Brand Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-6 text-center">
              <div className="w-full h-24 bg-cyan-600 rounded-lg mb-4"></div>
              <h4 className="font-bold">WLA Blue</h4>
              <p className="text-sm text-neutral-600">From the fish</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-full h-24 bg-orange-600 rounded-lg mb-4"></div>
              <h4 className="font-bold">WLA Orange</h4>
              <p className="text-sm text-neutral-600">From the bird</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-full h-24 rounded-lg mb-4" style={{ backgroundColor: 'rgb(132, 169, 140)' }}></div>
              <h4 className="font-bold">WLA Olive</h4>
              <p className="text-sm text-neutral-600">From the deer</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-full h-24 bg-amber-500 rounded-lg mb-4"></div>
              <h4 className="font-bold">String Gold</h4>
              <p className="text-sm text-neutral-600">From String Theory</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-neutral-500">
            🐟 Built by String Theory Solutions • Powered by WLA & WildPraxis 🦅
          </p>
        </div>
      </div>
    </div>
  );
}

