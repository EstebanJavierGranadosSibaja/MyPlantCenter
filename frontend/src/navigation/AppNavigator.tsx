import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from 'src/auth/AuthContext';
import { useTabBarTheme } from 'src/components/navigation/AppTabBar.styles';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { Dashboard } from 'src/screens/Dashboard/Dashboard';
import { Explorar } from 'src/screens/Explore/Explore';
import { Login } from 'src/screens/Login/Login';
import { ProfileView } from 'src/screens/ProfileView/ProfileView';
import { Register } from 'src/screens/Register/Register';

// Tipos 
export type RootStackParamList = {
  MainTabs: undefined;
  UserProfile: { userId: string };
};

export type TabParamList = {
  Inicio: undefined;
  Explorar: undefined;
  Perfil: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Pantallas wrapper 
function OwnProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <ProfileView userId={user.id} isOwner={true} />;
}

function VisitorProfileScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, 'UserProfile'>) {
  return (
    <ProfileView
      userId={route.params.userId}
      isOwner={false}
    />
  );
}

// Tab Navigator
function TabNavigator() {
  const { tabBarOptions } = useTabBarTheme();

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name="Inicio"
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
      <Tab.Screen
        name="Perfil"
        component={OwnProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
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
      <Stack.Screen name="UserProfile" component={VisitorProfileScreen} />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
}

// AppNavigator
export function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const theme = useAppThemeContext();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <RootStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}