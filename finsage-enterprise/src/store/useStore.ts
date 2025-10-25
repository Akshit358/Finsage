import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Notification } from '../types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  
  // Error state
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        sidebarOpen: true,
        theme: 'system',
        notifications: [],
        isLoading: false,
        loadingMessage: '',
        error: null,
        
        // Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        
        setTheme: (theme) => set({ theme }),
        
        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          };
          
          set((state) => ({
            notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep only last 50
          }));
        },
        
        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id),
          }));
        },
        
        markNotificationAsRead: (id) => {
          set((state) => ({
            notifications: state.notifications.map(n =>
              n.id === id ? { ...n, read: true } : n
            ),
          }));
        },
        
        clearNotifications: () => set({ notifications: [] }),
        
        setLoading: (isLoading, message = '') => set({ isLoading, loadingMessage: message }),
        
        setError: (error) => set({ error }),
        
        clearError: () => set({ error: null }),
        
        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            notifications: [],
            error: null,
          });
          localStorage.removeItem('authToken');
        },
      }),
      {
        name: 'finsage-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'finsage-store',
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useTheme = () => useAppStore((state) => state.theme);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useLoadingMessage = () => useAppStore((state) => state.loadingMessage);
export const useError = () => useAppStore((state) => state.error);

// Action selectors
export const useAppActions = () => useAppStore((state) => ({
  setUser: state.setUser,
  setAuthenticated: state.setAuthenticated,
  setSidebarOpen: state.setSidebarOpen,
  setTheme: state.setTheme,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  markNotificationAsRead: state.markNotificationAsRead,
  clearNotifications: state.clearNotifications,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  logout: state.logout,
}));
