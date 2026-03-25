import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { CustomSafeArea } from 'src/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
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
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.accent} />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
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