// Mock API for demo purposes - no backend required
import { Destination, Country, UnsplashImage } from '../types';

// Mock data
const mockDestinations: Destination[] = [
  {
    id: '1',
    user_id: 'demo-user',
    name: 'Paris',
    country: 'France',
    notes: 'The city of lights! Must visit the Eiffel Tower and Louvre Museum.',
    visited: false,
    category: 'City',
    region: 'Europe',
    image_urls: ['https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'demo-user',
    name: 'Tokyo',
    country: 'Japan',
    notes: 'Amazing blend of traditional and modern culture. Great food!',
    visited: true,
    category: 'City',
    region: 'Asia',
    image_urls: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'demo-user',
    name: 'Santorini',
    country: 'Greece',
    notes: 'Beautiful sunsets and white buildings. Perfect for a romantic getaway.',
    visited: false,
    category: 'Beach',
    region: 'Europe',
    image_urls: ['https://images.unsplash.com/photo-1570077188660-247b6b2a6b76?w=400'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockCountries: Country[] = [
  { name: 'France', officialName: 'French Republic', code: 'FR', region: 'Europe', subregion: 'Western Europe', capital: 'Paris', population: 67391582, area: 551695, flag: '🇫🇷', flagEmoji: '🇫🇷' },
  { name: 'Japan', officialName: 'Japan', code: 'JP', region: 'Asia', subregion: 'Eastern Asia', capital: 'Tokyo', population: 125836021, area: 377975, flag: '🇯🇵', flagEmoji: '🇯🇵' },
  { name: 'Greece', officialName: 'Hellenic Republic', code: 'GR', region: 'Europe', subregion: 'Southern Europe', capital: 'Athens', population: 10718565, area: 131990, flag: '🇬🇷', flagEmoji: '🇬🇷' },
  { name: 'Italy', officialName: 'Italian Republic', code: 'IT', region: 'Europe', subregion: 'Southern Europe', capital: 'Rome', population: 59554023, area: 301340, flag: '🇮🇹', flagEmoji: '🇮🇹' },
  { name: 'Spain', officialName: 'Kingdom of Spain', code: 'ES', region: 'Europe', subregion: 'Southern Europe', capital: 'Madrid', population: 47351567, area: 505992, flag: '🇪🇸', flagEmoji: '🇪🇸' },
  { name: 'United States', officialName: 'United States of America', code: 'US', region: 'Americas', subregion: 'North America', capital: 'Washington, D.C.', population: 329484123, area: 9833517, flag: '🇺🇸', flagEmoji: '🇺🇸' },
];

const mockRegions = ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockDestinationsApi = {
  getAll: async (): Promise<Destination[]> => {
    await delay(500);
    return [...mockDestinations];
  },
  
  getById: async (id: string): Promise<Destination> => {
    await delay(300);
    const destination = mockDestinations.find(d => d.id === id);
    if (!destination) throw new Error('Destination not found');
    return destination;
  },
  
  create: async (destination: Omit<Destination, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Destination> => {
    await delay(500);
    const newDestination: Destination = {
      ...destination,
      id: Date.now().toString(),
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockDestinations.push(newDestination);
    return newDestination;
  },
  
  update: async (id: string, updates: Partial<Destination>): Promise<Destination> => {
    await delay(500);
    const index = mockDestinations.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Destination not found');
    
    mockDestinations[index] = {
      ...mockDestinations[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return mockDestinations[index];
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockDestinations.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Destination not found');
    mockDestinations.splice(index, 1);
  },
  
  search: async (params: {
    q?: string;
    region?: string;
    category?: string;
    visited?: boolean;
  }): Promise<Destination[]> => {
    await delay(300);
    let filtered = [...mockDestinations];
    
    if (params.q) {
      const query = params.q.toLowerCase();
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query) ||
        dest.notes?.toLowerCase().includes(query)
      );
    }
    
    if (params.region) {
      filtered = filtered.filter(dest => dest.region === params.region);
    }
    
    if (params.category) {
      filtered = filtered.filter(dest => dest.category === params.category);
    }
    
    if (params.visited !== undefined) {
      filtered = filtered.filter(dest => dest.visited === params.visited);
    }
    
    return filtered;
  }
};

export const mockExternalApi = {
  getCountries: async (): Promise<Country[]> => {
    await delay(300);
    return [...mockCountries];
  },
  
  getRegions: async (): Promise<string[]> => {
    await delay(200);
    return [...mockRegions];
  },
  
  getUnsplashImages: async (query: string, page = 1, perPage = 10): Promise<{ images: UnsplashImage[] }> => {
    await delay(500);
    // Return some mock Unsplash images
    const mockImages: UnsplashImage[] = [
      {
        id: '1',
        url: `https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80`,
        thumb: `https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200&q=80`,
        description: `Beautiful ${query} landscape`,
        photographer: 'Demo Photographer',
        photographer_url: 'https://unsplash.com/@demo'
      },
      {
        id: '2',
        url: `https://images.unsplash.com/photo-1570077188660-247b6b2a6b76?w=800&q=80`,
        thumb: `https://images.unsplash.com/photo-1570077188660-247b6b2a6b76?w=200&q=80`,
        description: `Stunning ${query} view`,
        photographer: 'Demo Photographer 2',
        photographer_url: 'https://unsplash.com/@demo2'
      }
    ];
    return { images: mockImages };
  }
};

export const mockImagesApi = {
  getPresignedUrl: async (contentType: string, fileName: string) => {
    await delay(300);
    // Return a mock URL for demo purposes
    return {
      presignedUrl: 'mock-presigned-url',
      key: `demo/${fileName}`,
      url: `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(fileName)}`
    };
  }
};
