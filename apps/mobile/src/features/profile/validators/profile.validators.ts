import { z } from 'zod';
import { isValidDateInput } from 'src/features/plants/validators/date.validators';

export const EditProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'El nombre no puede superar los 60 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

  nickname: z
    .string()
    .min(3, 'El apodo debe tener al menos 3 caracteres')
    .max(30, 'El apodo no puede superar los 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guiones bajos')
    .transform(val => val.toLowerCase()),

  description: z
    .string()
    .max(160, 'Máximo 160 caracteres')
    .optional()
    .or(z.literal('')),

  birthday: z
    .string()
    .optional()
    .refine(
      val => isValidDateInput(val),
      'Fecha de nacimiento inválida'
    ),

  location: z
    .string()
    .max(80, 'Máximo 80 caracteres')
    .optional()
    .or(z.literal('')),
});

export type EditProfileFormValues = z.infer<typeof EditProfileSchema>;
