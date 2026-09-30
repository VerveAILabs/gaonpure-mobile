import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import { subscribeToAuthState, logOutUser } from '@/src/services/auth';

export interface UserStoreState {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  logOut: () => Promise<void>;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: auth.currentUser,
  isAuthenticated: !!auth.currentUser,
  isLoading: true,

  setUser: (user: FirebaseUser | null) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  logOut: async () => {
    await logOutUser();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

// Initialize Firebase Auth state subscription
subscribeToAuthState((firebaseUser) => {
  useUserStore.getState().setUser(firebaseUser);
});
