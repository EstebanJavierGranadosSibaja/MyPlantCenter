import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import { PlantCategory } from 'src/features/profile/types/user.types';
import { useCategoryBadgeTheme } from './CategoryBadge.styles';

// Props
interface CategoryBadgeProps {
  category: PlantCategory;
  maxAmount: number;
  index?: number;
}

// Componente 
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  maxAmount,
  index = 0,
}) => {
  const { theme, styles } = useCategoryBadgeTheme();

  const pct = Math.min(category.amount / maxAmount, 1);

  const barProgress = useSharedValue(0);

  useEffect(() => {
    barProgress.value = withDelay(
      300 + index * 80,
      withTiming(pct, {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [barProgress, index, pct]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barProgress.value * 100}%` as any,
  }));

  return (
    <View style={styles.container}>

      <View
        style={[
          styles.iconContainer,
          { borderColor: category.color },
        ]}
      >
        <Feather
          name={category.iconName}
          size={theme.typography.size['2xl']}
          color={category.color}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{category.name}</Text>

        <View style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              barStyle,
              { backgroundColor: category.color },
            ]}
          />
        </View>
      </View>

      <View style={styles.countPill}>
        <Text style={[styles.count, { color: category.color }]}>
          {category.amount}
        </Text>
      </View>

    </View>
  );
};