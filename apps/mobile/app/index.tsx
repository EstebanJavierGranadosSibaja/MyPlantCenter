import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from 'src/core/contexts/AuthContext';
import { ThemeProvider } from 'src/core/contexts/ThemeContext';
import { AppNavigator } from 'src/core/navigation/AppNavigator';
import { UIThemeProvider } from 'src/ui/theme/UIThemeContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UIThemeProvider>
            <AuthProvider>
              <AppNavigator />
            </AuthProvider>
          </UIThemeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}