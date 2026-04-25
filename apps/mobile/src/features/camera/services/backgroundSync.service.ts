import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

import { plantJobService, MAX_JOB_ATTEMPTS } from 'src/features/plants/services/plantJob.service';
import { plantDetectionService } from './plantDetection.service';

const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 8000;

interface SyncState {
  isLocked: boolean;
  currentDelay: number;
  isConnected: boolean;
}

interface ProcessResult {
  processed: number;
  failed: number;
  skipped: number;
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

const processJob = async (job: { id: string; imageUri: string; attempts: number }): Promise<{ success: boolean; error?: string }> => {
  await plantJobService.updateJobStatus(job.id, 'syncing');

  try {
    await plantDetectionService.analyze(job.id, {
      imageUri: job.imageUri,
      imageBase64: undefined,
      source: 'background-sync',
    });

    await plantJobService.removeJob(job.id);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await plantJobService.updateJobStatus(job.id, 'failed', message);
    return { success: false, error: message };
  }
};

const processQueue = async (): Promise<ProcessResult> => {
  if (!acquireLock()) {
    console.log('[BackgroundSync] Lock not acquired, skipping');
    return { processed: 0, failed: 0, skipped: 0 };
  }

  try {
    const pendingJobs = await plantJobService.getPendingJobs();
    const failedJobs = await plantJobService.getFailedJobs();
    const jobsToProcess = [...pendingJobs, ...failedJobs];

    if (jobsToProcess.length === 0) {
      releaseLock();
      return { processed: 0, failed: 0, skipped: 0 };
    }

    console.log(`[BackgroundSync] Processing ${jobsToProcess.length} jobs`);

    let processed = 0;
    let failed = 0;
    let skipped = 0;

    for (const job of jobsToProcess) {
      if (job.status === 'permanent_failed') {
        console.log(`[BackgroundSync] Skip job ${job.id}: permanently failed`);
        skipped += 1;
        continue;
      }

      if (job.attempts >= MAX_JOB_ATTEMPTS) {
        console.log(`[BackgroundSync] Skip job ${job.id}: max attempts reached (${job.attempts})`);
        await plantJobService.updateJobStatus(job.id, 'permanent_failed', 'Max attempts exceeded');
        skipped += 1;
        continue;
      }

      try {
        const result = await processJob(job);

        if (result.success) {
          processed += 1;
          console.log(`[BackgroundSync] Processed job ${job.id}`);
        } else {
          failed += 1;
          console.log(`[BackgroundSync] Failed job ${job.id}: ${result.error}`);
        }
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.log(`[BackgroundSync] Exception on job ${job.id}: ${message}`);
      }
    }

    releaseLock();
    console.log(`[BackgroundSync] Batch done: processed=${processed}, failed=${failed}, skipped=${skipped}`);
    return { processed, failed, skipped };
  } catch (error) {
    releaseLock();
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(`[BackgroundSync] Queue processing error: ${message}`);
    return { processed: 0, failed: 0, skipped: 0 };
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

    const result = await processQueue();

    if (result.failed > 0) {
      increaseDelay();
      scheduleNextSync();
    } else {
      resetDelay();
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