import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Ingresa un correo valido.'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export const RegisterSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener entre 2 y 60 caracteres.')
    .max(60, 'El nombre debe tener entre 2 y 60 caracteres.')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/, 'El nombre solo puede contener letras y espacios.'),
  nickname: z
    .string()
    .trim()
    .transform(value => value.replace(/^@+/, '').toLowerCase())
    .pipe(
      z
        .string()
        .regex(/^[a-z0-9_.]{3,20}$/, 'El apodo debe tener 3-20 caracteres, solo minusculas, numeros, punto o guion bajo.'),
    ),
  email: z
    .string()
    .trim()
    .email('Ingresa un correo valido.'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener 8-64 caracteres, mayuscula, minuscula, numero y simbolo.')
    .max(64, 'La contraseña debe tener 8-64 caracteres, mayuscula, minuscula, numero y simbolo.')
    .refine(value => !/\s/.test(value), 'La contraseña no puede contener espacios.')
    .refine(value => /[A-Z]/.test(value), 'La contraseña debe incluir una mayuscula.')
    .refine(value => /[a-z]/.test(value), 'La contraseña debe incluir una minuscula.')
    .refine(value => /\d/.test(value), 'La contraseña debe incluir un numero.')
    .refine(value => /[^A-Za-z0-9]/.test(value), 'La contraseña debe incluir un simbolo.'),
  confirmPassword: z.string(),
}).superRefine((values, context) => {
  if (values.password !== values.confirmPassword) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Las contraseñas no coinciden.',
    });
  }
});

export type LoginValidationInput = z.input<typeof LoginSchema>;
export type RegisterValidationInput = z.input<typeof RegisterSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;

function getFirstZodErrorMessage(error: z.ZodError): string {
  const firstIssue = error.issues[0];
  return firstIssue?.message ?? 'Hay errores en el formulario.';
}

export function validateLoginInput(input: LoginValidationInput): string | null {
  const result = LoginSchema.safeParse(input);
  if (!result.success) {
    return getFirstZodErrorMessage(result.error);
  }
  return null;
}

export function validateRegisterInput(input: RegisterValidationInput): string | null {
  const result = RegisterSchema.safeParse(input);
  if (!result.success) {
    return getFirstZodErrorMessage(result.error);
  }
  return null;
}
