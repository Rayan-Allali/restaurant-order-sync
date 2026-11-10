export const SYNC_QUEUE_EVENT_TYPES = [
  "ORDER_CREATED",
  "ORDER_STATUS_UPDATED",
] as const;

export type SyncQueueEventType =
  (typeof SYNC_QUEUE_EVENT_TYPES)[number];

export const SYNC_QUEUE_STATUSES = ["pending", "synced"] as const;

export type SyncQueueStatus =
  (typeof SYNC_QUEUE_STATUSES)[number];

export interface SyncQueueItem {
  id: string;
  entityId: string;
  eventType: SyncQueueEventType;
  payload: unknown;
  status: SyncQueueStatus;
  attempts: number;
  createdAt: number;
  syncedAt: number | null;
}