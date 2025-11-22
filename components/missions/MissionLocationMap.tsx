/**
 * Mission Location Map Component
 * Shows mission locations on an interactive map
 */

'use client'

import { useEffect, useState } from 'react'
import InteractiveMap, { MapFieldSite } from '@/components/map/InteractiveMap'

interface MissionLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  locationType: string
  requiredAction?: string
  geofenceRadius: number
  clueText?: string
  orderIndex: number
}

interface MissionLocationMapProps {
  missionId: string
  locations: MissionLocation[]
  onLocationSelect?: (location: MissionLocation) => void
}

export default function MissionLocationMap({
  missionId,
  locations,
  onLocationSelect,
}: MissionLocationMapProps) {
  const [mapSites, setMapSites] = useState<MapFieldSite[]>([])

  useEffect(() => {
    // Convert mission locations to map sites
    const sites: MapFieldSite[] = locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      site_type: loc.locationType,
      description: loc.clueText,
    }))
    setMapSites(sites)
  }, [locations])

  if (locations.length === 0) {
    return (
      <div className="bg-slate-100 rounded-xl p-8 text-center">
        <p className="text-slate-500">No locations available for this mission</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border-2 border-purple-200" style={{ height: '400px' }}>
      <InteractiveMap
        sites={mapSites}
        userLocation={null}
        selectedSite={null}
        onSiteSelect={(site) => {
          const location = locations.find((l) => l.id === site.id)
          if (location) {
            onLocationSelect?.(location)
          }
        }}
      />
    </div>
  )
}


