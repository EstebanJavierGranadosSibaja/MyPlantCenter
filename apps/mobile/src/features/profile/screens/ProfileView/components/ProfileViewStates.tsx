import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { XPBar } from 'src/shared/components/ui/ProgressBar/ProgressBar';
import { useProfileViewTheme } from '../ProfileView.styles';

// Props compartidas
interface BaseStateProps {
    isOwner: boolean;
}

// Loading 
const Loading: React.FC<BaseStateProps> = ({ isOwner }) => {
    const { theme, styles } = useProfileViewTheme();

    return (
        <CustomSafeArea>
            <AppHeader
                title={isOwner ? 'Mi Perfil' : 'Perfil'}
                subtitle="MyPlantCenter"
                showBack={!isOwner}
            />
            <View style={styles.loadingContainer}>
                <View style={styles.loadingAvatar}>
                    <Feather
                        name="user"
                        size={theme.spacing['3xl']}
                        color={theme.colors.textMuted}
                    />
                </View>

                <View style={styles.loadingSkeletonName} />
                <View style={styles.loadingSkeletonNickname} />
                <View style={styles.loadingSkeletonDescription} />

                <View style={styles.loadingStatsRow}>
                    <View style={styles.loadingStatCard}>
                        <Text style={styles.loadingStatValue}>0</Text>
                        <Text style={styles.loadingStatLabel}>Plantas</Text>
                    </View>
                    <View style={styles.loadingStatCard}>
                        <Text style={styles.loadingStatValue}>0</Text>
                        <Text style={styles.loadingStatLabel}>Amigos</Text>
                    </View>
                    <View style={styles.loadingStatCard}>
                        <Text style={styles.loadingStatValue}>0</Text>
                        <Text style={styles.loadingStatLabel}>Racha</Text>
                    </View>
                </View>

                <View style={styles.xpSection}>
                    <View style={styles.xpRow}>
                        <Text style={styles.xpLabel}>Experiencia</Text>
                        <Text style={styles.xpValue}>0/100 XP</Text>
                    </View>
                    <XPBar xp={0} xpMax={100} delay={0} />
                </View>

                <EmptyState
                    iconName="grid"
                    title="Sin categorías"
                    subtitle="Agrega tu primera categoría de plantas"
                />

                <EmptyState
                    iconName="award"
                    title="Sin logros aún"
                    subtitle="Completa acciones para desbloquear logros"
                />
            </View>
        </CustomSafeArea>
    );
};

// Error 
interface ErrorStateProps extends BaseStateProps {
    error: string | null;
}

const Error: React.FC<ErrorStateProps> = ({ isOwner, error }) => {
    const { theme, styles } = useProfileViewTheme();

    return (
        <CustomSafeArea>
            <AppHeader
                title={isOwner ? 'Mi Perfil' : 'Perfil'}
                subtitle="MyPlantCenter"
                showBack={!isOwner}
            />
            <View style={styles.centered}>
                <Feather
                    name="alert-circle"
                    size={theme.typography.size['5xl']}
                    color={theme.colors.error}
                />
                <Text style={styles.errorText}>
                    {error ?? 'No se pudo cargar el perfil.'}
                </Text>
            </View>
        </CustomSafeArea>
    );
};

// Export agrupado 
// Uso: <ProfileViewStates.Loading /> y <ProfileViewStates.Error />
export const ProfileViewStates = { Loading, Error };