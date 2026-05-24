import { CareHistoryItem } from 'src/features/care/types/care.types';
import { Plant } from 'src/features/plants/types/plant.types';

export type CareStatus = 'overdue' | 'due' | 'soon' | 'upcoming';

export interface CareTask {
  plantId: string;
  plantName: string;
  wateringFrequencyDays: number;
  lastWatered?: string;
  dueDate: Date;
  daysUntil: number;
  status: CareStatus;
}

export interface CareSummary {
  overdue: number;
  dueToday: number;
  soon: number;
  upcoming: number;
  total: number;
}

export interface CareCalendarDay {
  key: string;
  label: string;
  date?: Date;
  isOverdueGroup?: boolean;
  tasks: CareTask[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeToDayStart = (value: Date): Date =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const safeParseDate = (value?: string): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const diffDays = (target: Date, base: Date): number => {
  const targetDay = normalizeToDayStart(target);
  const baseDay = normalizeToDayStart(base);
  return Math.round((targetDay.getTime() - baseDay.getTime()) / DAY_MS);
};

const resolveStatus = (daysUntil: number): CareStatus => {
  if (daysUntil < 0) {
    return 'overdue';
  }
  if (daysUntil === 0) {
    return 'due';
  }
  if (daysUntil <= 2) {
    return 'soon';
  }
  return 'upcoming';
};

export const buildCareTasks = (plants: Plant[]): CareTask[] => {
  const today = new Date();
  return plants.map(plant => {
    const baseDate =
      safeParseDate(plant.lastWatered)
      ?? safeParseDate(plant.createdAt)
      ?? today;
    const frequency = Math.max(1, Math.round(plant.wateringFrequencyDays || 1));
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + frequency);
    const daysUntil = diffDays(dueDate, today);
    const status = resolveStatus(daysUntil);

    return {
      plantId: plant.id,
      plantName: plant.name,
      wateringFrequencyDays: frequency,
      lastWatered: plant.lastWatered,
      dueDate,
      daysUntil,
      status,
    };
  });
};

export const buildCareSummary = (tasks: CareTask[]): CareSummary => {
  const summary: CareSummary = {
    overdue: 0,
    dueToday: 0,
    soon: 0,
    upcoming: 0,
    total: tasks.length,
  };

  tasks.forEach(task => {
    if (task.status === 'overdue') summary.overdue += 1;
    else if (task.status === 'due') summary.dueToday += 1;
    else if (task.status === 'soon') summary.soon += 1;
    else summary.upcoming += 1;
  });

  return summary;
};

const formatDayLabel = (date: Date): string => {
  const today = normalizeToDayStart(new Date());
  const daysUntil = diffDays(date, today);
  if (daysUntil === 0) {
    return 'Hoy';
  }
  if (daysUntil === 1) {
    return 'Mañana';
  }

  return date.toLocaleDateString('es-CR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
};

const formatDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const buildCalendarDays = (tasks: CareTask[], horizonDays: number): CareCalendarDay[] => {
  const today = normalizeToDayStart(new Date());
  const overdueTasks = tasks.filter(task => task.status === 'overdue');
  const upcomingTasks = tasks.filter(task => task.status !== 'overdue');

  const dayBuckets: Record<string, CareTask[]> = {};
  upcomingTasks.forEach(task => {
    const dateKey = formatDateKey(task.dueDate);
    if (!dayBuckets[dateKey]) {
      dayBuckets[dateKey] = [];
    }
    dayBuckets[dateKey].push(task);
  });

  const days: CareCalendarDay[] = [];
  if (overdueTasks.length > 0) {
    days.push({
      key: 'overdue',
      label: 'Atrasadas',
      isOverdueGroup: true,
      tasks: overdueTasks.sort((a, b) => a.daysUntil - b.daysUntil),
    });
  }

  for (let offset = 0; offset < horizonDays; offset += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    const dateKey = formatDateKey(date);
    const tasksForDay = dayBuckets[dateKey] ?? [];
    if (tasksForDay.length === 0) {
      continue;
    }

    days.push({
      key: dateKey,
      label: formatDayLabel(date),
      date,
      tasks: tasksForDay.sort((a, b) => a.plantName.localeCompare(b.plantName)),
    });
  }

  return days;
};

const extractHistoryDate = (history: CareHistoryItem): Date | null => {
  const candidate = history.completedAt || history.createdAt;
  return safeParseDate(candidate);
};

export const calculateCareStreak = (history: CareHistoryItem[]): number => {
  const dateKeys = new Set<string>();
  history.forEach(item => {
    const date = extractHistoryDate(item);
    if (!date) {
      return;
    }
    dateKeys.add(formatDateKey(date));
  });

  const sorted = Array.from(dateKeys).sort((a, b) => b.localeCompare(a));
  if (sorted.length === 0) {
    return 0;
  }

  let streak = 0;
  let current = sorted[0];
  while (dateKeys.has(current)) {
    streak += 1;
    const [year, month, day] = current.split('-').map(value => Number(value));
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);
    current = formatDateKey(date);
  }

  return streak;
};

export const sortCareTasksByPriority = (tasks: CareTask[]): CareTask[] => {
  const priority: Record<CareStatus, number> = {
    overdue: 0,
    due: 1,
    soon: 2,
    upcoming: 3,
  };

  return [...tasks].sort((left, right) => {
    const diff = priority[left.status] - priority[right.status];
    if (diff !== 0) return diff;
    if (left.daysUntil !== right.daysUntil) return left.daysUntil - right.daysUntil;
    return left.plantName.localeCompare(right.plantName);
  });
};
