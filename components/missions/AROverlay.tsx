/**
 * AR Overlay Component
 * S.E.C.R.E.T.-style augmented reality overlays for mission clues
 * 
 * Shows AR markers, clues, and interactive elements when viewing locations
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface AROverlayProps {
  markerUrl?: string
  clueText?: string
  clueImage?: string
  onClose?: () => void
  missionId?: string
  locationId?: string
}

export default function AROverlay({
  markerUrl,
  clueText,
  clueImage,
  onClose,
  missionId,
  locationId,
}: AROverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [arActive, setArActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setArActive(true)
        setError(null)
      }
    } catch (err) {
      console.error('AR camera access denied:', err)
      setError('Camera access required for AR view')
    }
  }

  const stopAR = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setArActive(false)
  }

  // Draw AR overlay on canvas
  useEffect(() => {
    if (!arActive || !canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    const drawFrame = () => {
      if (!videoRef.current || !canvasRef.current) return

      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      // Draw AR marker overlay (simplified - in production use AR.js or similar)
      if (markerUrl) {
        const img = document.createElement('img')
        img.src = markerUrl
        img.onload = () => {
          const size = Math.min(canvas.width, canvas.height) * 0.3
          const x = (canvas.width - size) / 2
          const y = (canvas.height - size) / 2
          context.drawImage(img, x, y, size, size)
        }
      }

      // Draw clue text overlay
      if (clueText) {
        context.fillStyle = 'rgba(0, 0, 0, 0.7)'
        context.fillRect(0, canvas.height - 150, canvas.width, 150)
        context.fillStyle = 'white'
        context.font = '20px sans-serif'
        context.textAlign = 'center'
        context.fillText(clueText, canvas.width / 2, canvas.height - 75)
      }

      requestAnimationFrame(drawFrame)
    }

    drawFrame()
  }, [arActive, markerUrl, clueText])

  useEffect(() => {
    return () => {
      stopAR()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* AR View */}
      <div className="flex-1 relative">
        {arActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
            <div className="text-center text-white p-6">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-xl font-bold mb-2">AR Clue View</p>
              <p className="text-sm opacity-90 mb-6">
                Point your camera at the location marker to reveal clues
              </p>
              <button
                onClick={startAR}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
              >
                Start AR View
              </button>
            </div>
          </div>
        )}

        {/* Clue Image Overlay */}
        {clueImage && !arActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="relative max-w-md w-full mx-4">
              <Image
                src={clueImage}
                alt="Mission clue"
                width={400}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-600 text-white p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-3">
          {arActive && (
            <button
              onClick={stopAR}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium"
            >
              Stop AR
            </button>
          )}
          {onClose && (
            <button
              onClick={() => {
                stopAR()
                onClose()
              }}
              className="flex-1 bg-slate-600 text-white py-3 rounded-lg hover:bg-slate-700 font-medium"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Clue Text Panel */}
      {clueText && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <p className="text-lg font-semibold mb-2">🔐 Clue Revealed</p>
          <p className="text-sm opacity-90">{clueText}</p>
        </div>
      )}
    </div>
  )
}


