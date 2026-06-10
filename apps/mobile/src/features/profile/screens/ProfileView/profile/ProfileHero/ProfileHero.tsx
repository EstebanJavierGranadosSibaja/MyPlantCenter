import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Share, Text, View } from 'react-native';

import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { UserProfile } from 'src/features/profile/types/user.types';
import { Avatar } from 'src/shared/components/ui/Avatar/Avatar';
import { XPBar } from 'src/shared/components/ui/ProgressBar/ProgressBar';

import { useProfileHeroTheme } from './ProfileHero.styles';

// Props
export interface ProfileHeroProps {
  profile: UserProfile;
  isOwner: boolean;
}

// Estadísticas mostradas en la fila superior (estilo Instagram)
const buildStats = (profile: UserProfile) => [
  { value: profile.stats.plantsCount, label: 'Plantas' },
  { value: profile.stats.friendsCount, label: 'Amigos' },
  { value: profile.stats.streak, label: 'Racha' },
];

// Componente
export const ProfileHero: React.FC<ProfileHeroProps> = ({ profile, isOwner }) => {
  const { theme, styles } = useProfileHeroTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleShare = () => {
    const code = profile.nickname.replace('@', '').toUpperCase();
    Share.share({
      message: `¡Agrégame en MyPlantCenter! 🌱\nMi código de amistad es: ${code}`,
    }).catch(() => {
      // Share cancelado por el usuario — sin acción
    });
  };

  return (
    <View style={styles.root}>

      {/* Fila superior: avatar + estadísticas */}
      <View style={styles.topRow}>
        <View style={styles.avatarCol}>
          <View style={styles.avatarRing}>
            <Avatar
              uri={profile.avatarUrl}
              size={theme.layout.avatarLg}
              showOnlineDot={false}
            />
          </View>
          <View style={styles.levelPill}>
            <Feather
              name="star"
              size={theme.text.overline.fontSize}
              color={theme.colors.textOnAccent}
            />
            <Text style={styles.levelText}>Nv {profile.level.level}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {buildStats(profile).map(stat => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Identidad: nombre + rango, apodo, bio */}
      <View style={styles.identityBlock}>
        <View style={styles.nameRow}>
          <Text style={styles.displayName}>{profile.name}</Text>
          <View style={styles.levelChip}>
            <Feather
              name="award"
              size={theme.text.caption.fontSize}
              color={theme.colors.accent}
            />
            <Text style={styles.levelChipText}>{profile.level.title}</Text>
          </View>
        </View>
        <Text style={styles.nickname}>{profile.nickname}</Text>
        {!!profile.description && (
          <Text style={styles.bioText}>{profile.description}</Text>
        )}
      </View>

      {/* Barra de XP */}
      <View style={styles.xpSection}>
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>Experiencia</Text>
          <Text style={styles.xpValue}>
            {profile.level.xp}/{profile.level.xpMax} XP
          </Text>
        </View>
        <XPBar
          xp={profile.level.xp}
          xpMax={profile.level.xpMax}
        />
      </View>

      {/* Acciones (solo dueño) */}
      {isOwner && (
        <View style={styles.actionsSection}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButtonPrimary,
              pressed && styles.actionButtonPrimaryPressed,
            ]}
            onPress={() => navigation.navigate('EditProfile')}
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
          >
            <Feather
              name="edit-2"
              size={theme.text.bodyMd.fontSize}
              color={theme.colors.textOnAccent}
            />
            <Text style={styles.actionButtonTextPrimary}>Editar perfil</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButtonSecondary,
              pressed && styles.actionButtonSecondaryPressed,
            ]}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Compartir perfil"
          >
            <Feather
              name="share-2"
              size={theme.text.bodyMd.fontSize}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.actionButtonTextSecondary}>Compartir</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.divider} />

    </View>
  );
};
