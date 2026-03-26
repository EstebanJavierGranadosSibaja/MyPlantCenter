# MyPlantCenter — Design System Audit & Refinement Prompt
> Copilot / Codex 5.3 — Full Codebase Pass

---

## ROLE & OBJECTIVE

You are a senior mobile UI/UX engineer performing a complete design audit and refinement of **MyPlantCenter**, a React Native + Expo + TypeScript app. Your output must feel like it was designed by a single engineer from the start — no patchwork, no inconsistencies.

---

## PROJECT STRUCTURE (read-only reference)

```
src/
├── auth/AuthContext.tsx
├── components/
│   ├── common/
│   │   ├── ConfirmActionModal/ConfirmActionModal.styles.ts
│   │   ├── ConfirmActionModal/ConfirmActionModal.tsx
│   │   ├── StatRow/StatRow.styles.ts
│   │   └── StatRow/StatRow.tsx
│   ├── layout/
│   │   ├── CustomSafeArea.styles.ts
│   │   └── CustomSafeArea.tsx
│   ├── navigation/
│   │   ├── AppHeader/AppHeader.styles.ts
│   │   ├── AppHeader/AppHeader.tsx
│   │   └── AppTabBar.styles.ts
│   ├── plant/
│   │   ├── CategoryBadge/CategoryBadge.styles.ts
│   │   └── CategoryBadge/CategoryBadge.tsx
│   └── ui/
│       ├── Avatar/{Avatar.styles.ts, Avatar.tsx}
│       ├── Badge/{Badge.styles.ts, Badge.tsx}
│       ├── ProgressBar/{ProgressBar.styles.ts, ProgressBar.tsx}
│       └── Toggle/{Toggle.styles.ts, Toggle.tsx}
├── context/ThemeContext.tsx
├── hooks/{useConfirmAction.ts, useProfileViewState.ts, useUserProfile.ts}
├── navigation/AppNavigator.tsx
├── screens/
│   ├── Dashboard/{Dashboard.styles.ts, Dashboard.tsx}
│   ├── Explore/{Explore.styles.ts, Explore.tsx}
│   ├── Login/{Login.styles.ts, Login.tsx}
│   ├── Register/{Register.styles.ts, Register.tsx}
│   └── ProfileView/
│       ├── components/{FollowButton.tsx, ProfileViewHeader.tsx, ProfileViewStates.tsx, ProfileViewStats.tsx, ProfileViewTabs.tsx}
│       ├── profile/
│       │   ├── ProfileHero/{ProfileHero.styles.ts, ProfileHero.tsx, components/...}
│       │   ├── ProfileTabs/{ProfileTabs.styles.ts, ProfileTabs.tsx}
│       │   ├── TabAjustes/{TabAjustes.styles.ts, TabAjustes.tsx, components/AccountActionItem.tsx}
│       │   ├── TabCategorias/{TabCategorias.styles.ts, TabCategorias.tsx}
│       │   └── TabPerfil/{TabPerfil.styles.ts, TabPerfil.tsx}
│       ├── ProfileView.styles.ts
│       └── ProfileView.tsx
├── services/...
├── theme/designSystem.ts
└── types-dtos/user.types.ts
```

---

## DESIGN SYSTEM — SOURCE OF TRUTH

**File:** `src/theme/designSystem.ts`
**Context type:** `AppTheme`
**Theme hook:** `useAppThemeContext` from `src/context/ThemeContext.tsx`

### Colors (theme.colors.*)
- **Background:** `background`, `backgroundAlt`, `surface`
- **Brand:** `primary`, `primaryLight`, `accent`, `accentSoft`
- **Text:** `textPrimary`, `textSecondary`, `textMuted`, `textInverse`
- **Hero zone:** `heroBg`, `heroText`, `heroAccent`, `heroInputBg`, `heroInputBgSubtle`, `heroInputBorder`, `heroInputBorderSubtle`, `heroTextSubtle`, `heroAccentMuted`
- **Component tokens:** `cardBg`, `cardBorder`, `tabActive`, `tabInactive`, `tabBg`, `toggleActive`, `toggleInactive`, `toggleThumbActive`, `toggleThumbInactive`
- **Semantic actions:** `logroActiveBg`, `logroActiveBorder`, `favPlantIconBg`, `actionExport`, `actionPassword`, `actionLogout`, `actionDelete`
- **Global:** `border`, `success`, `warning`, `error`, `trackColor`

### Spacing (theme.spacing.*)
`xs:4` `sm:8` `md:12` `lg:18` `xl:24` `2xl:32` `3xl:40` `4xl:48` `5xl:56` `6xl:64`

### Radius (theme.radius.*)
`xs:6` `sm:10` `md:16` `lg:24` `xl:28` `full:9999`

### Typography (theme.typography.*)
**Families:**
- Display (Playfair): `displayRegular`, `displayItalic`, `displayBold`, `displayBoldItalic`
- Body (DM Sans): `bodyLight`, `bodyRegular`, `bodyMedium`, `bodySemiBold`, `bodyBold`

**Sizes:** `xs:10` `sm:11` `base:12` `md:13` `lg:14` `xl:15` `2xl:16` `3xl:18` `4xl:20` `5xl:22` `6xl:26`

**LineHeights:** `tight:16` `snug:20` `normal:24` `relaxed:28` `loose:32`

### Layout (theme.layout.*)
`screenPaddingH:24` `screenPaddingV:20` `heroPaddingTop:48` `heroPaddingBottom:72`
`statsCardOverlap:-30` `avatarSm:40` `avatarMd:60` `avatarLg:80` `avatarOnlineDotOffset:-6`
`avatarBadgeOffset:-6` `favIconSize:56` `categoryIconSize:36` `chartHeight:80`
`chartBarMin:8` `chartBarRadius:5` `toggleTrackW:44` `toggleTrackH:24`
`toggleThumbSz:18` `toggleThumbOff:3` `tabBarRadius:14` `tabBarPadding:4`
`logroSize:52` `headerHeight:65` `modalActionMinWidth:96`

### Borders (theme.borders.*)
`thin:0.5` `base:1` `thick:1.5` `bold:2`

### Opacity (theme.opacity.*)
`disabled:0.45` `medium:0.25` `light:0.12` `overlay:0.50` `subtle:0.08`

### Shadows (theme.shadows.*)
Use `theme.shadows.sm`, `theme.shadows.md`, `theme.shadows.lg` — never hardcode shadow values.

---

## MANDATORY CODE PATTERN

Every `.styles.ts` file must follow this exact pattern — no exceptions:

```ts
import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme/designSystem'; // adjust relative path
import { useAppThemeContext } from '../../context/ThemeContext'; // adjust relative path

export const createXxxStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // all styles here, fully token-driven
  });

export function useXxxTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createXxxStyles(theme) };
}
```

**Import rules:**
- `AppTheme` always from `src/theme/designSystem`
- `useAppThemeContext` always from `src/context/ThemeContext`
- Never use `useColorScheme` directly in component files
- Never call `getAppTheme()` manually outside of ThemeContext

---

## STEP 1: DEEP AUDIT

Scan **every file** in `src/screens/`, `src/components/`, `src/navigation/`. For each file, identify and report:

### A — CRITICAL: Hardcoded values
Flag every value that bypasses the design system:
- Hex colors: `'#1A3A2A'`, `'white'`, `'black'`, `'#fff'`, etc.
- Inline `rgba()` that is not a justified exception (see exceptions below)
- Spacing numbers: `margin: 16`, `padding: 24`, `gap: 8` — any number not via `theme.spacing.*`
- Font sizes: `fontSize: 14` not via `theme.typography.size.*`
- Border radius: `borderRadius: 12` not via `theme.radius.*`
- Font family strings: `fontFamily: 'DMSans-Regular'` not via `theme.typography.family.*`
- Shadow values defined inline instead of via `theme.shadows.*`

**Justified exceptions** (do NOT flag these):
- `rgba` values inside `heroInputBg`, `heroInputBgSubtle` — already tokens
- `theme.colors.trackColor` which is `'#ffffff1c'` — used for XP bar track
- `letterSpacing` numeric values (1.4, 0.4, etc.) — not in design system by design
- `animationDuration` / `duration` values like `220` — animation timing
- Decorative leaf/art coordinate positions

### B — MAJOR: Inconsistent patterns
- Border widths mixing `1`, `1.5`, `2` — must use `theme.borders.*`
- Border colors mixing `theme.colors.border` and `theme.colors.cardBorder` inconsistently
- Buttons with different `paddingVertical` values across the app
- Section titles with different `fontSize`, `letterSpacing`, or `textTransform`
- Cards missing shadow or using different shadow values
- Inputs with different heights or `paddingHorizontal` across screens
- `.styles.ts` files that don't export `useXxxTheme()` hook

### C — MINOR: Visual hierarchy deviations
- Text sizes skipping scale steps (e.g. jumping xs→3xl)
- Display font used for body copy or metadata
- Body font used for names, titles, or large numbers (should be Display)
- Icon sizes mismatched with adjacent text size
- Missing `marginBottom: theme.spacing.sm` on section titles
- Screen padding using `theme.spacing.xl` instead of `theme.layout.screenPaddingH`

### D — Dark/Light mode breakages
- Any hardcoded color that won't adapt to theme changes
- Components that look fine in dark but break in light (or vice versa)

---

## STEP 2: VISUAL CONSISTENCY RULES

Apply these exact patterns across every component:

### Cards
```ts
backgroundColor: theme.colors.cardBg,
borderRadius: theme.radius.md,
borderWidth: theme.borders.thick,        // 1.5
borderColor: theme.colors.border,
padding: theme.spacing.lg,
shadowColor: theme.shadows.sm.color,
shadowOffset: theme.shadows.sm.offset,
shadowOpacity: theme.shadows.sm.opacity,
shadowRadius: theme.shadows.sm.radius,
elevation: theme.shadows.sm.elevation,
```

### Section titles (uppercase labels above content blocks)
```ts
fontFamily: theme.typography.family.bodySemiBold,
fontSize: theme.typography.size.xs,
color: theme.colors.textMuted,
letterSpacing: 1.4,
textTransform: 'uppercase',
marginBottom: theme.spacing.sm,
```

### Primary action buttons
```ts
// Container
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
gap: theme.spacing.sm,
backgroundColor: theme.colors.primary,
borderRadius: theme.radius.md,
paddingVertical: theme.spacing.md + 3,   // 15
paddingHorizontal: theme.spacing.xl,

// Label
fontFamily: theme.typography.family.bodySemiBold,
fontSize: theme.typography.size.lg,
color: theme.colors.accentSoft,
letterSpacing: 0.4,
```

### Secondary / outlined buttons
```ts
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
gap: theme.spacing.sm,
backgroundColor: theme.colors.cardBg,
borderRadius: theme.radius.md,
paddingVertical: theme.spacing.md + 3,
paddingHorizontal: theme.spacing.xl,
borderWidth: theme.borders.thick,        // 1.5
borderColor: theme.colors.border,
```

### Input fields
```ts
// Wrapper
flexDirection: 'row',
alignItems: 'center',
backgroundColor: theme.colors.cardBg,
borderRadius: theme.radius.md,
borderWidth: theme.borders.thick,
borderColor: theme.colors.border,
paddingHorizontal: theme.spacing.md,
gap: theme.spacing.sm,

// TextInput
flex: 1,
fontFamily: theme.typography.family.bodyRegular,
fontSize: theme.typography.size.lg,
color: theme.colors.textPrimary,
paddingVertical: theme.spacing.md,
```

### Dividers
```ts
height: theme.borders.base,              // 1
backgroundColor: theme.colors.border,
// NO marginVertical — let parent control spacing
```

### Icon + text row alignment
| Text role | Font size token | Icon size |
|---|---|---|
| Body | `size.lg` (14) | `size.lg` |
| Section label | `size.xs` (10) | `size.sm` |
| Card title | `size['2xl']` (16) | `size['2xl']` |

### Screen padding
Always `theme.layout.screenPaddingH` for horizontal — never `theme.spacing.xl`.

---

## STEP 3: TYPOGRAPHY HIERARCHY

Enforce this table across every screen and component:

| Role | Family | Size token | Value |
|---|---|---|---|
| Screen / section name | `displayBold` | `4xl` | 20 |
| Card title / person name | `displayBold` | `2xl` | 16 |
| Stat value / number | `displayBold` | `4xl` | 20 |
| Body text / description | `bodyRegular` | `lg` | 14 |
| Button label | `bodySemiBold` | `lg` | 14 |
| Input text | `bodyRegular` | `lg` | 14 |
| Label / caption | `bodySemiBold` | `base` | 12 |
| Section header | `bodySemiBold` | `xs` | 10 + uppercase |
| Badge / tag | `bodySemiBold` | `xs`–`sm` | 10–11 |
| Subtitle / metadata | `bodyRegular` | `base`–`md` | 12–13 |

---

## STEP 4: SPACING RHYTHM

| Context | Token | Value |
|---|---|---|
| Between top-level sections | `theme.spacing.xl` | 24 |
| Between related items in a section | `theme.spacing.md` | 12 |
| Between tightly coupled elements | `theme.spacing.sm` | 8 |
| Inside cards / containers | `theme.spacing.lg` | 18 |
| Icon ↔ text gap | `theme.spacing.sm` | 8 |
| Gap between list items | `theme.spacing.sm + 2` | 10 (arithmetic allowed) |
| Screen horizontal padding | `theme.layout.screenPaddingH` | 24 |

---

## STEP 5: BORDER RADIUS HIERARCHY

| Element | Token | Value |
|---|---|---|
| Full pill / badge | `full` | 9999 |
| Modal / bottom sheet | `xl` | 28 |
| Card / large container | `md` | 16 |
| Button / input | `md` | 16 |
| Small button / chip | `sm` | 10 |
| Progress bar fill | `xs` | 6 |
| Icon container | `sm` | 10 |

---

## STEP 6: EMPTY STATE SYSTEM (CREATE FROM SCRATCH)

No empty state component exists in the codebase. Create a reusable `EmptyState` component and apply it everywhere data may be absent.

### Create: `src/components/common/EmptyState/EmptyState.tsx`

Props interface:
```ts
interface EmptyStateProps {
  iconName: FeatherIconName;       // from @expo/vector-icons Feather
  title: string;                   // displayBold, size 2xl
  subtitle?: string;               // bodyRegular, size md, textMuted
  actionLabel?: string;            // if present, render a primary button
  onAction?: () => void;
}
```

Visual spec:
- Centered vertically and horizontally within its parent container
- Icon circle: size 72, `backgroundColor: theme.colors.backgroundAlt`, `borderRadius: theme.radius.full`
- Icon inside circle: size 40, `color: theme.colors.textMuted`
- Gap between icon circle and title: `theme.spacing.lg`
- Gap between title and subtitle: `theme.spacing.sm`
- Gap between subtitle and button: `theme.spacing.xl`
- Button follows the Primary action button pattern from Step 2

### Create: `src/components/common/EmptyState/EmptyState.styles.ts`
Must follow the mandatory `.styles.ts` pattern.

### Apply EmptyState to these locations:

| Location | Condition | iconName | title | subtitle |
|---|---|---|---|---|
| `TabPerfil` — logros section | `achievements.length === 0` | `"award"` | `"Sin logros aún"` | `"Completa acciones para desbloquear logros"` |
| `TabCategorias` | `categories.length === 0` | `"grid"` | `"Sin categorías"` | `"Agrega tu primera categoría de plantas"` |
| `Dashboard` | loading done, no plants | `"sun"` | `"Todo listo"` | `"Agrega plantas para ver tu resumen"` |
| `Explore` | search done, no results | `"search"` | `"Sin resultados"` | `"Intenta con otro término de búsqueda"` |

---

## STEP 7: PROFILE SCREEN — EMPTY vs POPULATED DATA

The `ProfileView` screen must handle both states gracefully.

### Empty / loading state:
- **Avatar:** placeholder circle — `backgroundColor: theme.colors.backgroundAlt`, Feather `"user"` icon, `color: theme.colors.textMuted`, size = `theme.layout.avatarLg`
- **Name:** skeleton bar — `height: theme.typography.lineHeight.relaxed`, `width: '60%'`, `backgroundColor: theme.colors.backgroundAlt`, `borderRadius: theme.radius.sm`
- **Nickname / description:** same skeleton pattern, widths `'40%'` and `'80%'` respectively
- **Stats cards (PLANTAS / AMIGOS / RACHA):** always render, showing `0` — do NOT hide when value is zero
- **XP bar:** render at 0% fill, still display `"0/100 XP"` label
- **Categories tab:** render `EmptyState` with `"grid"` icon
- **Logros tab:** render `EmptyState` with `"award"` icon

### Populated state:
- Avatar: `avatarUrl` image, `borderRadius: theme.radius.full`
- Name: `displayBold`, `size['4xl']`, `color: theme.colors.textPrimary`
- Nickname: `@handle`, `bodyRegular`, `size.md`, `color: theme.colors.textMuted`
- Description: `bodyRegular`, `size.lg`, `color: theme.colors.textSecondary`, max 2 lines with ellipsis
- Badge (rank title): use `Badge` component, `borderRadius: theme.radius.full`
- XP bar: `ProgressBar` component, fill = `(xp / xpMax) * 100`%
- Categories: 2-column grid of category cards
- Logros: flat list of achievement items

---

## EXECUTION ORDER

Execute in this exact sequence:

1. **Audit** — scan every file, produce grouped report (CRITICAL / MAJOR / MINOR)
2. **Fix CRITICAL** — replace all hardcoded values with design system tokens
3. **Fix MAJOR** — apply card, button, input, section title consistency patterns
4. **Fix MINOR** — typography hierarchy, spacing rhythm, radius hierarchy
5. **Create EmptyState** — `EmptyState.tsx` + `EmptyState.styles.ts`
6. **Apply EmptyState** — plug into all 4 locations listed in Step 6
7. **Fix Profile states** — handle empty + populated data in `ProfileView` and sub-components
8. **Dark/Light verification** — confirm every modified file uses only theme tokens

---

## ABSOLUTE CONSTRAINTS

### NEVER:
- Hardcode a color, spacing value, font size, border radius, or font family string
- Modify `src/theme/designSystem.ts` structure or `AppTheme` interface
- Add new npm packages
- Create color values outside the design system
- Use `StyleSheet.create` with static color values (must go through theme factory)
- Export a `.styles.ts` file without a `useXxxTheme()` hook

### ALWAYS:
- `theme.layout.*` for structural sizes (avatar, icon, header)
- `theme.spacing.*` for all gap / padding / margin
- `theme.radius.*` for all `borderRadius`
- `theme.typography.family.*` for all `fontFamily`
- `theme.typography.size.*` for all `fontSize`
- `theme.typography.lineHeight.*` for all `lineHeight`
- `theme.borders.*` for all `borderWidth`
- `theme.shadows.*` for all shadow props
- `theme.opacity.*` for opacity values where applicable

---

## OUTPUT FORMAT

After completing all steps, produce this summary:

```
## Audit Summary

### CRITICAL (n issues)
- [file]: [description]

### MAJOR (n issues)
- [file]: [description]

### MINOR (n issues)
- [file]: [description]

## Files Modified
- [every file touched]

## Files Created
- src/components/common/EmptyState/EmptyState.tsx
- src/components/common/EmptyState/EmptyState.styles.ts

## Remaining Issues (require design decisions)
- [anything unresolvable with current tokens]
```