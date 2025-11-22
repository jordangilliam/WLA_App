/**
 * Clue Reveal Component
 * S.E.C.R.E.T.-style progressive clue revelation
 * 
 * Shows clues one at a time as users complete location requirements
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import QRCodeScanner from './QRCodeScanner'
import AROverlay from './AROverlay'

interface Clue {
  id: string
  text: string
  imageUrl?: string
  qrCode?: string
  arMarker?: string
  unlockCondition: {
    type: 'location_reached' | 'stage_completed' | 'qr_scanned' | 'photo_taken'
    value?: string
  }
  revealOrder: number
}

interface ClueRevealProps {
  clues: Clue[]
  missionId: string
  currentStage: number
  completedLocations: string[]
  onClueUnlocked?: (clueId: string) => void
}

export default function ClueReveal({
  clues,
  missionId,
  currentStage,
  completedLocations,
  onClueUnlocked,
}: ClueRevealProps) {
  const [unlockedClues, setUnlockedClues] = useState<Set<string>>(new Set())
  const [showScanner, setShowScanner] = useState(false)
  const [showAR, setShowAR] = useState(false)
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null)

  // Check which clues should be unlocked
  useEffect(() => {
    const newlyUnlocked: string[] = []

    clues.forEach((clue) => {
      if (unlockedClues.has(clue.id)) return

      let shouldUnlock = false

      switch (clue.unlockCondition.type) {
        case 'location_reached':
          shouldUnlock = completedLocations.includes(clue.unlockCondition.value || clue.id)
          break
        case 'stage_completed':
          shouldUnlock = currentStage >= (parseInt(clue.unlockCondition.value || '0'))
          break
        case 'qr_scanned':
          // Check if location was visited with QR scan action
          shouldUnlock = completedLocations.includes(clue.id)
          break
        case 'photo_taken':
          // Check if location was visited with photo action
          shouldUnlock = completedLocations.includes(clue.id)
          break
      }

      if (shouldUnlock) {
        newlyUnlocked.push(clue.id)
      }
    })

    if (newlyUnlocked.length > 0) {
      setUnlockedClues((prev) => {
        const updated = new Set(prev)
        newlyUnlocked.forEach((id) => updated.add(id))
        return updated
      })
      newlyUnlocked.forEach((id) => onClueUnlocked?.(id))
    }
  }, [clues, currentStage, completedLocations, unlockedClues, onClueUnlocked])

  const sortedClues = [...clues].sort((a, b) => a.revealOrder - b.revealOrder)
  const visibleClues = sortedClues.filter((clue) => unlockedClues.has(clue.id))
  const lockedClues = sortedClues.filter((clue) => !unlockedClues.has(clue.id))

  return (
    <div className="space-y-4">
      {/* Unlocked Clues */}
      {visibleClues.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-purple-600 mb-3">
            🔓 Clues Revealed
          </h4>
          <div className="space-y-3">
            {visibleClues.map((clue) => (
              <div
                key={clue.id}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-4">
                  {clue.imageUrl && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={clue.imageUrl}
                        alt="Clue"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 mb-1">
                      Clue #{clue.revealOrder}
                    </p>
                    <p className="text-sm text-slate-700">{clue.text}</p>
                    <div className="flex gap-2 mt-3">
                      {clue.qrCode && (
                        <button
                          onClick={() => {
                            setSelectedClue(clue)
                            setShowScanner(true)
                          }}
                          className="text-xs bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
                        >
                          📷 Scan QR
                        </button>
                      )}
                      {clue.arMarker && (
                        <button
                          onClick={() => {
                            setSelectedClue(clue)
                            setShowAR(true)
                          }}
                          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                        >
                          🔍 AR View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Clues */}
      {lockedClues.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">
            🔒 Locked Clues
          </h4>
          <div className="space-y-2">
            {lockedClues.map((clue) => (
              <div
                key={clue.id}
                className="bg-slate-100 border-2 border-slate-200 rounded-xl p-4 opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-300 flex items-center justify-center">
                    🔒
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-500">
                      Clue #{clue.revealOrder} - Locked
                    </p>
                    <p className="text-xs text-slate-400">
                      {clue.unlockCondition.type === 'location_reached' && 'Visit the location to unlock'}
                      {clue.unlockCondition.type === 'stage_completed' && `Complete stage ${clue.unlockCondition.value} to unlock`}
                      {clue.unlockCondition.type === 'qr_scanned' && 'Scan QR code to unlock'}
                      {clue.unlockCondition.type === 'photo_taken' && 'Take a photo to unlock'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScanner && selectedClue && (
        <QRCodeScanner
          onScan={(data) => {
            // Verify QR code matches
            if (data === selectedClue.qrCode) {
              setUnlockedClues((prev) => new Set(prev).add(selectedClue.id))
              onClueUnlocked?.(selectedClue.id)
            }
            setShowScanner(false)
            setSelectedClue(null)
          }}
          onClose={() => {
            setShowScanner(false)
            setSelectedClue(null)
          }}
          missionId={missionId}
        />
      )}

      {/* AR Overlay Modal */}
      {showAR && selectedClue && (
        <AROverlay
          markerUrl={selectedClue.arMarker}
          clueText={selectedClue.text}
          clueImage={selectedClue.imageUrl}
          onClose={() => {
            setShowAR(false)
            setSelectedClue(null)
          }}
          missionId={missionId}
        />
      )}
    </div>
  )
}

