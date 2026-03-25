import { AchievementViewModel, FeatherIconName } from 'src/types-dtos/user.types';

interface RawAchievement {
  id: string;
  userId: string;
  templateId: string;
  tier: string;
  category: string;
  progress: number;
  goal: number;
  unlocked: boolean;
  unlockedAt?: string | null;
  notified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RawAchievementTemplate {
  id: string;
  title: string;
  description: string;
  iconKey: string;
  iconSet: string;
  emoji: string;
  category: string;
}

const iconKeyToFeather: Partial<Record<string, FeatherIconName>> = {
  droplet: 'droplet',
  leaf: 'feather',
  flower: 'star',
  sun: 'sun',
};

const emojiTokenToGlyph: Partial<Record<string, string>> = {
  water: '💧',
  plant: '🌱',
  seed: '🌰',
  sprout: '🌿',
};

export function mapAchievementFromApi(
  achievement: RawAchievement,
  template?: RawAchievementTemplate,
): AchievementViewModel {
  return {
    id: achievement.id,
    title: template?.title ?? '',
    description: template?.description ?? '',
    iconName: iconKeyToFeather[template?.iconKey ?? ''] ?? 'award',
    emoji: emojiTokenToGlyph[template?.emoji ?? ''] ?? '',
    unlocked: achievement.unlocked,
    unlockedAt: achievement.unlockedAt ?? undefined,
  };
}
