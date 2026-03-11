import {
  ApiResponse,
  EditProfileDTO,
  UpdateNotificationsDTO,
  UpdatePrivacyDTO,
  UserProfile,
} from 'src/types-dtos/user.types';

// Mocks de prueba
const MOCK_USER: UserProfile = {
  id: 'user-001',
  name: 'Esteban Granados Sibaja',
  nickname: '@EstebanJGS',
  description: 'Amante de los helechos y siempre buscando nuevas especies para mi colección.',
  birthday: '12 de Noviembre',
  registeredAt: '2021-06-01',

  level: {
    level: 50,
    title: 'Jardinero Experto',
    xp: 840,
    xpMax: 1000,
  },

  stats: {
    plantsCount: 47,
    friendsCount: 128,
    streak: 34,
    bestStreak: 60,
    wateredToday: 8,
    activeDays: 127,
  },

  favoritePlant: {
    id: 'plant-001',
    name: 'Monstera Deliciosa',
    iconName: 'feather',
    category: 'Tropical',
  },

  categories: [
    { id: 'cat-1', name: 'Tropicales', iconName: 'sun', color: '#2D6A4F', amount: 14 },
    { id: 'cat-2', name: 'Suculentas', iconName: 'feather', color: '#52B788', amount: 11 },
    { id: 'cat-3', name: 'Helechos', iconName: 'wind', color: '#A8C686', amount: 8 },
    { id: 'cat-4', name: 'Cactus', iconName: 'zap', color: '#3B8A6E', amount: 7 },
    { id: 'cat-5', name: 'Aromaticas', iconName: 'star', color: '#4A9E78', amount: 5 },
    { id: 'cat-6', name: 'Acuaticas', iconName: 'droplet', color: '#1A6B4A', amount: 2 },
  ],

  achievements: [
    { id: 'a-1', title: 'First Plant', description: 'You identified your first species', iconName: 'feather', unlocked: true, unlockedAt: '2021-06-02' },
    { id: 'a-2', title: 'Consistent Watering', description: '7 consecutive days of care', iconName: 'droplet', unlocked: true, unlockedAt: '2021-06-09' },
    { id: 'a-3', title: 'Botany Expert', description: 'Identify 50 species', iconName: 'search', unlocked: true, unlockedAt: '2022-03-15' },
    { id: 'a-4', title: 'Century Garden', description: 'Register 100 plants', iconName: 'feather', unlocked: false },
    { id: 'a-5', title: 'Garden Master', description: 'Complete all achievements', iconName: 'award', unlocked: false },
  ],

  privacy: {
    publicProfile: true,
    showStreak: true,
    showBirthday: false,
    allowRequests: true,
  },

  notifications: {
    wateringReminders: true,
    healthAlerts: true,
    newFriends: false,
    achievementsUnlocked: true,
  },
};

// Simulación de latencia
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service
export const userService = {

  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    await delay(600);
    return {
      success: true,
      data: { ...MOCK_USER, id: userId },
    };
  },

  async updateProfile(
    userId: string,
    dto: EditProfileDTO,
  ): Promise<ApiResponse<UserProfile>> {
    await delay(500);
    return {
      success: true,
      data: { ...MOCK_USER, ...dto },
    };
  },

  async updatePrivacy(
    userId: string,
    dto: UpdatePrivacyDTO,
  ): Promise<ApiResponse<UserProfile>> {
    await delay(300);
    return {
      success: true,
      data: {
        ...MOCK_USER,
        privacy: { ...MOCK_USER.privacy, ...dto.privacy },
      },
    };
  },

  async updateNotifications(
    userId: string,
    dto: UpdateNotificationsDTO,
  ): Promise<ApiResponse<UserProfile>> {
    await delay(300);
    return {
      success: true,
      data: {
        ...MOCK_USER,
        notifications: { ...MOCK_USER.notifications, ...dto.notifications },
      },
    };
  },

};