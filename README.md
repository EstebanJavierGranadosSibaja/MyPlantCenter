# 🌿 MyPlantCenter

Aplicación móvil de gestión de plantas y comunidad verde, desarrollada con **React Native** y **Expo**. Permite a los usuarios gestionar su colección de plantas, ver estadísticas de cuidado, administrar su perfil y personalizar la experiencia con temas claro/oscuro.

---

## Tabla de Contenidos

1. [Stack Tecnológico](#stack-tecnológico)
2. [Instalación y Ejecución](#instalación-y-ejecución)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Arquitectura y Patrones](#arquitectura-y-patrones)
5. [Navegación](#navegación)
6. [Pantallas](#pantallas)
7. [Componentes](#componentes)
8. [Sistema de Diseño (Design System)](#sistema-de-diseño-design-system)
9. [Gestión de Estado y Datos](#gestión-de-estado-y-datos)
10. [Tipos y DTOs](#tipos-y-dtos)

---

## Stack Tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| React Native | 0.81.5 | Framework de UI multiplataforma |
| Expo | 54.0.33 | Plataforma de desarrollo y build |
| TypeScript | 5.9.2 | Tipado estático |
| React Navigation | 7.x | Navegación (Stack + Tabs) |
| React Native Reanimated | 4.1.1 | Animaciones fluidas a 60fps |
| Expo Vector Icons | — | Iconografía (Feather icons) |

**Plataformas destino:** iOS y Android (orientación vertical).

---

## Instalación y Ejecución

### Prerrequisitos

- Node.js (v18 o superior)
- npm
- Expo Go instalado en un dispositivo físico, o un emulador Android / simulador iOS configurado

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd MyPlantCenter

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start
```

Se abrirá Expo Dev Tools. Desde ahí se puede abrir la app en:
- **Expo Go** (escanear QR desde el dispositivo)
- **Emulador Android** (tecla `a`)
- **Simulador iOS** (tecla `i`, solo en macOS)

---

## Estructura del Proyecto

```
MyPlantCenter/
├── app/
│   └── index.tsx                    # Punto de entrada (proveedores + navegador)
│
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Definición de rutas (Stack + Tabs)
│   │
│   ├── screens/
│   │   ├── Dashboard/               # Pantalla de inicio
│   │   ├── Explore/                 # Pantalla de exploración (próximamente)
│   │   └── UserProfile/             # Perfil de usuario con pestañas
│   │       └── components/          # Subcomponentes del perfil
│   │           ├── ProfileHero/
│   │           ├── ProfileTabs/
│   │           ├── TabPerfil/
│   │           ├── TabCategorias/
│   │           └── TabAjustes/
│   │
│   ├── components/
│   │   ├── ui/                      # Componentes atómicos reutilizables
│   │   │   ├── Avatar/
│   │   │   ├── Badge/
│   │   │   ├── ProgressBar/
│   │   │   └── Toggle/
│   │   ├── common/                  # Componentes compuestos compartidos
│   │   │   └── StatRow/
│   │   ├── layout/                  # Wrappers de layout
│   │   │   └── CustomSafeArea
│   │   ├── navigation/              # Componentes de navegación
│   │   │   ├── AppHeader/
│   │   │   └── AppTabBar.styles.ts
│   │   └── plant/                   # Componentes específicos de plantas
│   │       └── CategoryBadge/
│   │
│   ├── context/
│   │   └── ThemeContext.tsx          # Contexto de tema (claro/oscuro/sistema)
│   │
│   ├── hooks/
│   │   └── useUserProfile.ts        # Hook para datos y mutaciones del perfil
│   │
│   ├── services/
│   │   └── user.service.ts          # Capa de servicios (API simulada)
│   │
│   ├── theme/
│   │   └── designSystem.ts          # Tokens de diseño centralizados
│   │
│   └── types-dtos/
│       └── user.types.ts            # Interfaces TypeScript y DTOs
│
├── assets/images/                   # Recursos gráficos
├── app.json                         # Configuración de Expo
├── tsconfig.json                    # Configuración de TypeScript
└── package.json                     # Dependencias y scripts
```

> Cada componente y pantalla tiene su archivo de estilos separado (`.styles.ts`), siguiendo el principio de **separación de responsabilidades**.

---

## Arquitectura y Patrones

### Patrón de Componentes (Diseño Atómico)

La aplicación sigue una jerarquía inspirada en **Atomic Design**:

```
Átomos (ui/)     →  Avatar, Badge, ProgressBar, Toggle
Moléculas (common/) →  StatRow, CategoryBadge
Organismos         →  ProfileHero, ProfileTabs
Páginas (screens/) →  Dashboard, Explore, UserProfile
```

### Patrones Implementados

| Patrón | Descripción |
|---|---|
| **Theme-First Styling** | Todos los estilos referencian tokens del design system a través de `useAppThemeContext()` |
| **Separación de estilos** | Lógica en `.tsx`, estilos en `.styles.ts`, tipos en `.types.ts` |
| **Custom Hooks** | `useUserProfile()` encapsula toda la lógica de fetch y mutación de datos |
| **Capa de servicios mock** | `user.service.ts` simula llamadas API con delays realistas (500-600ms) |
| **Actualizaciones optimistas** | Los toggles actualizan la UI inmediatamente y revierten si hay error |
| **Composición sobre herencia** | Componentes pequeños que se componen en estructuras mayores |

---

## Navegación

La navegación se construye con **React Navigation v7** mediante un Stack principal con un Tab Navigator anidado:

```
RootStack (Stack Navigator)
│
├── MainTabs (Bottom Tab Navigator)
│   ├── "Dashboard"   → Pantalla de inicio     (icono: home)
│   └── "Explorar"    → Pantalla de búsqueda   (icono: search)
│
└── "Perfil"          → Perfil del usuario      (pantalla completa, sin tabs)
```

- Las **pestañas inferiores** se muestran en Dashboard y Explorar.
- El **perfil** se abre como pantalla completa (modal) desde el botón de avatar en el Dashboard, con botón de retroceso para volver.
- La navegación está **tipada con TypeScript** para seguridad en rutas y parámetros.

---

## Pantallas

### Dashboard (Inicio)

Pantalla principal con un saludo personalizado que cambia según la hora del día:

- ☀️ **Buenos días** (5:00 – 11:59)
- ⛅ **Buenas tardes** (12:00 – 17:59)
- 🌙 **Buenas noches** (18:00 – 4:59)

Incluye un botón de avatar en la esquina superior derecha que navega al perfil del usuario.

### Explorar

Pantalla de búsqueda y descubrimiento de plantas. Actualmente muestra un **placeholder** con el mensaje "Próximamente" — preparada para implementación futura.

### Perfil de Usuario

Pantalla completa con la información detallada del usuario, organizada en secciones:

#### ProfileHero (Encabezado)
- Avatar con indicador de nivel y estado en línea
- Nombre, apodo, y badges informativos (cumpleaños, amigos)
- Barra de progreso de XP animada
- Modo edición: los campos se convierten en TextInputs editables

#### StatRow (Estadísticas)
- 4 métricas en tarjetas: Plantas, Amigos, Racha, Rocios
- Cada métrica tiene icono, valor numérico y etiqueta

#### Pestañas del Perfil

| Pestaña | Contenido |
|---|---|
| **Perfil** | Descripción personal, planta favorita, cumpleaños, logros (desbloqueados resaltados) |
| **Categorías** | Lista de categorías de plantas con barras de progreso animadas + gráfico de barras de distribución |
| **Ajustes** | Selector de tema (claro/oscuro/sistema), toggles de privacidad y notificaciones |

---

## Componentes

### Componentes UI (Atómicos)

| Componente | Descripción | Props principales |
|---|---|---|
| **Avatar** | Imagen de usuario o icono de respaldo, con indicador de estado y badge de nivel | `uri`, `size`, `showLevelBadge`, `level` |
| **Badge** | Pill con icono opcional y texto, colores dinámicos | `label`, `iconName`, `color`, `size` |
| **ProgressBar** | Barra de progreso animada con Reanimated. Variantes: `XPBar`, `HealthBar` | `value`, `max`, `color`, `animDuration` |
| **Toggle** | Switch animado con interpolación de color, para opciones on/off | `value`, `onChange`, `label`, `description` |

### Componentes Comunes

| Componente | Descripción |
|---|---|
| **StatRow** | Fila de 4 estadísticas con iconos, valores y etiquetas en tarjeta elevada |
| **CategoryBadge** | Categoría de planta con icono coloreado, nombre, barra de progreso y conteo |

### Componentes de Layout y Navegación

| Componente | Descripción |
|---|---|
| **CustomSafeArea** | Wrapper de `SafeAreaView` con scroll opcional y color de fondo del tema |
| **AppHeader** | Header con fondo hero (verde oscuro), título, botón de retroceso opcional y slot derecho personalizable |

---

## Sistema de Diseño (Design System)

Todos los valores visuales están centralizados en `src/theme/designSystem.ts` como **tokens de diseño**.

### Paleta de Colores

**Modo Claro:**

| Token | Color | Uso |
|---|---|---|
| `primary` | `#234d38` | Color principal (encabezados, acciones) |
| `accent` | `#42946e` | Elementos interactivos |
| `accentSoft` | `#A8C686` | Acentos sutiles |
| `background` | `#F4F7F0` | Fondo general |
| `surface` | `#FFFFFF` | Tarjetas y superficies |
| `success` | `#52B788` | Estados exitosos |
| `warning` | `#F4A261` | Advertencias |
| `error` | `#E07A5F` | Errores |

**Modo Oscuro:** Contraste invertido con fondos oscuros y texto claro, acentos ajustados.

### Tipografía

- **Display (títulos):** PlayfairDisplay — Regular, Italic, Bold, BoldItalic
- **Body (cuerpo):** DM Sans — Light, Regular, Medium, SemiBold, Bold
- **Tamaños:** Escala de `xs` (10px) a `6xl` (26px)

### Espaciado

Escala progresiva: `5xs` (0.3px) → `6xl` (64px), con valores intermedios para control fino.

### Tema Dinámico

El `ThemeContext` permite alternar entre **claro**, **oscuro** y **sistema** (sigue la preferencia del dispositivo). El tema se propaga a todos los componentes vía `useAppThemeContext()`.

---

## Gestión de Estado y Datos

### Flujo de Datos

```
Vista (Screen/Component)
    ↓ usa
Hook (useUserProfile)
    ↓ llama
Servicio (user.service.ts)
    ↓ retorna
ApiResponse<UserProfile>
    ↓ actualiza
Estado local del Hook
    ↓ re-renderiza
Vista actualizada
```

### Capa de Servicios (`user.service.ts`)

Actualmente implementada como **mock** (datos simulados con delays de 500-600ms) para permitir el desarrollo sin backend. Los métodos disponibles son:

| Método | Descripción |
|---|---|
| `getProfile(userId)` | Obtiene el perfil completo del usuario |
| `updateProfile(userId, dto)` | Actualiza datos del perfil (nombre, apodo, descripción, etc.) |
| `updatePrivacy(userId, dto)` | Actualiza configuración de privacidad |
| `updateNotifications(userId, dto)` | Actualiza preferencias de notificaciones |

> La estructura de respuesta `ApiResponse<T>` permite una transición directa a una API real en el futuro.

### Hook `useUserProfile`

- **Carga automática** del perfil al montarse
- **Estados de carga** (`loading`, `saving`, `error`) para feedback en UI
- **Actualizaciones optimistas** en toggles (privacidad/notificaciones): la UI refleja el cambio inmediatamente y revierte si falla
- **Manejo de errores** con mensajes en español

---

## Tipos y DTOs

Definidos en `src/types-dtos/user.types.ts`:

### Modelo Principal

```typescript
UserProfile {
  id, name, nickname, description, birthday, registeredAt
  level: { level, title, xp, xpMax }
  stats: { plantsCount, friendsCount, streak, bestStreak, wateredToday, activeDays }
  favoritePlant: { id, name, iconName, category }
  categories: PlantCategory[]      // { id, name, iconName, color, amount }
  achievements: Achievement[]      // { id, title, description, iconName, unlocked, unlockedAt }
  privacy: PrivacySettings         // 4 flags booleanos
  notifications: NotificationSettings  // 4 flags booleanos
}
```

### DTOs de Mutación

| DTO | Campos |
|---|---|
| `EditProfileDTO` | name, nickname, description, birthday, location |
| `UpdatePrivacyDTO` | Parcial de PrivacySettings |
| `UpdateNotificationsDTO` | Parcial de NotificationSettings |

---

## Datos de Prueba

El servicio mock incluye un usuario de ejemplo con:
- **47 plantas** distribuidas en 6 categorías (Tropicales, Suculentas, Helechos, Cactus, Aromáticas, Acuáticas)
- **Nivel 50**, con 840/1000 XP
- **5 logros** (3 desbloqueados, 2 bloqueados)
- Configuraciones de privacidad y notificaciones activas

---

*Desarrollado con React Native + Expo — Curso de Plataformas Móviles, UNA 2026*
