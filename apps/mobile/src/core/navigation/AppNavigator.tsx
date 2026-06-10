import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { useAuth } from 'src/core/contexts/AuthContext';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { useAppNavigatorTheme } from 'src/core/navigation/AppNavigator.styles';
import { useTabBarTheme } from 'src/core/navigation/AppTabBar.styles';
import { LoginV2 as Login } from 'src/features/auth/screens/Login/LoginV2';
import { RegisterV2 as Register } from 'src/features/auth/screens/Register/RegisterV2';
import { CameraTabButtonV2 as CameraTabButton } from 'src/features/camera/components/CameraTabButton/CameraTabButtonV2';
import { CameraScanV2 as CameraScan } from 'src/features/camera/screens/CameraScan/CameraScanV2';
import { backgroundSyncService } from 'src/features/camera/services/backgroundSync.service';
import { WateringCalendarV2 as WateringCalendar } from 'src/features/care/screens/WateringCalendar/WateringCalendarV2';
import { DashboardV2 as Dashboard } from 'src/features/dashboard/screens/Dashboard/DashboardV2';
import { NotificationsScreen as Notifications } from 'src/features/notifications/screens/NotificationsScreen';
import { VacationModeScreen as VacationMode } from 'src/features/vacation/screens/VacationModeScreen';
import { ExplorarV2 as Explorar } from 'src/features/explore/screens/Explore/ExplorarV2';
import { AddFriendV2 as AddFriend } from 'src/features/friends/screens/AddFriend/AddFriendV2';
import { FriendRequestsV2 as FriendRequests } from 'src/features/friends/screens/FriendRequests/FriendRequestsV2';
import { FriendsHomeV2 as FriendsHome } from 'src/features/friends/screens/FriendsHome/FriendsHomeV2';
import { AddPlantV2 as AddPlant } from 'src/features/plants/screens/AddPlant/AddPlantV2';
import { EditPlantV2 as EditPlant } from 'src/features/plants/screens/EditPlant/EditPlantV2';
import { PlantsHubV2 as PlantsHub } from 'src/features/plants/screens/PlantsHub/PlantsHubV2';
import { EditProfileV2 as EditProfile } from 'src/features/profile/screens/EditProfile/EditProfileV2';
import { ProfileViewV2 as ProfileView } from 'src/features/profile/screens/ProfileView/ProfileViewV2';
import { FormToastProvider } from 'src/shared/components/feedback/FormToast/FormToast';
import { ChatProvider } from 'src/features/chat/context/ChatProvider';
import { GroupChatScreen } from 'src/features/chat/screens/GroupChat/GroupChatScreen';
import { DMListScreen } from 'src/features/chat/screens/DirectMessages/DMListScreen';
import { DMThreadScreen } from 'src/features/chat/screens/DirectMessages/DMThreadScreen';
import { ChatStackParamList } from 'src/features/chat/screens/ChatNavigator';

// Tipos 
export type RootStackParamList = {
  MainTabs: undefined;
  UserProfile: { userId: string };
  EditPlant: { plantId: string };
  AddPlant: { prefill?: { name?: string; species?: string; notes?: string } } | undefined;
  EditProfile: undefined;
  CameraScan: undefined;
  WateringCalendar: undefined;
  Notifications: undefined;
  VacationMode: undefined;
};

export type TabParamList = {
  Inicio: undefined;
  Plantas: undefined;
  CameraAction: undefined;
  Amigos: undefined;
  Chat: undefined;
  Explorar: undefined;
  Perfil: undefined;
};

export type FriendsStackParamList = {
  FriendsHome: undefined;
  AddFriend: undefined;
  FriendRequests: undefined;
};

export type { ChatStackParamList };

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const FriendsStack = createNativeStackNavigator<FriendsStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
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

function ChatNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="GroupChat" component={GroupChatScreen} />
      <ChatStack.Screen name="DMList" component={DMListScreen} />
      <ChatStack.Screen name="DMThread" component={DMThreadScreen} />
    </ChatStack.Navigator>
  );
}

// iOS-only: real frosted-glass pill. Android: expo-blur renders no blur,
// so AppTabBar.styles.ts keeps the opaque glass fallback color there.
// Defined outside TabNavigator so the reference is stable across renders.
//
// The wrapper View carries borderRadius + overflow:hidden so the BlurView is
// clipped to the pill shape without restricting the tab bar container itself
// (which needs overflow:visible for the floating camera button).
const TAB_BAR_BLUR_CLIP = StyleSheet.create({
  pill: { borderRadius: 32, overflow: 'hidden' },
});

function TabBarBackground() {
  if (Platform.OS !== 'ios') return null;
  return (
    <View style={[StyleSheet.absoluteFill, TAB_BAR_BLUR_CLIP.pill]}>
      <BlurView intensity={72} tint="systemMaterial" style={StyleSheet.absoluteFill} />
    </View>
  );
}

// Tab Navigator
function TabNavigator() {
  const { tabBarOptions } = useTabBarTheme();
  const theme = useAppThemeContext();
  const tabIconContainer = tabBarOptions.tabIconContainer ?? {};

  const createTabIcon = (name: React.ComponentProps<typeof Feather>['name']) => {
    const TabIcon = ({
      focused,
      color,
    }: {
      focused: boolean;
      color: string;
      size: number;
    }) => (
      <View style={[tabIconContainer, { backgroundColor: focused ? theme.colors.tabBg : 'transparent' }]}>
        <Feather name={name} size={theme.layout.iconSm} color={color} />
      </View>
    );

    TabIcon.displayName = `TabIcon-${name}`;
    return TabIcon;
  };

return (
<Tab.Navigator
  screenOptions={{
    ...tabBarOptions,
    tabBarBackground: TabBarBackground,
  }}
  screenListeners={{
    tabPress: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    },
  }}
>
<Tab.Screen
name="Inicio"
component={Dashboard}
options={{
tabBarLabel: 'Inicio',
tabBarIcon: createTabIcon('home'),
}}
/>
<Tab.Screen
name="Plantas"
component={PlantsHub}
options={{
tabBarLabel: 'Plantas',
tabBarIcon: createTabIcon('feather'),
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
tabBarIcon: createTabIcon('users'),
}}
/>
<Tab.Screen
name="Chat"
component={ChatNavigator}
options={{
tabBarLabel: 'Chat',
tabBarIcon: createTabIcon('message-circle'),
}}
/>
<Tab.Screen
name="Explorar"
component={Explorar}
options={{
tabBarLabel: 'Explorar',
tabBarIcon: createTabIcon('search'),
}}
/>
<Tab.Screen
name="Perfil"
component={OwnProfileScreen}
options={{
tabBarLabel: 'Perfil',
tabBarIcon: createTabIcon('user'),
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
      <Stack.Screen name="WateringCalendar" component={WateringCalendar} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="VacationMode" component={VacationMode} />
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
  const { styles } = useAppNavigatorTheme();

  React.useEffect(() => {
    if (isAuthenticated) {
      backgroundSyncService.startListening();
    }

    return () => {
      backgroundSyncService.stopListening();
    };
  }, [isAuthenticated]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        {isAuthenticated ? (
          <ChatProvider>
            <RootStack />
          </ChatProvider>
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
      <FormToastProvider />
    </>
  );
}
