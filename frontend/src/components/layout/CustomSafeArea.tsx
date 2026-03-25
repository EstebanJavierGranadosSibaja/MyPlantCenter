import React from 'react';
import { ScrollView } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useCustomSafeAreaTheme } from './CustomSafeArea.styles';

interface CustomSafeAreaProps {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
}

export const CustomSafeArea: React.FC<CustomSafeAreaProps> = ({
  children,
  scroll = false,
  edges = ['top', 'bottom', 'left', 'right'],
}) => {
  const { styles } = useCustomSafeAreaTheme();

  if (scroll) {
    return (
      <SafeAreaView style={styles.safeArea} edges={edges}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      {children}
    </SafeAreaView>
  );
};
