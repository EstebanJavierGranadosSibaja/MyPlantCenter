import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant } from 'src/features/plants/types/plant.types';
import { PlantRiskLevel, PlantVacationRisk, VacationPlan } from '../types/vacation.types';

const STORAGE_KEY = 'vacation_plan_v1';

const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeToDayStart = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const diffDays = (a: Date, b: Date): number =>
  Math.round((normalizeToDayStart(a).getTime() - normalizeToDayStart(b).getTime()) / DAY_MS);

const resolveRisk = (
  daysUntilDue: number,
  willNeedWatering: boolean,
  vacationDays: number,
): PlantRiskLevel => {
  if (!willNeedWatering) return 'low';
  const daysOverdue = vacationDays - daysUntilDue;
  if (daysOverdue > 3) return 'high';
  if (daysOverdue > 0) return 'medium';
  return 'low';
};

const buildAction = (risk: PlantRiskLevel, daysUntilDue: number): string => {
  if (risk === 'high') return 'Riega antes de salir — quedará sin agua varios días';
  if (risk === 'medium') return `Riega antes de salir (vence en ${daysUntilDue} d)`;
  return 'No necesita riego durante las vacaciones';
};

export const vacationService = {
  async save(plan: VacationPlan): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  },

  async load(): Promise<VacationPlan | null> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as VacationPlan; } catch { return null; }
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  assessRisks(plants: Plant[], departure: Date, returnDate: Date): PlantVacationRisk[] {
    const today     = new Date();
    const vacDays   = diffDays(returnDate, departure);

    return plants.map(plant => {
      const baseDate =
        plant.lastWatered ? new Date(plant.lastWatered) :
        plant.createdAt   ? new Date(plant.createdAt)   : today;
      const freq     = Math.max(1, Math.round(plant.wateringFrequencyDays || 7));
      const dueDate  = new Date(baseDate);
      dueDate.setDate(dueDate.getDate() + freq);

      const daysUntilDue       = diffDays(dueDate, today);
      const willNeedWatering   = daysUntilDue <= vacDays;
      const riskLevel          = resolveRisk(daysUntilDue, willNeedWatering, vacDays);

      return {
        plantId:                plant.id,
        plantName:              plant.name,
        wateringFrequencyDays:  freq,
        lastWatered:            plant.lastWatered,
        daysUntilDue,
        willNeedWateringDuring: willNeedWatering,
        riskLevel,
        recommendedAction:      buildAction(riskLevel, daysUntilDue),
      };
    }).sort((a, b) => {
      const order: Record<PlantRiskLevel, number> = { high: 0, medium: 1, low: 2 };
      return order[a.riskLevel] - order[b.riskLevel];
    });
  },
};
