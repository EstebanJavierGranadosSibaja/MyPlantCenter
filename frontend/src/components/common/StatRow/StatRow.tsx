import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useStatRowTheme } from './StatRow.styles';

// Types
export interface StatItem {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value: string | number;
  label: string;
}

interface StatRowProps {
  items: StatItem[];
  style?: object;
}

// Componente principal
export const StatRow: React.FC<StatRowProps> = ({ items, style }) => {
  const { styles } = useStatRowTheme();

  return (
    <View style={[styles.row, style]}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>

          <StatPill item={item} />

          {index < items.length - 1 && (
            <View style={styles.divider} />
          )}

        </React.Fragment>
      ))}
    </View>
  );
};

// Subcomponente interno 
const StatPill: React.FC<{ item: StatItem }> = ({ item }) => {
  const { styles } = useStatRowTheme();

  return (
    <View style={styles.pill}>
      <Feather name={item.iconName} size={styles.icon.fontSize} color={styles.icon.color} />
      <Text style={styles.value}>{item.value}</Text>
      <Text style={styles.label}>{item.label}</Text>
    </View>
  );
};