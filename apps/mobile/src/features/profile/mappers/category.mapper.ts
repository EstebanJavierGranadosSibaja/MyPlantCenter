import { CategoryViewModel, FeatherIconName } from 'src/features/profile/types/user.types';

interface RawCategory {
  id: string;
  name: string;
  iconKey: string;
  iconSet?: string;
  iconEmoji?: string;
  color: string;
  count?: number;
  order: number;
  createdAt: string;
}

const iconKeyToFeather: Partial<Record<string, FeatherIconName>> = {
  plant: 'feather',
  leaf: 'feather',
  sun: 'sun',
  flower: 'star',
  rose: 'heart',
  droplet: 'droplet',
};

const emojiToFeatherIcon: Record<string, FeatherIconName> = {
  plant: 'feather',
  sun: 'sun',
  leaf: 'feather',
  flower: 'star',
  rose: 'heart',
  water: 'droplet',
  seed: 'circle',
  sprout: 'trending-up',
};

export function mapCategoryFromApi(raw: RawCategory): CategoryViewModel {
  return {
    id: raw.id.replace(/-/g, '_'),
    name: raw.name,
    iconName: emojiToFeatherIcon[raw.iconEmoji ?? '']
      ?? iconKeyToFeather[raw.iconKey]
      ?? 'feather',
    color: raw.color,
    amount: raw.count ?? 0,
  };
}
