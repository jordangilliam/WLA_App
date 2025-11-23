/**
 * Mission Location Actions Component
 * Shows action buttons for QR scanning, AR view, check-in, etc.
 */

'use client'

import { useState } from 'react'
import QRCodeScanner from './QRCodeScanner'
import AROverlay from './AROverlay'

interface MissionLocationActionsProps {
  location: {
    id: string
    name: string
    locationType: string
    requiredAction?: string
    qrCodeData?: string
    arMarkerUrl?: string
    clueText?: string
    clueImageUrl?: string
  }
  missionId: string
  stageId?: string
  onActionComplete?: (action: string) => void
}

export default function MissionLocationActions({
  location,
  missionId,
  stageId,
  onActionComplete,
}: MissionLocationActionsProps) {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showAR, setShowAR] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)

  const handleQRScan = async (qrData: string) => {
    try {
      const response = await fetch(`/api/missions/${missionId}/scan-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeData: qrData,
          locationId: location.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Invalid QR code')
        return
      }

      const data = await response.json()
      setShowQRScanner(false)
      onActionComplete?.('qr_scan')
      
      // Show clue if available
      if (data.location?.clueText) {
        alert(`🔐 Clue Revealed: ${data.location.clueText}`)
      }
    } catch (error) {
      console.error('QR scan error:', error)
      alert('Failed to scan QR code')
    }
  }

  const handleCheckIn = async () => {
    setCheckingIn(true)
    try {
      // Get user location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const response = await fetch(`/api/missions/${missionId}/visit-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: location.id,
          action: 'check_in',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to check in')
        return
      }

      const data = await response.json()
      onActionComplete?.('check_in')
      
      if (data.location?.clueText) {
        alert(`🔐 Clue Revealed: ${data.location.clueText}`)
      }
    } catch (error) {
      console.error('Check-in error:', error)
      alert('Failed to check in. Please enable location services.')
    } finally {
      setCheckingIn(false)
    }
  }

  const needsQR = location.locationType === 'qr_code' || location.requiredAction === 'qr_scan'
  const needsAR = location.locationType === 'ar_marker' || location.requiredAction === 'ar_view'
  const needsCheckIn = location.requiredAction === 'check_in'

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {needsQR && location.qrCodeData && (
          <button
            onClick={() => setShowQRScanner(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
          >
            📷 Scan QR Code
          </button>
        )}
        
        {needsAR && location.arMarkerUrl && (
          <button
            onClick={() => setShowAR(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
          >
            🔍 Use AR View
          </button>
        )}
        
        {needsCheckIn && (
          <button
            onClick={handleCheckIn}
            disabled={checkingIn}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
          >
            {checkingIn ? '⏳ Checking In...' : '📍 Check In'}
          </button>
        )}

        {location.clueText && (
          <div className="w-full mt-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-purple-900 mb-1">🔐 Clue</p>
            <p className="text-sm text-slate-700">{location.clueText}</p>
          </div>
        )}
      </div>

      {showQRScanner && (
        <QRCodeScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
          missionId={missionId}
          locationId={location.id}
        />
      )}

      {showAR && (
        <AROverlay
          markerUrl={location.arMarkerUrl}
          clueText={location.clueText}
          clueImage={location.clueImageUrl}
          onClose={() => setShowAR(false)}
          missionId={missionId}
          locationId={location.id}
        />
      )}
    </>
  )
}



