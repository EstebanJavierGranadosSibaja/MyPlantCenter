import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from 'src/core/contexts/AuthContext';
import { FormToastProvider } from 'src/shared/components/feedback/FormToast/FormToast';
import { CameraTabButton } from 'src/features/camera/components/CameraTabButton/CameraTabButton';
import { useTabBarTheme } from 'src/core/navigation/AppTabBar.styles';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { CameraScan } from 'src/features/camera/screens/CameraScan/CameraScan';
import { Dashboard } from 'src/features/dashboard/screens/Dashboard/Dashboard';
import { AddFriend } from 'src/features/friends/screens/AddFriend/AddFriend';
import { FriendsHome } from 'src/features/friends/screens/FriendsHome/FriendsHome';
import { FriendRequests } from 'src/features/friends/screens/FriendRequests/FriendRequests';
import { Login } from 'src/features/auth/screens/Login/Login';
import { AddPlant } from 'src/features/plants/screens/AddPlant/AddPlant';
import { EditPlant } from 'src/features/plants/screens/EditPlant/EditPlant';
import { PlantsHub } from 'src/features/plants/screens/PlantsHub/PlantsHub';
import { ProfileView } from 'src/features/profile/screens/ProfileView/ProfileView';
import { EditProfile } from 'src/features/profile/screens/EditProfile/EditProfile';
import { Register } from 'src/features/auth/screens/Register/Register';

// Tipos 
export type RootStackParamList = {
  MainTabs: undefined;
  UserProfile: { userId: string };
  EditPlant: { plantId: string };
  AddPlant: undefined;
  EditProfile: undefined;
  CameraScan: undefined;
};

export type TabParamList = {
  Inicio: undefined;
  Plantas: undefined;
  CameraAction: undefined;
  Amigos: undefined;
  Perfil: undefined;
};

export type FriendsStackParamList = {
  FriendsHome: undefined;
  AddFriend: undefined;
  FriendRequests: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const FriendsStack = createNativeStackNavigator<FriendsStackParamList>();
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

function EditProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <EditProfile userId={user.id} />;
}

function CameraActionPlaceholder() {
  return null;
}

function FriendsNavigator() {
  return (
    <FriendsStack.Navigator screenOptions={{ headerShown: false }}>
      <FriendsStack.Screen name="FriendsHome" component={FriendsHome} />
      <FriendsStack.Screen name="AddFriend" component={AddFriend} />
      <FriendsStack.Screen name="FriendRequests" component={FriendRequests} />
    </FriendsStack.Navigator>
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
        name="Plantas"
        component={PlantsHub}
        options={{
          tabBarLabel: 'Plantas',
          tabBarIcon: ({ color, size }) => (
            <Feather name="feather" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CameraAction"
        component={CameraActionPlaceholder}
        options={{
          tabBarLabel: '',
          tabBarButton: props => <CameraTabButton {...props} />,
          tabBarIcon: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault();
            navigation.getParent()?.navigate('CameraScan' as never);
          },
        })}
      />
      <Tab.Screen
        name="Amigos"
        component={FriendsNavigator}
        options={{
          tabBarLabel: 'Amigos',
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
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
      <Stack.Screen name="CameraScan" component={CameraScan} />
      <Stack.Screen name="UserProfile" component={VisitorProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AddPlant" component={AddPlant} />
      <Stack.Screen name="EditPlant" component={EditPlant} />
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
    <>
      <NavigationContainer>
        {isAuthenticated ? <RootStack /> : <AuthNavigator />}
      </NavigationContainer>
      <FormToastProvider />
    </>
  );
}