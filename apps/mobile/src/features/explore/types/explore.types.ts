export interface TrendingPlant {
  id: string;
  name: string;
  scientificName: string;
  imageUrl?: string;
  detectionCount: number;
  lastDetected: string; // ISO date string
}

export interface RecentActivity {
  id: string;
  userId: string;
  userNickname: string;
  plantName: string;
  plantScientificName: string;
  actionType: 'detected' | 'added' | 'updated';
  timestamp: string; // ISO date string
  confidence?: number;
}

export interface ExploreData {
  trendingPlants: TrendingPlant[];
  recentActivity: RecentActivity[];
}

export interface ExploreFilters {
  query?: string;
  category?: string;
  sortBy?: 'name' | 'date' | 'popularity';
}