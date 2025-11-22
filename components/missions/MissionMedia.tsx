/**
 * Mission Media Component
 * 
 * Handles story-specific media (images, videos, audio) for missions.
 * Provides Carmen Sandiego-style visual storytelling and evidence collection.
 * 
 * Features:
 * - Hero images for missions
 * - Stage-specific media galleries
 * - Evidence photo uploads
 * - Media-rich mission cards
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export interface MissionMediaItem {
  id: string
  missionId: string
  stageId?: string
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  thumbnailUrl?: string
  title?: string
  description?: string
  credit?: string
  order?: number
}

interface MissionMediaProps {
  missionId: string
  stageId?: string
  heroImageUrl?: string | null
  mediaItems?: MissionMediaItem[]
  onMediaClick?: (media: MissionMediaItem) => void
  showHero?: boolean
  showGallery?: boolean
}

/**
 * Mission Hero Image Component
 */
export function MissionHeroImage({
  heroImageUrl,
  title,
  synopsis,
}: {
  heroImageUrl?: string | null
  title?: string
  synopsis?: string | null
}) {
  if (!heroImageUrl) {
    return (
      <div className="relative h-64 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <p className="text-4xl mb-2">🎯</p>
            {title && <p className="text-xl font-bold">{title}</p>}
          </div>
        </div>
        {synopsis && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="text-white text-sm">{synopsis}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border-2 border-purple-200">
      <Image
        src={heroImageUrl}
        alt={title || 'Mission hero image'}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {synopsis && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
          <p className="text-white text-sm leading-relaxed">{synopsis}</p>
        </div>
      )}
      <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
        Mission Intel
      </div>
    </div>
  )
}

/**
 * Mission Media Gallery Component
 */
export function MissionMediaGallery({
  mediaItems,
  onMediaClick,
}: {
  mediaItems: MissionMediaItem[]
  onMediaClick?: (media: MissionMediaItem) => void
}) {
  if (!mediaItems || mediaItems.length === 0) {
    return null
  }

  const sortedMedia = [...mediaItems].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      {sortedMedia.map((media) => (
        <button
          key={media.id}
          onClick={() => onMediaClick?.(media)}
          className="relative aspect-square rounded-xl overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition group"
        >
          {media.type === 'image' && (
            <>
              {media.thumbnailUrl ? (
                <Image
                  src={media.thumbnailUrl}
                  alt={media.title || 'Mission media'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              ) : (
                <Image
                  src={media.url}
                  alt={media.title || 'Mission media'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              {media.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white text-xs font-semibold truncate">{media.title}</p>
                </div>
              )}
            </>
          )}
          {media.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600">
              <div className="text-white text-3xl">▶</div>
            </div>
          )}
          {media.type === 'audio' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-600 to-rose-600">
              <div className="text-white text-3xl">🎵</div>
            </div>
          )}
          {media.type === 'document' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
              <div className="text-white text-3xl">📄</div>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

/**
 * Main Mission Media Component
 */
export default function MissionMedia({
  missionId,
  stageId,
  heroImageUrl,
  mediaItems: initialMediaItems,
  onMediaClick,
  showHero = true,
  showGallery = true,
}: MissionMediaProps) {
  const [mediaItems, setMediaItems] = useState<MissionMediaItem[]>(initialMediaItems || [])
  const [loading, setLoading] = useState(!initialMediaItems)

  useEffect(() => {
    async function fetchMedia() {
      if (initialMediaItems) {
        setMediaItems(initialMediaItems)
        return
      }

      try {
        const url = stageId
          ? `/api/story-missions/${missionId}/stages/${stageId}/media`
          : `/api/story-missions/${missionId}/media`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setMediaItems(data.media || [])
        }
      } catch (err) {
        console.error('Failed to fetch mission media:', err)
      } finally {
        setLoading(false)
      }
    }

    if (missionId) {
      fetchMedia()
    }
  }, [missionId, stageId, initialMediaItems])

  const stageMedia = stageId
    ? mediaItems.filter((m) => m.stageId === stageId)
    : mediaItems.filter((m) => !m.stageId)

  return (
    <div className="space-y-4">
      {showHero && heroImageUrl && (
        <MissionHeroImage heroImageUrl={heroImageUrl} />
      )}
      {showGallery && !loading && stageMedia.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-purple-600 mb-3">
            Mission Evidence & Intel
          </h4>
          <MissionMediaGallery mediaItems={stageMedia} onMediaClick={onMediaClick} />
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        </div>
      )}
    </div>
  )
}

/**
 * Media Modal for Full-Screen Viewing
 */
interface MediaModalProps {
  media: MissionMediaItem | null
  onClose: () => void
}

export function MissionMediaModal({ media, onClose }: MediaModalProps) {
  if (!media) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-sm"
          aria-label="Close"
        >
          ✕
        </button>

        {media.type === 'image' && (
          <div className="relative w-full aspect-video">
            <Image
              src={media.url}
              alt={media.title || 'Mission media'}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        )}

        {media.type === 'video' && (
          <div className="relative w-full aspect-video">
            <video src={media.url} controls className="w-full h-full" />
          </div>
        )}

        {(media.title || media.description || media.credit) && (
          <div className="bg-white/10 backdrop-blur-sm p-6 mt-4 rounded-xl text-white">
            {media.title && <h3 className="text-2xl font-bold mb-2">{media.title}</h3>}
            {media.description && <p className="text-white/90 mb-2">{media.description}</p>}
            {media.credit && (
              <p className="text-sm text-white/70 italic">Credit: {media.credit}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


