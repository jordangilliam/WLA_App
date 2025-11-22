import React from 'react'
import Image from 'next/image'

type MissionStage = {
  id: string
  order_index: number
  title: string
  summary: string | null
}

type Mission = {
  id: string
  title: string
  synopsis: string | null
  storyline_id: string | null
  hero_image_url: string | null
  difficulty: string | null
  story_mission_stages?: MissionStage[]
}

interface MissionCardProps {
  mission: Mission
  active?: boolean
  progressPercent?: number
  onSelect: (missionId: string) => void
}

export default function MissionCard({
  mission,
  active = false,
  progressPercent = 0,
  onSelect,
}: MissionCardProps) {
  const stageCount = mission.story_mission_stages?.length ?? 0
  const synopsis =
    mission.synopsis && mission.synopsis.length > 160
      ? `${mission.synopsis.slice(0, 160)}…`
      : mission.synopsis

  return (
    <button
      type="button"
      onClick={() => onSelect(mission.id)}
      className={`w-full text-left rounded-2xl border overflow-hidden transition ${
        active
          ? 'border-purple-500 shadow-lg shadow-purple-100 bg-white'
          : 'border-slate-200 hover:border-purple-300 bg-white'
      }`}
    >
      {/* Hero Image */}
      {mission.hero_image_url && (
        <div className="relative h-32 w-full">
          <Image
            src={mission.hero_image_url}
            alt={mission.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            {mission.storyline_id || 'Mission'}
          </div>
        </div>
      )}

      <div className={`flex items-start gap-3 ${mission.hero_image_url ? 'p-5' : 'px-5 py-4'}`}>
        <div className="flex-1">
          {!mission.hero_image_url && (
            <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
              {mission.storyline_id || 'Mission Arc'}
            </p>
          )}
          <h3 className="text-lg font-semibold text-slate-900 mt-1">{mission.title}</h3>
          {synopsis && <p className="text-sm text-slate-600 mt-2">{synopsis}</p>}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-3">
            <span>
              {stageCount} stage{stageCount === 1 ? '' : 's'}
            </span>
            {mission.difficulty && <span>Difficulty: {mission.difficulty}</span>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="#E2E8F0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="#8B5CF6"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${339.292}`}
                strokeDashoffset={`${339.292 - (progressPercent / 100) * 339.292}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <span className="text-xs text-slate-500">Progress</span>
        </div>
      </div>
    </button>
  )
}


