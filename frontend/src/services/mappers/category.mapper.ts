import { CategoryDTO, CategoryViewModel, FeatherIconName } from 'src/types-dtos/user.types';

interface RawCategory {
  id: string;
  name: string;
  iconKey: string;
  iconSet: string;
  iconEmoji: string;
  color: string;
  count: number;
  order: number;
  createdAt: string;
}

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

const featherToEmoji: Partial<Record<FeatherIconName, string>> = {
  feather: 'plant',
  sun: 'sun',
  star: 'flower',
  heart: 'rose',
  droplet: 'water',
  'trending-up': 'sprout',
};

export function mapCategoryFromApi(raw: RawCategory): CategoryViewModel {
  return {
    id: raw.id.replace(/-/g, '_'),
    name: raw.name,
    iconName: emojiToFeatherIcon[raw.iconEmoji] ?? 'feather',
    color: raw.color,
    amount: raw.count,
  };
}

export function mapCategoriesToApi(vm: CategoryViewModel): CategoryDTO {
  return {
    id: vm.id,
    name: vm.name,
    iconKey: vm.iconName,
    iconSet: 'feather',
    iconEmoji: featherToEmoji[vm.iconName] ?? 'plant',
    color: vm.color,
    count: vm.amount,
  };
}
