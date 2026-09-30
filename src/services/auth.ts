import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  Unsubscribe,
} from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import { syncUserProfile, SyncUserProfileResponse } from '@/src/api/user';

export interface EmailSignUpParams {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface EmailSignInParams {
  email: string;
  password: string;
}

/**
 * Creates a new user account with Email and Password, sets displayName,
 * and syncs customer record to PostgreSQL database.
 */
export async function signUpWithEmail(
  params: EmailSignUpParams
): Promise<FirebaseUser> {
  const { fullName, email, password } = params;

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );

  const user = userCredential.user;

  // Update displayName in Firebase Auth
  if (fullName.trim()) {
    await updateProfile(user, {
      displayName: fullName.trim(),
    });
  }

  // Synchronize customer profile into backend PostgreSQL database
  try {
    await syncUserProfile(user);
  } catch (syncError) {
    console.warn('[signUpWithEmail] Postgres sync warning:', syncError);
  }

  return user;
}

/**
 * Signs in an existing user with Email and Password, and syncs profile.
 */
export async function signInWithEmail(
  params: EmailSignInParams
): Promise<FirebaseUser> {
  const { email, password } = params;

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );

  const user = userCredential.user;

  try {
    await syncUserProfile(user);
  } catch (syncError) {
    console.warn('[signInWithEmail] Postgres sync warning:', syncError);
  }

  return user;
}

/**
 * Sends a password reset email link to the customer.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

/**
 * Signs out the currently authenticated user.
 */
export async function logOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribes to Firebase Auth state changes.
 */
export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}
