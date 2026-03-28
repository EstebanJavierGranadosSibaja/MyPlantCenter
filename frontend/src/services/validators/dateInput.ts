export function isValidDateInput(value?: string): boolean {
  if (!value) {
    return true;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return true;
  }

  const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = trimmed.match(ddmmyyyy);

  if (match) {
    const [, day, month, year] = match;
    const isoLike = `${year}-${month}-${day}`;
    return !Number.isNaN(Date.parse(isoLike));
  }

  return !Number.isNaN(Date.parse(trimmed));
}

export function normalizeDateInput(value?: string): string | undefined {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {
    return undefined;
  }

  const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = trimmed.match(ddmmyyyy);

  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  return trimmed;
}
