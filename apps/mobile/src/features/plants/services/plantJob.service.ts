import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@myplantcenter:plant_jobs_v1';

let jobWriteLock: Promise<void> | null = null;

const waitForLock = async (lock: Promise<void> | null): Promise<void> => {
  if (lock) await lock;
};

export type JobStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface PlantJob {
  id: string;
  imageUri: string;
  plantName: string;
  scientificName: string;
  confidence: number;
  careInfo: {
    watering: string;
    light: string;
    soil: string;
    temperature: string;
    humidity: string;
  };
  timestamp: string;
  status: JobStatus;
  attempts: number;
  lastError?: string;
}

const MAX_JOBS = 100;

const safeParseJobs = (value: string | null): PlantJob[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const readJobs = async (): Promise<PlantJob[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return safeParseJobs(raw);
};

const writeJobs = async (jobs: PlantJob[]): Promise<void> => {
  await waitForLock(jobWriteLock);
  const writePromise = AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  jobWriteLock = writePromise;
  await writePromise;
  if (jobWriteLock === writePromise) {
    jobWriteLock = null;
  }
};

const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const plantJobService = {
  async createJob(imageUri: string): Promise<PlantJob> {
    const jobs = await readJobs();

    const job: PlantJob = {
      id: createId(),
      imageUri,
      plantName: 'Pendiente',
      scientificName: '',
      confidence: 0,
      careInfo: {
        watering: '',
        light: '',
        soil: '',
        temperature: '',
        humidity: '',
      },
      timestamp: new Date().toISOString(),
      status: 'pending',
      attempts: 0,
    };

    jobs.unshift(job);

    if (jobs.length > MAX_JOBS) {
      jobs.splice(MAX_JOBS, jobs.length - MAX_JOBS);
    }

    await writeJobs(jobs);
    return job;
  },

  async updateJobStatus(jobId: string, status: JobStatus, error?: string): Promise<void> {
    const jobs = await readJobs();
    const index = jobs.findIndex(j => j.id === jobId);
    if (index === -1) return;

    jobs[index].status = status;
    if (error) {
      jobs[index].lastError = error;
    }
    if (status === 'failed') {
      jobs[index].attempts += 1;
    }

    await writeJobs(jobs);
  },

  async getJob(jobId: string): Promise<PlantJob | null> {
    const jobs = await readJobs();
    return jobs.find(j => j.id === jobId) || null;
  },

  async getPendingJobs(): Promise<PlantJob[]> {
    const jobs = await readJobs();
    return jobs.filter(j => j.status === 'pending');
  },

  async getFailedJobs(): Promise<PlantJob[]> {
    const jobs = await readJobs();
    return jobs.filter(j => j.status === 'failed');
  },

  async getPendingAndFailedJobs(): Promise<PlantJob[]> {
    const jobs = await readJobs();
    return jobs.filter(j => j.status === 'pending' || j.status === 'failed');
  },

  async getSyncingJobs(): Promise<PlantJob[]> {
    const jobs = await readJobs();
    return jobs.filter(j => j.status === 'syncing');
  },

  async removeJob(jobId: string): Promise<void> {
    const jobs = await readJobs();
    const next = jobs.filter(j => j.id !== jobId);
    await writeJobs(next);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  async getAllJobs(): Promise<PlantJob[]> {
    return readJobs();
  },
};
