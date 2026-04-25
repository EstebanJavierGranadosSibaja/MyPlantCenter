import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

import { plantJobService } from 'src/features/plants/services/plantJob.service';
import { plantDetectionService, OFFLINE_QUEUE_ERROR } from './plantDetection.service';

const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 8000;
const MAX_ATTEMPTS = 5;

interface SyncState {
  isLocked: boolean;
  currentDelay: number;
  isConnected: boolean;
}

const state: SyncState = {
  isLocked: false,
  currentDelay: INITIAL_DELAY_MS,
  isConnected: false,
};

let unsubscribeNetInfo: (() => void) | null = null;
let syncTimeout: ReturnType<typeof setTimeout> | null = null;

const resetDelay = (): void => {
  state.currentDelay = INITIAL_DELAY_MS;
};

const increaseDelay = (): void => {
  state.currentDelay = Math.min(state.currentDelay * 2, MAX_DELAY_MS);
};

const acquireLock = (): boolean => {
  if (state.isLocked) {
    return false;
  }
  state.isLocked = true;
  return true;
};

const releaseLock = (): void => {
  state.isLocked = false;
};

const processQueue = async (): Promise<{ processed: number; failed: number }> => {
  if (!acquireLock()) {
    return { processed: 0, failed: 0 };
  }

  try {
    const pendingJobs = await plantJobService.getPendingJobs();
    const failedJobs = await plantJobService.getFailedJobs();
    const jobsToProcess = [...pendingJobs, ...failedJobs];

    if (jobsToProcess.length === 0) {
      releaseLock();
      return { processed: 0, failed: 0 };
    }

    let processed = 0;
    let failed = 0;

    for (const job of jobsToProcess) {
      if (job.attempts >= MAX_ATTEMPTS) {
        await plantJobService.removeJob(job.id);
        continue;
      }

      try {
        await plantJobService.updateJobStatus(job.id, 'syncing');

        await plantDetectionService.analyze(job.id, {
          imageUri: job.imageUri,
          imageBase64: undefined,
          source: 'background-sync',
        });

        await plantJobService.removeJob(job.id);
        processed += 1;
      } catch (error) {
        if (error === OFFLINE_QUEUE_ERROR) {
          await plantJobService.updateJobStatus(job.id, 'failed', 'Network unavailable');
        } else {
          await plantJobService.updateJobStatus(
            job.id,
            'failed',
            error instanceof Error ? error.message : 'Unknown error',
          );
        }
        failed += 1;
      }
    }

    releaseLock();
    return { processed, failed };
  } catch {
    releaseLock();
    return { processed: 0, failed: 0 };
  }
};

const scheduleNextSync = (): void => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(async () => {
    if (!state.isConnected) {
      resetDelay();
      return;
    }

    try {
      const result = await processQueue();

      if (result.processed > 0 || result.failed > 0) {
        console.log('[BackgroundSync] Result:', result);
      }

      if (result.failed > 0) {
        increaseDelay();
        scheduleNextSync();
      } else {
        resetDelay();
      }
    } catch {
      increaseDelay();
      scheduleNextSync();
    }
  }, state.currentDelay);
};

const startListening = (): void => {
  if (unsubscribeNetInfo) {
    return;
  }

  unsubscribeNetInfo = NetInfo.addEventListener((netInfo: NetInfoState) => {
    const wasConnected = state.isConnected;
    const connected = Boolean(netInfo.isConnected);

    if (connected && !wasConnected) {
      state.isConnected = true;
      resetDelay();
      scheduleNextSync();
    } else {
      state.isConnected = connected;
    }
  });
};

const stopListening = (): void => {
  if (unsubscribeNetInfo) {
    unsubscribeNetInfo();
    unsubscribeNetInfo = null;
  }

  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
};

const triggerSync = (): void => {
  if (state.isConnected) {
    resetDelay();
    scheduleNextSync();
  }
};

export const backgroundSyncService = {
  startListening,
  stopListening,
  triggerSync,
  processQueue,
};