'use client';

import { offlineQueue, type BundleQueueRecord } from '@/lib/offline/offline-queue';

export type BundleQueuePayload = Omit<BundleQueueRecord, 'id' | 'createdAt'> & {
  id?: string;
};

export async function queueBundle(payload: BundleQueuePayload): Promise<BundleQueueRecord> {
  const record: BundleQueueRecord = {
    id: payload.id ?? `bundle-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    siteId: payload.siteId,
    siteName: payload.siteName,
    pillarIds: payload.pillarIds,
    tags: payload.tags ?? [],
    metadata: payload.metadata ?? {},
  };

  await offlineQueue.addBundleRecord(record);
  return record;
}

export async function listQueuedBundles(): Promise<BundleQueueRecord[]> {
  return offlineQueue.getBundleRecords();
}

export async function consumeBundle(bundleId: string): Promise<void> {
  await offlineQueue.deleteBundleRecord(bundleId);
}

export async function clearBundleQueue(): Promise<void> {
  await offlineQueue.clearBundleRecords();
}

export function subscribeToBundleQueue(
  listener: (bundles: BundleQueueRecord[]) => void
): () => void {
  offlineQueue.addBundleListener(listener);
  return () => offlineQueue.removeBundleListener(listener);
}

