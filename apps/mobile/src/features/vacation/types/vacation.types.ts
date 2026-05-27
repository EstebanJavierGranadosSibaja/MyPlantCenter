export type PlantRiskLevel = 'high' | 'medium' | 'low';

export interface PlantVacationRisk {
  plantId: string;
  plantName: string;
  wateringFrequencyDays: number;
  lastWatered?: string;
  daysUntilDue: number;
  willNeedWateringDuring: boolean;
  riskLevel: PlantRiskLevel;
  recommendedAction: string;
}

export interface VacationPlan {
  departureDate: string;
  returnDate: string;
  isActive: boolean;
}
