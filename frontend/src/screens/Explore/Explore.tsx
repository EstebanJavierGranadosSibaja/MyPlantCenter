import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { EmptyState } from 'src/components/common/EmptyState/EmptyState';
import { CustomSafeArea } from 'src/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { useExplorarTheme } from './Explore.styles';

export const Explorar: React.FC = () => {
    const { theme, styles } = useExplorarTheme();
    const [query, setQuery] = React.useState('');

    const plants = ['Monstera Deliciosa', 'Pothos Neon', 'Ficus Lyrata', 'Sansevieria'];
    const normalizedQuery = query.trim().toLowerCase();
    const hasSearched = normalizedQuery.length > 0;
    const results = hasSearched
        ? plants.filter(item => item.toLowerCase().includes(normalizedQuery))
        : [];

    return (
        <CustomSafeArea>
            <AppHeader title="Explorar" showBack={false} />
            <View style={styles.root}>
                <View style={styles.searchWrapper}>
                    <Feather
                        name="search"
                        size={theme.typography.size.lg}
                        color={theme.colors.textMuted}
                    />
                    <TextInput
                        style={styles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Busca plantas"
                        placeholderTextColor={theme.colors.textMuted}
                    />
                </View>

                {hasSearched && results.length === 0 ? (
                    <EmptyState
                        iconName="search"
                        title="Sin resultados"
                        subtitle="Intenta con otro término de búsqueda"
                    />
                ) : (
                    <View style={styles.content}>
                        {!hasSearched ? (
                            <>
                                <Text style={styles.title}>Explorar plantas</Text>
                                <Text style={styles.subtitle}>Escribe para comenzar una búsqueda</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.title}>Resultados</Text>
                                {results.map(item => (
                                    <View key={item} style={styles.resultItem}>
                                        <Text style={styles.resultLabel}>{item}</Text>
                                    </View>
                                ))}
                            </>
                        )}
                    </View>
                )}

            </View>
        </CustomSafeArea>
    );
};