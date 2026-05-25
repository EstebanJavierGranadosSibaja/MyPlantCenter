import { EditPlantSchema } from '../features/plants/validators/plant.validators';

// ---------------------------------------------------------------------------
// EditPlantSchema
// ---------------------------------------------------------------------------

describe('EditPlantSchema', () => {
  const datosValidos = {
    name: 'Pothos dorado',
    species: 'Epipremnum aureum',
    categoryId: 'cat-001',
    wateringFrequencyDays: 7,
    notes: 'Riega cuando el sustrato esté completamente seco',
    acquiredAt: '2024-01-15',
  };

  it('acepta un objeto de planta con todos los campos válidos', () => {
    const result = EditPlantSchema.safeParse(datosValidos);
    expect(result.success).toBe(true);
  });

  it('rechaza nombre con menos de 2 caracteres', () => {
    const result = EditPlantSchema.safeParse({ ...datosValidos, name: 'A' });
    expect(result.success).toBe(false);
  });

  it('rechaza nombre con más de 60 caracteres', () => {
    const result = EditPlantSchema.safeParse({ ...datosValidos, name: 'A'.repeat(61) });
    expect(result.success).toBe(false);
  });

  it('rechaza frecuencia de riego de 0 días (mínimo es 1)', () => {
    const result = EditPlantSchema.safeParse({ ...datosValidos, wateringFrequencyDays: 0 });
    expect(result.success).toBe(false);
  });

  it('rechaza frecuencia de riego mayor a 365 días', () => {
    const result = EditPlantSchema.safeParse({ ...datosValidos, wateringFrequencyDays: 366 });
    expect(result.success).toBe(false);
  });

  it('rechaza categoría vacía (campo requerido)', () => {
    const result = EditPlantSchema.safeParse({ ...datosValidos, categoryId: '' });
    expect(result.success).toBe(false);
  });

  it('acepta species y notes como cadenas vacías (campos opcionales)', () => {
    const result = EditPlantSchema.safeParse({ ...datosValidos, species: '', notes: '' });
    expect(result.success).toBe(true);
  });

  it('acepta planta sin campos opcionales (nombre + categoría + frecuencia son suficientes)', () => {
    const result = EditPlantSchema.safeParse({
      name: 'Suculenta',
      categoryId: 'cat-002',
      wateringFrequencyDays: 14,
    });
    expect(result.success).toBe(true);
  });
});
