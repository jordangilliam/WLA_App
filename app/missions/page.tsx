'use client';

import { useEffect, useMemo, useState } from 'react';
import MissionCard from '@/components/missions/MissionCard';
import MissionStageList from '@/components/missions/MissionStageList';
import MissionMedia from '@/components/missions/MissionMedia';
import { MissionMediaModal, MissionHeroImage } from '@/components/missions/MissionMedia';
import { useMissionMap, MissionProximityAlert, type MissionLocation } from '@/components/missions/MissionMapHooks';
import MissionLocationMap from '@/components/missions/MissionLocationMap';
import MissionLocationActions from '@/components/missions/MissionLocationActions';
import ClueReveal from '@/components/missions/ClueReveal';
import type { MissionMediaItem } from '@/components/missions/MissionMedia';

type MissionStage = {
  id: string;
  title: string;
  summary: string | null;
  learning_objective?: string | null;
  target_metric?: string | null;
  target_value?: number | null;
  order_index: number;
};

type Mission = {
  id: string;
  title: string;
  synopsis: string | null;
  storyline_id: string | null;
  hero_image_url: string | null;
  difficulty: string | null;
  story_mission_stages?: MissionStage[];
};

type StageStatus = 'pending' | 'in_progress' | 'completed';

type MissionProgressPayload = {
  missionProgress: {
    completedStages: number;
    totalStages: number;
    completed: boolean;
  };
  stages: Array<MissionStage & { status: StageStatus }>;
};

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, MissionProgressPayload>>({});
  const [stageUpdating, setStageUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MissionMediaItem | null>(null);
  const [missionLocations, setMissionLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [completedLocations, setCompletedLocations] = useState<Set<string>>(new Set());
  const [loadingLocations, setLoadingLocations] = useState(false);
  
  // Location-based mission features (Pokémon GO style)
  const mapLocations: MissionLocation[] = useMemo(() => {
    return missionLocations.map((loc) => ({
      id: loc.id,
      missionId: loc.missionId || selectedMissionId || '',
      stageId: loc.stageId,
      name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      radius: loc.geofenceRadius || 50,
      type: loc.locationType as 'checkpoint' | 'challenge' | 'reward' | 'clue',
      description: loc.clueText,
      requiredAction: loc.requiredAction as any,
    }));
  }, [missionLocations, selectedMissionId]);

  const { proximityAlerts, nearbyLocations, isTracking } = useMissionMap({
    missionLocations: mapLocations,
    proximityThreshold: 200,
    onProximityAlert: (alert) => {
      console.log('📍 Mission location nearby:', alert);
    },
    onLocationReached: (location) => {
      console.log('✅ Mission location reached:', location);
      setSelectedLocation(missionLocations.find((l) => l.id === location.id));
    },
  });

  useEffect(() => {
    let mounted = true;
    async function loadMissions() {
      setLoadingMissions(true);
      try {
        const response = await fetch('/api/story-missions', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load missions');
        const data = await response.json();
        if (mounted) {
          setMissions(data.missions || []);
          if (!selectedMissionId && data.missions?.length) {
            setSelectedMissionId(data.missions[0].id);
          }
        }
      } catch (err: any) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoadingMissions(false);
      }
    }
    loadMissions();
    return () => {
      mounted = false;
    };
  }, [selectedMissionId]);

  useEffect(() => {
    if (!selectedMissionId) return;
    let mounted = true;
    async function loadProgress() {
      try {
        const response = await fetch(`/api/story-missions/${selectedMissionId}/progress`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Unable to load mission progress');
        const data = await response.json();
        if (mounted) {
          setProgressMap((prev) => ({
            ...prev,
            [selectedMissionId]: data,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProgress();
    return () => {
      mounted = false;
    };
  }, [selectedMissionId]);

  // Load mission locations
  useEffect(() => {
    if (!selectedMissionId) return;
    let mounted = true;
    async function loadLocations() {
      setLoadingLocations(true);
      try {
        const response = await fetch(`/api/story-missions/${selectedMissionId}/locations`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Unable to load mission locations');
        const data = await response.json();
        if (mounted) {
          setMissionLocations(data.locations || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingLocations(false);
      }
    }
    loadLocations();
    return () => {
      mounted = false;
    };
  }, [selectedMissionId]);

  const selectedMission = useMemo(
    () => missions.find((mission) => mission.id === selectedMissionId) || null,
    [missions, selectedMissionId]
  );

  const currentStageList = useMemo(() => {
    if (!selectedMission) return [];
    const statusMap: Record<string, StageStatus> = {};
    const missionPayload = selectedMissionId ? progressMap[selectedMissionId] : undefined;
    missionPayload?.stages.forEach((stage) => {
      statusMap[stage.id] = stage.status;
    });
    return (selectedMission.story_mission_stages || []).map((stage) => ({
      ...stage,
      status: statusMap[stage.id] || 'pending',
    }));
  }, [selectedMission, progressMap, selectedMissionId]);

  const handleStageStatusChange = async (stageId: string, status: StageStatus) => {
    if (!selectedMissionId) return;
    setStageUpdating(stageId);
    try {
      const response = await fetch(`/api/story-missions/${selectedMissionId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stageId,
          status,
        }),
      });
      if (!response.ok) {
        const details = await response.json();
        throw new Error(details?.error || 'Unable to update stage');
      }
      const data = await response.json();
      setProgressMap((prev) => ({
        ...prev,
        [selectedMissionId]: data,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setStageUpdating(null);
    }
  };

  const missionProgressPercent = (missionId: string) => {
    const payload = progressMap[missionId];
    if (!payload) return 0;
    const { completedStages, totalStages } = payload.missionProgress;
    return totalStages === 0 ? 0 : (completedStages / totalStages) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-sky-50 pb-16">
      <header className="bg-gradient-to-r from-rose-600 via-red-500 to-sky-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-sm uppercase tracking-[0.2em] font-semibold">
            Field Ops Command · Carmen Sandiego x PokéGO
          </p>
          <h1 className="text-4xl sm:text-5xl font-black mt-3">Mission Control</h1>
          <p className="mt-4 max-w-3xl text-lg text-rose-50">
            Track infectious plant mysteries, hydrology heists, and wildlife rescues across the
            Commonwealth. Each mission unlocks new intel, badges, and location-based challenges—
            part Carmen Sandiego sleuthing, part Pokémon GO field work.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-10">
        {error && (
          <div className="bg-white border border-red-200 text-red-700 rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Mission Deck</h2>
          {loadingMissions ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
              <p className="mt-2 text-sm text-slate-500">Scanning new assignments…</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  active={mission.id === selectedMissionId}
                  progressPercent={missionProgressPercent(mission.id)}
                  onSelect={setSelectedMissionId}
                />
              ))}
            </div>
          )}
        </section>

        {selectedMission && (
          <>
            {/* Hero Image Section */}
            <section>
              <MissionHeroImage
                heroImageUrl={selectedMission.hero_image_url}
                title={selectedMission.title}
                synopsis={selectedMission.synopsis}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                      Active Mission
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedMission.title}</h2>
                    {selectedMission.synopsis && (
                      <p className="text-sm text-slate-600 mt-2">{selectedMission.synopsis}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-slate-400">Difficulty</p>
                    <p className="text-base font-semibold text-slate-900">
                      {selectedMission.difficulty ?? 'Explorer'}
                    </p>
                  </div>
                </div>

                {/* Mission Media Gallery */}
                <div className="mt-6">
                  <MissionMedia
                    missionId={selectedMission.id}
                    heroImageUrl={selectedMission.hero_image_url}
                    showHero={false}
                    showGallery={true}
                    onMediaClick={setSelectedMedia}
                  />
                </div>

                <div className="mt-6">
                  <MissionStageList
                    stages={currentStageList}
                    onStatusChange={handleStageStatusChange}
                    updatingStageId={stageUpdating}
                  />
                </div>
              </div>

            <div className="space-y-6">
              {/* Mission Locations Map */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <p className="text-xs uppercase font-semibold tracking-wide text-purple-600 mb-4">
                  🔐 Mission Locations
                </p>
                {loadingLocations ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                  </div>
                ) : missionLocations.length > 0 ? (
                  <MissionLocationMap
                    missionId={selectedMission.id}
                    locations={missionLocations}
                    onLocationSelect={setSelectedLocation}
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    <p>No locations available</p>
                  </div>
                )}
              </div>

              {/* Selected Location Actions */}
              {selectedLocation && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <p className="text-xs uppercase font-semibold tracking-wide text-purple-600 mb-2">
                    Location: {selectedLocation.name}
                  </p>
                  <MissionLocationActions
                    location={selectedLocation}
                    missionId={selectedMission.id}
                    stageId={selectedLocation.stageId}
                    onActionComplete={(action) => {
                      setCompletedLocations((prev) => new Set(prev).add(selectedLocation.id));
                      // Refresh progress
                      const response = fetch(`/api/story-missions/${selectedMissionId}/progress`, {
                        cache: 'no-store',
                      }).then((r) => r.json()).then((data) => {
                        setProgressMap((prev) => ({
                          ...prev,
                          [selectedMissionId]: data,
                        }));
                      });
                    }}
                  />
                </div>
              )}

              {/* Clue Reveal System */}
              {selectedMission.storyline_id?.includes('secret') && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <ClueReveal
                    clues={missionLocations
                      .filter((loc) => loc.clueText)
                      .map((loc, idx) => ({
                        id: loc.id,
                        text: loc.clueText || '',
                        imageUrl: loc.clueImageUrl,
                        qrCode: loc.qrCodeData,
                        arMarker: loc.arMarkerUrl,
                        unlockCondition: {
                          type: 'location_reached' as const,
                          value: loc.id,
                        },
                        revealOrder: loc.orderIndex,
                      }))}
                    missionId={selectedMission.id}
                    currentStage={progressMap[selectedMissionId]?.missionProgress?.completedStages || 0}
                    completedLocations={Array.from(completedLocations)}
                    onClueUnlocked={(clueId) => {
                      setCompletedLocations((prev) => new Set(prev).add(clueId));
                    }}
                  />
                </div>
              )}

              {/* Field Notebook */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <p className="text-xs uppercase font-semibold tracking-wide text-sky-500">
                  Field Notebook
                </p>
                <h3 className="text-xl font-bold text-slate-900 mt-2">Intel & Location Playbook</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li>• Visit mission locations to scan QR codes and use AR markers</li>
                  <li>• Complete location challenges to unlock progressive clues</li>
                  <li>• Follow the mystery trail across Pittsburgh's cultural institutions</li>
                  <li>• Reveal the final secret by completing all stages</li>
                </ul>
                <div className="mt-6 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-5 text-white shadow-lg">
                  <p className="text-sm font-semibold uppercase tracking-wide">🔐 S.E.C.R.E.T. Mode</p>
                  <p className="text-lg mt-2">
                    Use QR scanning and AR views to uncover hidden clues at each location. Each discovery brings you closer to the secret.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Location-based Proximity Alerts (Pokémon GO style) */}
        {isTracking && (
          <MissionProximityAlert
            alerts={proximityAlerts}
            onDismiss={(alertId) => {
              // Dismiss handled by component
            }}
          />
        )}

        {/* Media Modal */}
        {selectedMedia && (
          <MissionMediaModal
            media={selectedMedia}
            onClose={() => setSelectedMedia(null)}
          />
        )}
      </main>
    </div>
  );
}


