import axios from 'axios';
import { supabase } from './supabase';
import { Destination, Country, UnsplashImage, ApiResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signUp: async (email: string, password: string, fullName?: string) => {
    const response = await api.post('/auth/signup', { email, password, full_name: fullName });
    return response.data;
  },
  
  signIn: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  signOut: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }
};

// Destinations API
export const destinationsApi = {
  getAll: async (): Promise<Destination[]> => {
    const response = await api.get('/destinations');
    return response.data;
  },
  
  getById: async (id: string): Promise<Destination> => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },
  
  create: async (destination: Omit<Destination, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Destination> => {
    const response = await api.post('/destinations', destination);
    return response.data;
  },
  
  update: async (id: string, destination: Partial<Destination>): Promise<Destination> => {
    const response = await api.put(`/destinations/${id}`, destination);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/destinations/${id}`);
  },
  
  search: async (params: {
    q?: string;
    region?: string;
    category?: string;
    visited?: boolean;
  }): Promise<Destination[]> => {
    const response = await api.get('/destinations/search', { params });
    return response.data;
  }
};

// Images API
export const imagesApi = {
  getPresignedUrl: async (contentType: string, fileName: string) => {
    const response = await api.post('/images/presigned-url', { contentType, fileName });
    return response.data;
  }
};

// External APIs
export const externalApi = {
  getUnsplashImages: async (query: string, page = 1, perPage = 10) => {
    const response = await api.get(`/external/unsplash/${query}`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  },
  
  getCountries: async (): Promise<Country[]> => {
    const response = await api.get('/external/countries');
    return response.data;
  },
  
  getCountryByCode: async (code: string): Promise<Country> => {
    const response = await api.get(`/external/countries/${code}`);
    return response.data;
  },
  
  getRegions: async (): Promise<string[]> => {
    const response = await api.get('/external/regions');
    return response.data;
  }
};

export default api;
