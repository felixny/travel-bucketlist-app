export interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
}

export interface Destination {
  id: string;
  user_id: string;
  name: string;
  country: string;
  notes?: string;
  visited: boolean;
  category?: string;
  region?: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface Country {
  name: string;
  officialName: string;
  code: string;
  region: string;
  subregion?: string;
  capital?: string;
  population: number;
  area: number;
  flag: string;
  flagEmoji: string;
  languages?: string[];
  currencies?: string[];
  timezones?: string[];
}

export interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  description?: string;
  photographer: string;
  photographer_url: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
