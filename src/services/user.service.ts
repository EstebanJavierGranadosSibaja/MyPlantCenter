import {
  UserProfile,
  EditProfileDTO,
  UpdatePrivacyDTO,
  UpdateNotificationsDTO,
  ApiResponse,
} from '../types-dtos/user.types';

// ── Datos mock ────────────────────────────────────────────────────────────────

const MOCK_USER: UserProfile = {
  id:            'user-001',
  nombre:        'María Fernández',
  apodo:         '@mariaverde',
  descripcion:   'Amante de las plantas tropicales 🌿 Construyendo mi jardín desde 2021.',
  cumpleanos:    '14 de Marzo',
  fechaRegistro: '2021-06-01',

  nivel: {
    nivel:  12,
    titulo: 'Jardinera Experta',
    xp:     840,
    xpMax:  1000,
  },

  stats: {
    cantidadPlantas: 47,
    cantidadAmigos:  128,
    racha:           34,
    rachaMejor:      60,
    riegosHoy:       8,
    diasActivo:      127,
  },

  plantaFavorita: {
    id:        'plant-001',
    nombre:    'Monstera Deliciosa',
    emoji:     '🌿',
    categoria: 'Tropical',
  },

  categorias: [
    { id: 'cat-1', nombre: 'Tropicales', emoji: '🌴', color: '#2D6A4F', cantidad: 14 },
    { id: 'cat-2', nombre: 'Suculentas', emoji: '🪴', color: '#52B788', cantidad: 11 },
    { id: 'cat-3', nombre: 'Helechos',   emoji: '🌿', color: '#A8C686', cantidad: 8  },
    { id: 'cat-4', nombre: 'Cactáceas',  emoji: '🌵', color: '#3B8A6E', cantidad: 7  },
    { id: 'cat-5', nombre: 'Aromáticas', emoji: '🌾', color: '#4A9E78', cantidad: 5  },
    { id: 'cat-6', nombre: 'Acuáticas',  emoji: '💧', color: '#1A6B4A', cantidad: 2  },
  ],

  logros: [
    { id: 'logro-1', titulo: 'Primera planta',    descripcion: 'Identificaste tu primera especie', emoji: '🌱', ganado: true,  fechaObtenido: '2021-06-02' },
    { id: 'logro-2', titulo: 'Riego constante',   descripcion: '7 días seguidos de cuidado',       emoji: '💧', ganado: true,  fechaObtenido: '2021-06-09' },
    { id: 'logro-3', titulo: 'Botánica experta',  descripcion: 'Identifica 50 especies',           emoji: '🔬', ganado: true,  fechaObtenido: '2022-03-15' },
    { id: 'logro-4', titulo: 'Jardín centenario', descripcion: 'Registra 100 plantas',             emoji: '🌳', ganado: false },
    { id: 'logro-5', titulo: 'Maestro del jardín',descripcion: 'Completa todos los logros',        emoji: '🏆', ganado: false },
  ],

  privacidad: {
    perfilPublico:       true,
    mostrarRacha:        true,
    mostrarCumpleanos:   false,
    permitirSolicitudes: true,
  },

  notificaciones: {
    recordatoriosRiego:   true,
    alertasSalud:         true,
    nuevosAmigos:         false,
    logrosDesbloqueados:  true,
  },
};

// ── Función auxiliar ──────────────────────────────────────────────────────────
// Simula el tiempo que tarda el servidor en responder.
// Así podemos probar los estados de "cargando..." en la UI.

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Servicio ──────────────────────────────────────────────────────────────────

export const userService = {

  // Obtener el perfil completo
  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    // userId: string → recibe el id como string
    // Promise<ApiResponse<UserProfile>> → va a devolver (en el futuro) un ApiResponse que contiene un UserProfile

    await delay(600);   // simula 600ms de espera del servidor

    // TODO: reemplazar con GET /api/users/:userId/profile cuando tengas backend, 
    // iría algo como: const response = await fetch(`/api/users/${userId}`)
    return {
      success: true,
      data: { ...MOCK_USER, id: userId },
    };
  },

  // Actualizar datos básicos del perfil
  async updateProfile(
    userId: string,
    dto: EditProfileDTO,
  ): Promise<ApiResponse<UserProfile>> {

    await delay(500);

    // TODO: reemplazar con PATCH /api/users/:userId/profile
    const updated: UserProfile = {
      ...MOCK_USER,   // copia todo el perfil actual
      ...dto,         // sobreescribe solo los campos que vienen en el DTO
    };
    return { success: true, data: updated };
  },

  // Actualizar configuración de privacidad
  async updatePrivacy(
    userId: string,
    dto: UpdatePrivacyDTO,
  ): Promise<ApiResponse<UserProfile>> {

    await delay(300);

    // TODO: reemplazar con PATCH /api/users/:userId/privacy
    const updated: UserProfile = {
      ...MOCK_USER,
      privacidad: {
        ...MOCK_USER.privacidad,   // copia la privacidad actual
        ...dto.privacidad,         // sobreescribe solo los campos que cambiaron
      },
    };
    return { success: true, data: updated };
  },

  // Actualizar notificaciones
  async updateNotifications(
    userId: string,
    dto: UpdateNotificationsDTO,
  ): Promise<ApiResponse<UserProfile>> {

    await delay(300);

    // TODO: reemplazar con PATCH /api/users/:userId/notifications
    const updated: UserProfile = {
      ...MOCK_USER,
      notificaciones: {
        ...MOCK_USER.notificaciones,
        ...dto.notificaciones,
      },
    };
    return { success: true, data: updated };
  },
};