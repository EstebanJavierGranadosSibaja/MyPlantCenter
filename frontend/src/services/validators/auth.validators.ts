export interface LoginValidationInput {
  email: string;
  password: string;
}

export interface RegisterValidationInput {
  fullName: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FULL_NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/;
const NICKNAME_RE = /^[a-z0-9_.]{3,20}$/;

function isStrongPassword(password: string): boolean {
  if (password.length < 8 || password.length > 64) {
    return false;
  }

  if (/\s/.test(password)) {
    return false;
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return hasUpper && hasLower && hasNumber && hasSpecial;
}

export function validateLoginInput(input: LoginValidationInput): string | null {
  const email = input.email.trim();

  if (!EMAIL_RE.test(email)) {
    return 'Ingresa un correo valido.';
  }

  if (input.password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }

  return null;
}

export function validateRegisterInput(input: RegisterValidationInput): string | null {
  const fullName = input.fullName.trim();
  const nickname = input.nickname.trim().replace(/^@+/, '');
  const email = input.email.trim();

  if (fullName.length < 2 || fullName.length > 60) {
    return 'El nombre debe tener entre 2 y 60 caracteres.';
  }

  if (!FULL_NAME_RE.test(fullName)) {
    return 'El nombre solo puede contener letras y espacios.';
  }

  if (!NICKNAME_RE.test(nickname)) {
    return 'El apodo debe tener 3-20 caracteres, solo minusculas, numeros, punto o guion bajo.';
  }

  if (!EMAIL_RE.test(email)) {
    return 'Ingresa un correo valido.';
  }

  if (!isStrongPassword(input.password)) {
    return 'La contraseña debe tener 8-64 caracteres, mayuscula, minuscula, numero y simbolo.';
  }

  if (input.password !== input.confirmPassword) {
    return 'Las contraseñas no coinciden.';
  }

  return null;
}
