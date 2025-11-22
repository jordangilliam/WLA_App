'use client';

import { useMemo, useState } from 'react';

type ReflectionPrompts = {
  conditions?: string;
  habitat?: string;
  phenology?: string;
  action?: string;
  feelings?: string;
};

const PROMPT_FIELDS: Array<{
  key: keyof ReflectionPrompts;
  label: string;
  placeholder: string;
}> = [
  {
    key: 'conditions',
    label: 'Weather & Conditions',
    placeholder: 'Describe today’s weather, sky, wind, or water conditions.',
  },
  {
    key: 'habitat',
    label: 'Habitat Snapshot',
    placeholder: 'What habitat elements (plants, soil, water, sound) stood out?',
  },
  {
    key: 'phenology',
    label: 'Phenology Highlights',
    placeholder: 'Record seasonal clues (buds, migration, insect activity).',
  },
  {
    key: 'action',
    label: 'Conservation Action Idea',
    placeholder: 'Brainstorm a next step for stewardship at this site.',
  },
  {
    key: 'feelings',
    label: 'Feelings or Gratitude',
    placeholder: 'How did this experience make you feel or what are you grateful for?',
  },
];

const MOOD_OPTIONS = ['Curious', 'Calm', 'Energized', 'Tired', 'Proud', 'Focused'];

const TAG_SUGGESTIONS = [
  'Pollinators',
  'Water Quality',
  'Forest',
  'Stream',
  'Birding',
  'Macroinvertebrates',
  'Night Study',
  'Weather Watch',
  'Phenology',
  'Action Idea',
];

interface ReflectionPromptsCardProps {
  observationId: string;
  prompts?: ReflectionPrompts;
  mood?: string;
  tags?: string[];
  onSave?: (
    id: string,
    payload: { reflection_prompts: ReflectionPrompts; mood?: string; tags?: string[] }
  ) => Promise<void>;
}

export default function ReflectionPromptsCard({
  observationId,
  prompts,
  mood,
  tags,
  onSave,
}: ReflectionPromptsCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formPrompts, setFormPrompts] = useState<ReflectionPrompts>(prompts || {});
  const [formMood, setFormMood] = useState(mood || '');
  const [formTags, setFormTags] = useState<string[]>(tags || []);
  const [newTag, setNewTag] = useState('');

  const hasContent = useMemo(() => {
    return (
      (prompts && Object.values(prompts).some((value) => (value || '').trim().length > 0)) ||
      (tags && tags.length > 0) ||
      !!mood
    );
  }, [prompts, tags, mood]);

  const handlePromptChange = (key: keyof ReflectionPrompts, value: string) => {
    setFormPrompts((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTagAdd = () => {
    const trimmed = newTag.trim();
    if (!trimmed || formTags.includes(trimmed)) return;
    setFormTags((prev) => [...prev, trimmed]);
    setNewTag('');
  };

  const handleTagRemove = (tag: string) => {
    setFormTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(observationId, {
        reflection_prompts: formPrompts,
        mood: formMood,
        tags: formTags,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormPrompts(prompts || {});
    setFormMood(mood || '');
    setFormTags(tags || []);
    setNewTag('');
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            🌿 Reflection Prompts
          </h4>
          <p className="text-xs text-gray-500">
            Capture weather, habitat, phenology, actions, and feelings for deeper journaling.
          </p>
        </div>
        {onSave && (
          <button
            onClick={() => setEditing((prev) => !prev)}
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            {editing ? 'Close' : hasContent ? 'Edit' : 'Add'}
          </button>
        )}
      </div>

      {!editing ? (
        hasContent ? (
          <div className="p-4 space-y-4 text-sm text-gray-700">
            {mood && (
              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide mb-1">Mood</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">
                  {mood}
                </span>
              </div>
            )}
            {tags && tags.length > 0 && (
              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide mb-1">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {PROMPT_FIELDS.map((field) => {
              const value = prompts?.[field.key];
              if (!value) return null;
              return (
                <div key={field.key}>
                  <p className="text-xs uppercase text-gray-500 tracking-wide mb-1">
                    {field.label}
                  </p>
                  <p className="whitespace-pre-wrap">{value}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-500">
            No reflections recorded yet. Tap “Add” to capture quick prompts after each field visit.
          </div>
        )
      ) : (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Mood Check-In
            </label>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setFormMood(option)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    formMood === option
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
                >
                  #{tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="text-blue-500 hover:text-blue-700"
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTagAdd();
                  }
                }}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="px-3 py-2 text-sm bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
              {TAG_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    if (!formTags.includes(suggestion)) {
                      setFormTags((prev) => [...prev, suggestion]);
                    }
                  }}
                  className="px-2 py-1 rounded-full border border-gray-200 hover:border-gray-300"
                >
                  #{suggestion}
                </button>
              ))}
            </div>
          </div>

          {PROMPT_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {field.label}
              </label>
              <textarea
                value={formPrompts[field.key] || ''}
                onChange={(e) => handlePromptChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          ))}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Reflections'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



