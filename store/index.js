import create from 'zustand';
import { persist } from 'zustand/middleware';

// App state store
export const useAppStore = create(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // UI state
      theme: 'light',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      // App state
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
      
      // Reset state
      resetState: () => set({ 
        user: null, 
        isLoading: false 
        // Keep theme preference
      }),
    }),
    {
      name: 'coffylapse-storage',
      partialize: (state) => ({ user: state.user, theme: state.theme }),
    }
  )
);

// Blockchain connection store
export const useBlockchainStore = create((set) => ({
  isConnected: false,
  address: null,
  provider: null,
  signer: null,
  
  connect: async () => {
    // Connection logic will go here
    set({ isConnected: true });
  },
  
  disconnect: () => {
    set({ 
      isConnected: false,
      address: null,
      provider: null,
      signer: null
    });
  }
}));
