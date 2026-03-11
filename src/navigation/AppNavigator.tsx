import React from 'react';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTabBarTheme } from 'src/components/navigation/AppTabBar.styles';
import { Dashboard } from 'src/screens/Dashboard/Dashboard';
import { Explorar } from 'src/screens/Explore/Explore';
import { UserProfile } from 'src/screens/UserProfile/UserProfile';

// Tipos de rutas 
export type RootStackParamList = {
  MainTabs: undefined;
  Perfil: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Explorar: undefined;
};

// Navegadores 
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab Navigator
function TabNavigator() {
  const { tabBarOptions } = useTabBarTheme();

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Explorar"
        component={Explorar}
        options={{
          tabBarLabel: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator
function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Perfil" component={UserProfile} />
    </Stack.Navigator>
  );
}

// AppNavigator
export function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}