import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { CustomSafeArea } from 'src/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { useExplorarTheme } from './Explore.styles';

export const Explorar: React.FC = () => {
    const { theme, styles } = useExplorarTheme();

    return (
        <CustomSafeArea>
            <AppHeader title="Explorar" showBack={false} />
            <View style={styles.root}>

                <View style={styles.content}>
                    <Feather
                        name="search"
                        size={theme.typography.size['6xl']}
                        color={theme.colors.textMuted}
                    />
                    <Text style={styles.title}>Explorar plantas</Text>
                    <Text style={styles.subtitle}>Próximamente</Text>
                </View>

            </View>
        </CustomSafeArea>
    );
};