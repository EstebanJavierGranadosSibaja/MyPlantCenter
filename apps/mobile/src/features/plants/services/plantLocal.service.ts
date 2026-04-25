import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@myplantcenter:local_plants_v1';

let plantWriteLock: Promise<void> | null = null;

const waitForLock = async (lock: Promise<void> | null): Promise<void> => {
  if (lock) await lock;
};

export interface LocalPlant {
  id: string;
  imageUri: string;
  name: string;
  scientificName: string;
  confidence: number;
  careInfo: {
    watering: string;
    light: string;
    soil: string;
    temperature: string;
    humidity: string;
  };
  summary: string;
  createdAt: string;
  sourceJobId?: string;
}

const MAX_PLANTS = 200;

const safeParsePlants = (value: string | null): LocalPlant[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const readPlants = async (): Promise<LocalPlant[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return safeParsePlants(raw);
};

const writePlants = async (plants: LocalPlant[]): Promise<void> => {
  await waitForLock(plantWriteLock);
  const writePromise = AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  plantWriteLock = writePromise;
  await writePromise;
  if (plantWriteLock === writePromise) {
    plantWriteLock = null;
  }
};

export const plantLocalService = {
  async addPlant(plant: LocalPlant): Promise<void> {
    const plants = await readPlants();
    plants.unshift(plant);
    if (plants.length > MAX_PLANTS) {
      plants.splice(MAX_PLANTS, plants.length - MAX_PLANTS);
    }
    await writePlants(plants);
  },

  async getPlants(): Promise<LocalPlant[]> {
    return readPlants();
  },

  async removePlant(id: string): Promise<void> {
    const plants = await readPlants();
    const next = plants.filter(p => p.id !== id);
    await writePlants(next);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  async getPlantById(id: string): Promise<LocalPlant | null> {
    const plants = await readPlants();
    return plants.find(p => p.id === id) || null;
  },

  async getPlantByJobId(jobId: string): Promise<LocalPlant | null> {
    const plants = await readPlants();
    return plants.find(p => p.sourceJobId === jobId) || null;
  },
};