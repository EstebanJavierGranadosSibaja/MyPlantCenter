import {
  LoginSchema,
  RegisterSchema,
  validateLoginInput,
  validateRegisterInput,
} from '../features/auth/validators/auth.validators';

// ---------------------------------------------------------------------------
// LoginSchema
// ---------------------------------------------------------------------------

describe('LoginSchema', () => {
  it('rechaza correo vacío', () => {
    const result = LoginSchema.safeParse({ email: '', password: 'Passw0rd!' });
    expect(result.success).toBe(false);
  });

  it('rechaza correo con formato inválido', () => {
    const result = LoginSchema.safeParse({ email: 'no-es-un-correo', password: 'Passw0rd!' });
    expect(result.success).toBe(false);
  });

  it('rechaza contraseña con menos de 8 caracteres', () => {
    const result = LoginSchema.safeParse({ email: 'user@test.com', password: '1234' });
    expect(result.success).toBe(false);
  });

  it('acepta credenciales válidas', () => {
    const result = LoginSchema.safeParse({ email: 'user@test.com', password: 'contraseña123' });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// validateLoginInput
// ---------------------------------------------------------------------------

describe('validateLoginInput', () => {
  it('retorna mensaje de error cuando el correo está vacío', () => {
    const error = validateLoginInput({ email: '', password: 'Passw0rd!' });
    expect(error).not.toBeNull();
    expect(typeof error).toBe('string');
  });

  it('retorna null para credenciales válidas', () => {
    const error = validateLoginInput({ email: 'valido@correo.com', password: 'Passw0rd123' });
    expect(error).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// RegisterSchema
// ---------------------------------------------------------------------------

describe('RegisterSchema', () => {
  const datosValidos = {
    fullName: 'Juan Pérez',
    nickname: 'juanp_23',
    email: 'juan@test.com',
    password: 'Passw0rd!',
    confirmPassword: 'Passw0rd!',
  };

  it('acepta datos de registro válidos', () => {
    const result = RegisterSchema.safeParse(datosValidos);
    expect(result.success).toBe(true);
  });

  it('rechaza cuando las contraseñas no coinciden', () => {
    const result = RegisterSchema.safeParse({
      ...datosValidos,
      confirmPassword: 'DiferentePas1!',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza contraseña sin letra mayúscula', () => {
    const result = RegisterSchema.safeParse({
      ...datosValidos,
      password: 'passw0rd!',
      confirmPassword: 'passw0rd!',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza nickname con espacios o caracteres especiales no permitidos', () => {
    const result = RegisterSchema.safeParse({
      ...datosValidos,
      nickname: 'nick invalido!',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza nombre completo de un solo carácter', () => {
    const result = RegisterSchema.safeParse({
      ...datosValidos,
      fullName: 'A',
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// validateRegisterInput
// ---------------------------------------------------------------------------

describe('validateRegisterInput', () => {
  it('retorna null para datos de registro válidos', () => {
    const error = validateRegisterInput({
      fullName: 'Ana López',
      nickname: 'ana_lopez',
      email: 'ana@correo.com',
      password: 'Segura1!',
      confirmPassword: 'Segura1!',
    });
    expect(error).toBeNull();
  });

  it('retorna mensaje de error cuando la contraseña no contiene símbolo especial', () => {
    const error = validateRegisterInput({
      fullName: 'Ana López',
      nickname: 'ana_lopez',
      email: 'ana@correo.com',
      password: 'Segura1Abc',
      confirmPassword: 'Segura1Abc',
    });
    expect(error).not.toBeNull();
  });
});
