'use client';

import { useEffect, useState } from 'react';

type PlannerForm = {
  locationType: string;
  region: string;
  sunExposure: 'full' | 'partial' | 'shade';
  soilMoisture: 'dry' | 'medium' | 'wet';
  availableArea: number;
  maintenanceLevel: 'low' | 'medium' | 'high';
  bloomFocus: 'spring' | 'summer' | 'fall' | 'extended';
};

type PlannerResponse = {
  summary: string;
  bloomCalendar: Array<{ season: string; highlights: string[] }>;
  plantingTips: string[];
  plantPalette: Array<{
    commonName: string;
    latinName: string;
    bloomSeason: string;
    sun: string;
    moisture: string;
    height: string;
    wildlifeValue: string;
    notes: string;
  }>;
  stewardshipTasks: string[];
};

type SavedPlan = {
  id: string;
  created_at: string;
  location_type: string;
  recommendations: PlannerResponse;
};

const defaultForm: PlannerForm = {
  locationType: 'School courtyard containers',
  region: 'Central PA',
  sunExposure: 'full',
  soilMoisture: 'medium',
  availableArea: 120,
  maintenanceLevel: 'medium',
  bloomFocus: 'extended',
};

export default function PollinatorPlannerPage() {
  const [form, setForm] = useState<PlannerForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<PlannerResponse | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadPlans() {
      try {
        const response = await fetch('/api/pollinators/plans', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load saved plans');
        const data = await response.json();
        if (mounted) setSavedPlans(data.plans || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadPlans();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/pollinators/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationType: form.locationType,
          region: form.region,
          sunExposure: form.sunExposure,
          soilMoisture: form.soilMoisture,
          availableArea: Number(form.availableArea),
          maintenanceLevel: form.maintenanceLevel,
          bloomFocus: form.bloomFocus,
        }),
      });

      if (!response.ok) {
        const details = await response.json();
        throw new Error(details?.error || 'Unable to generate plan');
      }

      const data = await response.json();
      setResult(data.plan.recommendations);
      setSavedPlans((prev) => [data.plan, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-50 pb-16">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
            Action Studio
          </p>
          <h1 className="text-4xl font-bold text-slate-900 mt-1">
            Pollinator Plan Builder
          </h1>
          <p className="text-slate-600 mt-3">
            Design a four-season native planting palette with keystone plants, stewardship
            tasks, and bloom calendar recommendations aligned with Penn State Extension guidance.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10 grid gap-8 lg:grid-cols-[360px_auto]">
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-fit sticky top-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Site Snapshot
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-700">Location Type</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                rows={2}
                value={form.locationType}
                onChange={(e) => setForm((prev) => ({ ...prev, locationType: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Region</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                value={form.region}
                onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['full', 'partial', 'shade'] as const).map((sun) => (
                <button
                  key={sun}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, sunExposure: sun }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                    form.sunExposure === sun
                      ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {sun === 'full' ? 'Full Sun' : sun === 'partial' ? 'Part Sun' : 'Shade'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['dry', 'medium', 'wet'] as const).map((moisture) => (
                <button
                  key={moisture}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, soilMoisture: moisture }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                    form.soilMoisture === moisture
                      ? 'bg-blue-50 border-blue-300 text-blue-800'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {moisture === 'dry'
                    ? 'Dry'
                    : moisture === 'medium'
                    ? 'Mesic'
                    : 'Moist'}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Area (sq ft)
              </label>
              <input
                type="number"
                min={5}
                max={5000}
                value={form.availableArea}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, availableArea: Number(e.target.value) }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, maintenanceLevel: level }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                    form.maintenanceLevel === level
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Bloom Focus</label>
              <select
                value={form.bloomFocus}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    bloomFocus: e.target.value as PlannerForm['bloomFocus'],
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              >
                <option value="extended">Extended Season</option>
                <option value="spring">Spring Boost</option>
                <option value="summer">Summer Showcase</option>
                <option value="fall">Fall Monarch Corridor</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow hover:from-green-600 hover:to-green-700 disabled:opacity-50"
            >
              {saving ? 'Generating Plan…' : 'Generate Plan'}
            </button>
          </form>
        </section>

        <section className="space-y-6">
          {result ? (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-3">Plan Summary</h2>
                <p className="text-slate-700 leading-relaxed">{result.summary}</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Plant Palette ({result.plantPalette.length} species)
                </h3>
                <div className="space-y-4">
                  {result.plantPalette.map((plant) => (
                    <div
                      key={plant.commonName}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className="text-lg font-semibold text-slate-900">
                            {plant.commonName}
                          </p>
                          <p className="text-sm italic text-slate-500">{plant.latinName}</p>
                        </div>
                        <div className="text-xs flex gap-2 text-slate-500">
                          <span>Bloom: {plant.bloomSeason}</span>
                          <span>Sun: {plant.sun}</span>
                          <span>Moisture: {plant.moisture}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">{plant.notes}</p>
                      <p className="text-sm font-medium text-emerald-700 mt-1">
                        Wildlife Value: {plant.wildlifeValue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Bloom Calendar</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {result.bloomCalendar.map((entry) => (
                    <div
                      key={entry.season}
                      className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4"
                    >
                      <p className="text-sm font-semibold uppercase text-amber-700">
                        {entry.season}
                      </p>
                      <ul className="text-sm text-amber-900 mt-2 space-y-1">
                        {entry.highlights.length === 0 ? (
                          <li>No specific plants targeted.</li>
                        ) : (
                          entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Stewardship Tasks</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  {result.stewardshipTasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Planting Tips</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  {result.plantingTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
              <p>Submit site details to receive a regional pollinator plan.</p>
            </div>
          )}

          {savedPlans.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Recent Plans</h3>
              <div className="space-y-3">
                {savedPlans.slice(0, 5).map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {plan.location_type}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(plan.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      onClick={() =>
                        setResult(plan.recommendations as unknown as PlannerResponse)
                      }
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}



