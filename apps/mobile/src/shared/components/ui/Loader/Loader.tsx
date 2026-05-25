import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLoaderTheme } from './Loader.styles';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullscreen?: boolean;
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color,
  fullscreen = false,
  label,
}) => {
  const { theme, styles } = useLoaderTheme();

  const indicatorSize = size === 'sm' ? 'small' : 'large';
  const indicatorColor = color ?? theme.colors.accent;

  return (
    <View style={fullscreen ? styles.fullscreen : styles.inline}>
      <ActivityIndicator size={indicatorSize} color={indicatorColor} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
};
