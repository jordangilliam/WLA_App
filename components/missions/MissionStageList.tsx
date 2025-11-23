import React from 'react'

type StageStatus = 'pending' | 'in_progress' | 'completed'

type Stage = {
  id: string
  title: string
  summary: string | null
  learning_objective?: string | null
  target_metric?: string | null
  target_value?: number | null
  order_index: number
  status?: StageStatus
}

interface MissionStageListProps {
  stages: Stage[]
  onStatusChange?: (
    stageId: string,
    nextStatus: StageStatus
  ) => Promise<void> | void
  updatingStageId?: string | null
}

const STATUS_LABELS: Record<StageStatus, string> = {
  pending: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const STATUS_STYLES: Record<StageStatus, string> = {
  pending: 'border-slate-200 text-slate-500 bg-slate-50',
  in_progress: 'border-amber-200 text-amber-700 bg-amber-50',
  completed: 'border-emerald-200 text-emerald-700 bg-emerald-50',
}

export default function MissionStageList({
  stages,
  onStatusChange,
  updatingStageId,
}: MissionStageListProps) {
  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-purple-500 tracking-wide">
                Stage {stage.order_index + 1}
              </p>
              <h4 className="text-lg font-semibold text-slate-900 mt-0.5">
                {stage.title}
              </h4>
            </div>
            <span
              className={`px-3 py-1 rounded-full border text-xs font-semibold ${STATUS_STYLES[stage.status || 'pending']}`}
            >
              {STATUS_LABELS[stage.status || 'pending']}
            </span>
          </div>

          {stage.summary && (
            <p className="text-sm text-slate-600 mt-3">{stage.summary}</p>
          )}

          {stage.learning_objective && (
            <div className="mt-3 text-sm bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-indigo-900">
              <p className="font-semibold">Learning Objective</p>
              <p>{stage.learning_objective}</p>
            </div>
          )}

          {(stage.target_metric || stage.target_value) && (
            <div className="mt-3 text-xs text-slate-500">
              Target: {stage.target_value ?? '?'} {stage.target_metric ?? ''}
            </div>
          )}

          {onStatusChange && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                type="button"
                disabled={updatingStageId === stage.id}
                onClick={() => onStatusChange(stage.id, 'in_progress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  stage.status === 'in_progress'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                {stage.status === 'in_progress' ? 'Stage Active' : 'Mark In Progress'}
              </button>
              <button
                type="button"
                disabled={updatingStageId === stage.id}
                onClick={() => onStatusChange(stage.id, 'completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  stage.status === 'completed'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {stage.status === 'completed' ? 'Stage Completed' : 'Mark Completed'}
              </button>
              {stage.status !== 'pending' && (
                <button
                  type="button"
                  disabled={updatingStageId === stage.id}
                  onClick={() => onStatusChange(stage.id, 'pending')}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Reset Stage
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}




