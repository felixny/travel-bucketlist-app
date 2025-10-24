// Mock API service that replaces the real API calls
import { mockDestinationsApi, mockExternalApi, mockImagesApi } from './mockApi';

// Export the same interface as the real API service
export const destinationsApi = mockDestinationsApi;
export const externalApi = mockExternalApi;
export const imagesApi = mockImagesApi;

// Mock auth API
export const authApi = {
  signUp: async (email: string, password: string, fullName?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'User created successfully' };
  },
  
  signIn: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      user: { id: 'demo-user', email },
      session: { access_token: 'mock-token' }
    };
  },
  
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: 'Logged out successfully' };
  },
  
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { user: { id: 'demo-user', email: 'demo@example.com' } };
  },
  
  forgotPassword: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: 'Password reset email sent' };
  }
};

const mockApiService = {
  destinationsApi,
  externalApi,
  imagesApi,
  authApi
};

export default mockApiService;
