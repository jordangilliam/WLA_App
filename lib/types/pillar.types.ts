import type { Track } from './lesson.types';

export type PillarAssetStatus = 'draft' | 'beta' | 'shipped' | 'complete' | 'archive';

export type PillarAssetType =
  | 'lesson_collection'
  | 'classroom_lesson'
  | 'experience'
  | 'data_set'
  | 'service'
  | 'doc'
  | 'media_collection';

export interface PillarAsset {
  id: string;
  name: string;
  type: PillarAssetType | string;
  path: string;
  contentTypes: string[];
  coverageTags: string[];
  status: PillarAssetStatus | string;
}

export interface Pillar {
  id: string;
  title: string;
  description?: string;
  tracks: Track[] | string[];
  assets: PillarAsset[];
  gaps?: string[];
}

export interface PillarCatalog {
  generatedAt: string;
  pillars: Pillar[];
}

export interface PillarAssetWithPillar extends PillarAsset {
  pillarId: string;
  pillarTitle: string;
  pillarDescription?: string;
  pillarTracks: (Track | string)[];
  pillarGaps?: string[];
}

export interface PillarRecommendationOptions {
  tags?: string[];
  types?: (PillarAssetType | string)[];
  limit?: number;
  includeStatuses?: (PillarAssetStatus | string)[];
  excludeStatuses?: (PillarAssetStatus | string)[];
  includePillars?: string[];
}

