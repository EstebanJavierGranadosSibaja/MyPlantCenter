import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Text,
  StyleSheet,
} from 'react-native';

// ── Tema ──────────────────────────────────────────────────────────────────────
import { colors }          from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { textStyles }      from '../../theme/typography';

// ── Tipos ─────────────────────────────────────────────────────────────────────
import { EditProfileDTO } from '../../types-dtos/user.types';

// ── Hook ──────────────────────────────────────────────────────────────────────
import { useUserProfile } from '../../hooks/useUserProfile';

// ── Componentes de esta pantalla ──────────────────────────────────────────────
import { ProfileHero }  from './components/ProfileHero';
import { ProfileTabs, ProfileTab } from './components/ProfileTabs';
import { TabPerfil }    from './components/TabPerfil';
import { TabCategorias} from './components/TabCategorias';
import { TabAjustes }   from './components/TabAjustes';

// ── Componentes globales ──────────────────────────────────────────────────────
import { StatRow } from '../../components/common/StatRow/StatRow';

// ── Componente ────────────────────────────────────────────────────────────────

export default function UserProfile() {

  // ── Datos del servidor ────────────────────────────────────────────────────
  const {
    profile,
    loading,
    saving,
    updateProfile,
    updatePrivacy,
    updateNotifications,
  } = useUserProfile('user-001');

  // ── Estado local ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ProfileTab>('perfil');
  const [editMode,  setEditMode]  = useState(false);
  const [draft,     setDraft]     = useState<EditProfileDTO | null>(null);

  useEffect(() => {
    if (profile && !draft) {
      setDraft({
        nombre:      profile.nombre,
        apodo:       profile.apodo,
        descripcion: profile.descripcion,
        cumpleanos:  profile.cumpleanos,
        ubicacion:   profile.ubicacion,
      });
    }
  }, [profile]);

  // ── Manejadores ───────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!draft) return;
    await updateProfile(draft);
    setEditMode(false);
  };

  // ── Estado de carga ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />
      </SafeAreaView>
    );
  }

  if (!profile || !draft) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>
          No se pudo cargar el perfil.
        </Text>
      </SafeAreaView>
    );
  }

  // ── Datos derivados ───────────────────────────────────────────────────────

  const statItems = [
    { emoji: '🌿', value: profile.stats.cantidadPlantas,              label: 'Plantas' },
    { emoji: '🔥', value: `${profile.stats.racha}d`,                  label: 'Racha'   },
    { emoji: '👥', value: profile.stats.cantidadAmigos,               label: 'Amigos'  },
    { emoji: '🏅', value: profile.logros.filter(l => l.ganado).length, label: 'Logros' },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Hero — sección oscura con avatar, nombre y XP */}
        <ProfileHero
          profile       ={profile}
          editMode      ={editMode}
          saving        ={saving}
          draft         ={draft}
          onEdit        ={() => setEditMode(true)}
          onSave        ={handleSave}
          onDraftChange ={setDraft}
        />

        {/* Stats card — flota sobre el hero con marginTop negativo */}
        <View style={styles.statsCard}>
          <StatRow items={statItems} />
        </View>

        {/* Barra de tabs */}
        <ProfileTabs
          activeTab   ={activeTab}
          onTabChange ={setActiveTab}
        />

        {/* Contenido del tab activo */}
        {activeTab === 'perfil' && (
          <TabPerfil
            profile       ={profile}
            editMode      ={editMode}
            saving        ={saving}
            draft         ={draft}
            onDraftChange ={setDraft}
            onSave        ={handleSave}
          />
        )}

        {activeTab === 'categorias' && (
          <TabCategorias
            categorias      ={profile.categorias}
            cantidadPlantas ={profile.stats.cantidadPlantas}
          />
        )}

        {activeTab === 'ajustes' && (
          <TabAjustes
            privacidad            ={profile.privacidad}
            notificaciones        ={profile.notificaciones}
            onUpdatePrivacy       ={updatePrivacy}
            onUpdateNotifications ={updateNotifications}
          />
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[10] + spacing[5],
  },
  statsCard: {
    marginHorizontal: spacing[4],
    marginTop:        -(spacing[7] + spacing[1]),
    // marginTop negativo → la card sube y se superpone al hero
    // spacing[7] + spacing[1] = 28 + 4 = 32... ajustamos a 30
    zIndex:           2,
  },
  centered: {
    flex:            1,
    backgroundColor: colors.background,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         layout.screenH,
  },
  errorText: {
    ...textStyles.body,
    color:     colors.error,
    textAlign: 'center',
  },
});