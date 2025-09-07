import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleAuthService, GoogleUser } from '../services/googleAuthService';
import { UserDataStorage } from '../utils/userDataStorage';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is already logged in from localStorage
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
    return null;
  });

  const login = async (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Initialize cloud sync after login
      const userStorage = new UserDataStorage(userData.id);
      
      // Wait a bit for Google APIs to be fully initialized
      setTimeout(async () => {
        try {
          console.log('Attempting to sync data from cloud after login...');
          const synced = await userStorage.fullSync();
          if (synced) {
            console.log('Data synced successfully after login');
            // Trigger a page refresh to update the UI with synced data
            window.location.reload();
          } else {
            console.log('No cloud data to sync or sync not available');
          }
        } catch (error) {
          console.error('Error syncing data after login:', error);
        }
      }, 2000); // Wait 2 seconds for APIs to initialize
      
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('currentUser');
      // Clear all user-specific data
      localStorage.removeItem('expenses');
      localStorage.removeItem('income');
      localStorage.removeItem('investments');
      localStorage.removeItem('bills');
      localStorage.removeItem('financialGoals');
      localStorage.removeItem('categories');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('Checking for OAuth callback...');
      console.log('Current URL:', window.location.href);
      console.log('Is callback?', GoogleAuthService.isCallback());
      
      if (GoogleAuthService.isCallback()) {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        console.log('OAuth callback detected:', { code: !!code, state: !!state });
        
        if (code && state) {
          try {
            console.log('Processing OAuth callback...');
            const googleUser = await GoogleAuthService.handleCallback(code, state);
            console.log('Google user received:', googleUser);
            
            if (googleUser) {
              const userData: User = {
                id: googleUser.id,
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
              };
              console.log('Logging in user:', userData);
              login(userData);
              
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
              console.log('URL cleaned up, user should be logged in');
            }
          } catch (error) {
            console.error('Error handling OAuth callback:', error);
          }
        }
      }
    };

    handleOAuthCallback();
  }, [login]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
