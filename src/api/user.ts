import { User as FirebaseUser } from 'firebase/auth';
import { apiClient } from './client';

export interface SyncUserPayload {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
}

export interface SyncedUserRecord {
  id: string;
  firebaseUid: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncUserProfileResponse {
  success: boolean;
  message?: string;
  user: SyncedUserRecord;
}

/**
 * Synchronizes authenticated Firebase user details into Gaon Pure PostgreSQL database.
 * The Bearer token is automatically attached by the Axios request interceptor.
 */
export async function syncUserProfile(
  user: FirebaseUser
): Promise<SyncUserProfileResponse> {
  const payload: SyncUserPayload = {
    uid: user.uid,
    email: user.email,
    phoneNumber: user.phoneNumber,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providerId: user.providerData?.[0]?.providerId || 'firebase',
  };

  try {
    const response = await apiClient.post<SyncUserProfileResponse>(
      '/api/users/sync',
      payload
    );
    return response.data;
  } catch (error: unknown) {
    console.error('[syncUserProfile] Failed to sync user profile:', error);
    throw error;
  }
}
