import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { auth } from '@/src/config/firebase';

const DEFAULT_API_URL = 'https://stage.gaonpure.com';

export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

/**
 * Preconfigured Axios instance for Gaon Pure authenticated API requests.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor:
 * Injects current user's Firebase ID Token into Authorization header as Bearer token.
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        if (idToken) {
          config.headers.set('Authorization', `Bearer ${idToken}`);
        }
      }
    } catch (tokenError: unknown) {
      console.warn('[apiClient] Failed to retrieve Firebase ID Token:', tokenError);
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Handles 401 Unauthorized errors and standard response parsing.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<never> => {
    if (error.response?.status === 401) {
      console.warn(
        '[apiClient] 401 Unauthorized encountered. Session may be expired or user unauthenticated.',
        error.config?.url
      );
    }
    return Promise.reject(error);
  }
);
