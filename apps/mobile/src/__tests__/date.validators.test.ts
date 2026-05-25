import {
  isValidDateInput,
  normalizeDateInput,
} from '../features/plants/validators/date.validators';

// ---------------------------------------------------------------------------
// isValidDateInput
// ---------------------------------------------------------------------------

describe('isValidDateInput', () => {
  it('retorna true cuando el valor es undefined', () => {
    expect(isValidDateInput(undefined)).toBe(true);
  });

  it('retorna true para cadena vacía', () => {
    expect(isValidDateInput('')).toBe(true);
  });

  it('retorna true para cadena de solo espacios', () => {
    expect(isValidDateInput('   ')).toBe(true);
  });

  it('retorna true para fecha DD/MM/YYYY válida', () => {
    expect(isValidDateInput('15/06/2024')).toBe(true);
  });

  it('retorna true para fecha ISO YYYY-MM-DD válida', () => {
    expect(isValidDateInput('2024-06-15')).toBe(true);
  });

  it('retorna false para fecha DD/MM/YYYY con día 32 (inválido)', () => {
    expect(isValidDateInput('32/01/2024')).toBe(false);
  });

  it('retorna false para cadena de texto arbitraria', () => {
    expect(isValidDateInput('no-es-una-fecha')).toBe(false);
  });

  it('retorna false para fecha ISO con mes 13 (inválido)', () => {
    expect(isValidDateInput('2024-13-01')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// normalizeDateInput
// ---------------------------------------------------------------------------

describe('normalizeDateInput', () => {
  it('retorna undefined para valor undefined', () => {
    expect(normalizeDateInput(undefined)).toBeUndefined();
  });

  it('retorna undefined para cadena vacía', () => {
    expect(normalizeDateInput('')).toBeUndefined();
  });

  it('convierte 15/06/2024 al formato ISO 2024-06-15', () => {
    expect(normalizeDateInput('15/06/2024')).toBe('2024-06-15');
  });

  it('convierte 01/01/2000 al formato ISO 2000-01-01 (ceros preservados)', () => {
    expect(normalizeDateInput('01/01/2000')).toBe('2000-01-01');
  });

  it('retorna cadena ISO sin modificar si ya está en formato correcto', () => {
    expect(normalizeDateInput('2024-06-15')).toBe('2024-06-15');
  });
});
