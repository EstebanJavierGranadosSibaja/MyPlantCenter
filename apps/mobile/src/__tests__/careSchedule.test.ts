import {
  buildCareSummary,
  calculateCareStreak,
  sortCareTasksByPriority,
  CareTask,
  CareStatus,
} from '../features/care/utils/careSchedule';
import { CareHistoryItem } from '../features/care/types/care.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCareTask(
  id: string,
  status: CareStatus,
  daysUntil: number,
  name = `Planta ${id}`,
): CareTask {
  return {
    plantId: id,
    plantName: name,
    wateringFrequencyDays: 7,
    dueDate: new Date(),
    daysUntil,
    status,
  };
}

function makeHistoryItem(completedAt: string): CareHistoryItem {
  return {
    id: `h-${completedAt}`,
    userId: 'user-1',
    plantId: 'plant-1',
    type: 'watering',
    createdAt: completedAt,
    completedAt,
    updatedAt: completedAt,
  };
}

// ---------------------------------------------------------------------------
// buildCareSummary
// ---------------------------------------------------------------------------

describe('buildCareSummary', () => {
  it('retorna todos los contadores en cero para lista vacía', () => {
    const summary = buildCareSummary([]);
    expect(summary.total).toBe(0);
    expect(summary.overdue).toBe(0);
    expect(summary.dueToday).toBe(0);
    expect(summary.soon).toBe(0);
    expect(summary.upcoming).toBe(0);
  });

  it('cuenta correctamente cada estado de tarea', () => {
    const tasks = [
      makeCareTask('1', 'overdue', -3),
      makeCareTask('2', 'overdue', -1),
      makeCareTask('3', 'due', 0),
      makeCareTask('4', 'soon', 1),
      makeCareTask('5', 'upcoming', 5),
    ];
    const summary = buildCareSummary(tasks);
    expect(summary.total).toBe(5);
    expect(summary.overdue).toBe(2);
    expect(summary.dueToday).toBe(1);
    expect(summary.soon).toBe(1);
    expect(summary.upcoming).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// sortCareTasksByPriority
// ---------------------------------------------------------------------------

describe('sortCareTasksByPriority', () => {
  it('ordena por prioridad: overdue → due → soon → upcoming', () => {
    const tasks = [
      makeCareTask('u', 'upcoming', 5),
      makeCareTask('o', 'overdue', -2),
      makeCareTask('s', 'soon', 1),
      makeCareTask('d', 'due', 0),
    ];
    const sorted = sortCareTasksByPriority(tasks);
    expect(sorted.map(t => t.status)).toEqual(['overdue', 'due', 'soon', 'upcoming']);
  });

  it('no muta el array original', () => {
    const tasks = [
      makeCareTask('a', 'upcoming', 3),
      makeCareTask('b', 'overdue', -1),
    ];
    sortCareTasksByPriority(tasks);
    expect(tasks[0].status).toBe('upcoming');
    expect(tasks[1].status).toBe('overdue');
  });
});

// ---------------------------------------------------------------------------
// calculateCareStreak
// ---------------------------------------------------------------------------

describe('calculateCareStreak', () => {
  it('retorna 0 para historial vacío', () => {
    expect(calculateCareStreak([])).toBe(0);
  });

  it('retorna 3 para historial con 3 días consecutivos', () => {
    // Usamos hora local (sin Z) para evitar problemas de zona horaria
    const items = [
      makeHistoryItem('2024-03-03T12:00:00'),
      makeHistoryItem('2024-03-02T12:00:00'),
      makeHistoryItem('2024-03-01T12:00:00'),
    ];
    expect(calculateCareStreak(items)).toBe(3);
  });

  it('corta la racha cuando hay un día sin registro', () => {
    const items = [
      makeHistoryItem('2024-03-05T12:00:00'),
      // falta 2024-03-04
      makeHistoryItem('2024-03-03T12:00:00'),
    ];
    expect(calculateCareStreak(items)).toBe(1);
  });
});
