/**
 * QR Code Scanner Component
 * S.E.C.R.E.T.-style QR code scanning for mission clues
 * 
 * Uses browser QR scanning APIs (MediaDevices) or falls back to manual entry
 */

'use client'

import { useState, useRef, useEffect } from 'react'

interface QRCodeScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
  onClose?: () => void
  missionId?: string
  locationId?: string
}

export default function QRCodeScanner({
  onScan,
  onError,
  onClose,
  missionId,
  locationId,
}: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [scanning, setScanning] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showManualEntry, setShowManualEntry] = useState(false)

  // Try to start camera scanning
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setScanning(true)
        setError(null)
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      setError('Camera access required for QR scanning. Please enable camera permissions.')
      setShowManualEntry(true)
    }
  }

  // Stop scanning
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }

  // Manual code submission
  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim())
    }
  }

  // QR code detection (simplified - in production, use a library like jsQR)
  useEffect(() => {
    if (!scanning || !videoRef.current) return

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const scanInterval = setInterval(() => {
      if (!videoRef.current || !context) return

      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)

      // In production, use jsQR library here:
      // const code = jsQR(imageData.data, imageData.width, imageData.height)
      // if (code) {
      //   onScan(code.data)
      //   stopScanning()
      // }
    }, 500)

    return () => clearInterval(scanInterval)
  }, [scanning, onScan])

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Scan QR Code</h3>
          {onClose && (
            <button
              onClick={() => {
                stopScanning()
                onClose()
              }}
              className="text-slate-500 hover:text-slate-700"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Camera View */}
        {scanning && (
          <div className="relative mb-4 rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 border-4 border-purple-500 rounded-lg pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500" />
            </div>
          </div>
        )}

        {/* Manual Entry */}
        {showManualEntry && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Enter Code Manually
            </label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter QR code or clue code"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleManualSubmit()
                }
              }}
            />
            <button
              onClick={handleManualSubmit}
              className="mt-2 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium"
            >
              Submit Code
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {!scanning && !showManualEntry && (
            <>
              <button
                onClick={startScanning}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium"
              >
                📷 Start Camera Scan
              </button>
              <button
                onClick={() => setShowManualEntry(true)}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg hover:bg-slate-200 font-medium"
              >
                ⌨️ Enter Manually
              </button>
            </>
          )}
          {scanning && (
            <button
              onClick={stopScanning}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium"
            >
              Stop Scanning
            </button>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500 text-center">
          Point your camera at the QR code or enter the code manually
        </p>
      </div>
    </div>
  )
}


