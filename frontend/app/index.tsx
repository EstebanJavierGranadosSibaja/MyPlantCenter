import React from 'react';
import { AuthProvider } from 'src/auth/AuthContext';
import { ThemeProvider } from 'src/context/ThemeContext';
import { AppNavigator } from 'src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}