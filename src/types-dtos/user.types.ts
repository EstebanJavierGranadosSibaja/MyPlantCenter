// ── Tipos simples ─────────────────────────────────────────────────────────────

// PrivacyLevel solo puede ser uno de estos dos valores exactos.
export type PrivacyLevel = 'publico' | 'privado';

// ── Categoría de planta ───────────────────────────────────────────────────────

export interface PlantCategory {
  id:       string;   // identificador único, ej: "cat-001"
  nombre:   string;   // ej: "Tropicales"
  emoji:    string;   // ej: "🌴"
  color:    string;   // ej: "#2D6A4F" — el color de su barra en el perfil
  cantidad: number;   // cuántas plantas tiene el usuario en esta categoría
}

// ── Planta favorita ───────────────────────────────────────────────────────────

export interface FavoritePlant {
  id:        string;
  nombre:    string;   // ej: "Monstera Deliciosa"
  emoji:     string;   // ej: "🌿"
  categoria: string;   // ej: "Tropical"
}

// ── Logro (achievement) ───────────────────────────────────────────────────────

export interface Achievement {
  id:             string;
  titulo:         string;    // ej: "Primera planta"
  descripcion:    string;    // ej: "Identificaste tu primera especie"
  emoji:          string;    // ej: "🌱"
  ganado:         boolean;   // true = desbloqueado, false = bloqueado
  fechaObtenido?: string;    // el ? significa que es OPCIONAL
}

// ── Configuración de privacidad ───────────────────────────────────────────────

export interface PrivacySettings {
  perfilPublico:       boolean;   // perfil visible para todos
  mostrarRacha:        boolean;   // mostrar días consecutivos
  mostrarCumpleanos:   boolean;   // mostrar fecha de nacimiento
  permitirSolicitudes: boolean;   // permitir que otros te agreguen
}

// ── Configuración de notificaciones ──────────────────────────────────────────

export interface NotificationSettings {
  recordatoriosRiego:   boolean;
  alertasSalud:         boolean;
  nuevosAmigos:         boolean;
  logrosDesbloqueados:  boolean;
}

// ── Estadísticas del usuario ──────────────────────────────────────────────────

export interface UserStats {
  cantidadPlantas: number;   // total de plantas registradas
  cantidadAmigos:  number;
  racha:           number;   // días consecutivos activos
  rachaMejor:      number;   // mejor racha histórica
  riegosHoy:       number;
  diasActivo:      number;   // días totales usando la app
}

// ── Nivel y experiencia ───────────────────────────────────────────────────────

export interface UserLevel {
  nivel:  number;   // número de nivel, ej: 12
  titulo: string;   // ej: "Jardinera Experta"
  xp:     number;   // experiencia actual, ej: 840
  xpMax:  number;   // experiencia necesaria para subir, ej: 1000
}

// ── Perfil completo del usuario ───────────────────────────────────────────────

export interface UserProfile {
  id:            string;
  nombre:        string;
  apodo:         string;         // el @handle, ej: "@mariaverde"
  descripcion:   string;
  avatarUrl?:    string;         // ? = opcional, puede no tener foto
  cumpleanos?:   string;         // ej: "14 de Marzo"
  ubicacion?:    string;
  fechaRegistro: string;         // fecha en que creó la cuenta (ISO: "2021-06-01")

  // Aquí se usan las interfaces que definimos arriba
  nivel:          UserLevel;
  stats:          UserStats;
  plantaFavorita?: FavoritePlant;     // puede no tener favorita aún
  categorias:     PlantCategory[];    
  logros:         Achievement[];

  privacidad:     PrivacySettings;
  notificaciones: NotificationSettings;
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

// Para editar datos básicos del perfil
export interface EditProfileDTO {
  nombre:       string;
  apodo:        string;
  descripcion:  string;
  cumpleanos?:  string;    // opcional — puede no querer poner su cumpleaños
  ubicacion?:   string;
}

// Para actualizar privacidad
// Así se puede mandar solo { perfilPublico: false } sin mandar los demás campos.
export interface UpdatePrivacyDTO {
  privacidad: Partial<PrivacySettings>;
}

// Para actualizar notificaciones
export interface UpdateNotificationsDTO {
  notificaciones: Partial<NotificationSettings>;
}

// ── Wrapper de respuesta del servidor ────────────────────────────────────────

export interface ApiResponse<T> {
  data:      T;
  success:   boolean;
  message?:  string;   // mensaje de error si success es false
}