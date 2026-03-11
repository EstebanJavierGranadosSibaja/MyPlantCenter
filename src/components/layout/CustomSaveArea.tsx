import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { createUserStyles } from './CustomSaveArea.style';
import { useAppThemeContext } from 'src/context/ThemeContext';


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
  const theme = useAppThemeContext();
  const styles = createUserStyles(theme);

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