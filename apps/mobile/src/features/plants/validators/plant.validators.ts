import { z } from 'zod';
import { isValidDateInput } from './date.validators';

export const EditPlantSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'El nombre no puede superar los 60 caracteres'),
  species: z
    .string()
    .max(80, 'Máximo 80 caracteres')
    .optional()
    .or(z.literal('')),
  categoryId: z
    .string()
    .min(1, 'Selecciona una categoría'),
  wateringFrequencyDays: z
    .number({ message: 'Debe ser un número' })
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 día')
    .max(365, 'Máximo 365 días'),
  notes: z
    .string()
    .max(300, 'Máximo 300 caracteres')
    .optional()
    .or(z.literal('')),
  acquiredAt: z
    .string()
    .optional()
    .refine(
      val => isValidDateInput(val),
      'Fecha de adquisición inválida'
    ),
});

export type EditPlantFormValues = z.infer<typeof EditPlantSchema>;
