import { cache } from 'react';
import rawCatalog from '@/data/taxonomy/pillar-catalog.json';
import type {
  Pillar,
  PillarAsset,
  PillarAssetWithPillar,
  PillarCatalog,
  PillarRecommendationOptions,
} from '@/lib/types/pillar.types';

type NormalizedCatalog = PillarCatalog & { indexedAssets: PillarAssetWithPillar[] };

const normalizeCatalog = (catalog: PillarCatalog): NormalizedCatalog => {
  const indexedAssets: PillarAssetWithPillar[] = catalog.pillars.flatMap((pillar) =>
    pillar.assets.map((asset) => ({
      ...asset,
      pillarId: pillar.id,
      pillarTitle: pillar.title,
      pillarDescription: pillar.description,
      pillarTracks: pillar.tracks,
      pillarGaps: pillar.gaps,
    }))
  );

  return {
    ...catalog,
    indexedAssets,
  };
};

const getCatalogInternal = cache(() => normalizeCatalog(rawCatalog as PillarCatalog));

export const getPillarCatalog = (): NormalizedCatalog => getCatalogInternal();

export const getPillars = (): Pillar[] => getCatalogInternal().pillars;

export const getPillarById = (id: string): Pillar | undefined =>
  getCatalogInternal().pillars.find((pillar) => pillar.id === id);

export const getAssetsForPillar = (id: string): PillarAssetWithPillar[] => {
  const catalog = getCatalogInternal();
  return catalog.indexedAssets.filter((asset) => asset.pillarId === id);
};

export const getAssetById = (id: string): PillarAssetWithPillar | undefined =>
  getCatalogInternal().indexedAssets.find((asset) => asset.id === id);

export const getAssetsByTags = (tags: string[]): PillarAssetWithPillar[] => {
  if (!tags.length) return [];
  const normalizedTags = tags.map((tag) => tag.toLowerCase());
  return getCatalogInternal().indexedAssets.filter((asset) =>
    asset.coverageTags.some((tag) => normalizedTags.includes(tag.toLowerCase()))
  );
};

const defaultRecommendationLimit = 6;

const scoreAsset = (
  asset: PillarAssetWithPillar,
  options: PillarRecommendationOptions
): number => {
  let score = 0;

  if (options.tags?.length) {
    const normalizedTags = options.tags.map((tag) => tag.toLowerCase());
    score += asset.coverageTags.reduce(
      (acc, tag) => acc + (normalizedTags.includes(tag.toLowerCase()) ? 1 : 0),
      0
    );
  }

  if (options.types?.length && options.types.includes(asset.type)) {
    score += 2;
  }

  if (options.includePillars?.length && options.includePillars.includes(asset.pillarId)) {
    score += 1;
  }

  return score;
};

const statusAllowed = (
  asset: PillarAsset,
  { includeStatuses, excludeStatuses }: PillarRecommendationOptions
): boolean => {
  if (excludeStatuses?.includes(asset.status)) {
    return false;
  }
  if (includeStatuses && includeStatuses.length > 0) {
    return includeStatuses.includes(asset.status);
  }
  return true;
};

export const getPillarRecommendations = (
  options: PillarRecommendationOptions = {}
): PillarAssetWithPillar[] => {
  const catalog = getCatalogInternal();

  const scoredAssets = catalog.indexedAssets
    .filter((asset) => statusAllowed(asset, options))
    .map((asset) => ({
      asset,
      score: scoreAsset(asset, options),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const limit = options.limit ?? defaultRecommendationLimit;
  return scoredAssets.slice(0, limit).map(({ asset }) => asset);
};

export const getCatalogGeneratedAt = (): Date => new Date(getCatalogInternal().generatedAt);

