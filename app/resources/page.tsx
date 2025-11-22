'use client';

import { useEffect, useMemo, useState } from 'react';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Updates' },
  { value: 'article', label: 'Research & Articles' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'alert', label: 'Seasonal Alerts' },
  { value: 'grant', label: 'Grants & Funding' },
  { value: 'toolkit', label: 'Toolkits' },
];

type ResourceUpdate = {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  tags: string[];
  source_name: string | null;
  source_url: string | null;
  featured: boolean;
  published_at: string;
};

export default function ResourceStreamPage() {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<ResourceUpdate[]>([]);
  const [category, setCategory] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadResources() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'all') params.set('category', category);
        if (featuredOnly) params.set('featured', 'true');
        const response = await fetch(`/api/resources/feed?${params.toString()}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Failed to load resources');
        }
        const data = await response.json();
        if (isMounted) {
          setResources(data.resources || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadResources();
    return () => {
      isMounted = false;
    };
  }, [category, featuredOnly]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    resources.forEach((resource) => {
      resource.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [resources]);

  const filteredResources = useMemo(() => {
    let list = [...resources];
    if (tagFilter) {
      list = list.filter((resource) => resource.tags?.includes(tagFilter));
    }
    return list;
  }, [resources, tagFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-16">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">
            PSU Extension Signal Boost
          </p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">
            Resource Stream
          </h1>
          <p className="text-slate-600 mt-3 max-w-3xl">
            Curated Penn State Extension research briefs, workshops, seasonal alerts, and
            funding opportunities to keep WLA classrooms current.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8 grid gap-8 lg:grid-cols-[280px_auto]">
        <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-fit sticky top-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filters</h2>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {CATEGORY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCategory(option.value)}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition ${
                      category === option.value
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.length === 0 ? (
                  <p className="text-sm text-slate-400">Tags populate once resources load.</p>
                ) : (
                  tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
                      className={`px-3 py-1 rounded-full text-xs border transition ${
                        tagFilter === tag
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Show featured only</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                />
                <span className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 relative transition">
                  <span
                    className={`absolute top-[3px] left-[3px] bg-white w-5 h-5 rounded-full transition ${
                      featuredOnly ? 'translate-x-5' : ''
                    }`}
                  />
                </span>
              </label>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
              <p className="mt-4 text-slate-500">Fetching recent resource updates…</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900 mb-2">
                No updates match those filters.
              </p>
              <p className="text-slate-500">Try another category or clear the tag filter.</p>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <article
                key={resource.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-slate-100 text-slate-800">
                      {resource.category}
                    </span>
                    {resource.featured && (
                      <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                        ⭐ Featured
                      </span>
                    )}
                    <span className="text-xs text-slate-400 ml-auto">
                      {new Date(resource.published_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-slate-900">
                    {resource.title}
                  </h3>
                  {resource.summary && (
                    <p className="text-slate-600 text-sm leading-relaxed">{resource.summary}</p>
                  )}

                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    {resource.source_name && (
                      <span className="text-xs text-slate-500 uppercase tracking-wide">
                        {resource.source_name}
                      </span>
                    )}
                    {resource.source_url && (
                      <a
                        href={resource.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View source
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}



