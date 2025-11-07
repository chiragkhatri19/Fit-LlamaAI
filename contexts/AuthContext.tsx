import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile } from '../types';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  authMethod: 'email' | 'google';
}

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  signUpWithGoogle: (credential: string) => Promise<void>;
  signOut: () => void;
  updateUserProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user and profile from localStorage
    try {
      const storedUser = localStorage.getItem('authUser');
      const storedProfile = localStorage.getItem('userProfile');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
      localStorage.removeItem('authUser');
      localStorage.removeItem('userProfile');
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // In a real app, this would call your backend API
    // For now, we'll simulate with localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const authUser: AuthUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      picture: foundUser.picture,
      authMethod: 'email',
    };

    setUser(authUser);
    localStorage.setItem('authUser', JSON.stringify(authUser));

    // Load user profile if exists (check both user-specific and legacy storage)
    const userProfileKey = `userProfile_${foundUser.id}`;
    const profile = localStorage.getItem(userProfileKey) || localStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
      // Also save to user-specific key for consistency
      localStorage.setItem(userProfileKey, profile);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    // In a real app, this would call your backend API
    // For now, we'll simulate with localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In production, this should be hashed
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      authMethod: 'email',
    };

    setUser(authUser);
    localStorage.setItem('authUser', JSON.stringify(authUser));
  };

  const signInWithGoogle = async (credential: string) => {
    // Handle Google OAuth response (can be JWT or user info object)
    try {
      let payload: any;
      
      // Check if it's a base64 encoded JWT token
      if (credential.includes('.')) {
        payload = JSON.parse(atob(credential.split('.')[1]));
      } else {
        // If it's already a JSON string
        try {
          payload = JSON.parse(credential);
        } catch {
          // If it's already an object (from our mock)
          payload = credential;
        }
      }

      const authUser: AuthUser = {
        id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        authMethod: 'google',
      };

      setUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));

      // Load user profile if exists (check both user-specific and legacy storage)
      const userProfileKey = `userProfile_${authUser.id}`;
      const profile = localStorage.getItem(userProfileKey) || localStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setUserProfile(parsedProfile);
        // Also save to user-specific key for consistency
        localStorage.setItem(userProfileKey, profile);
      }
    } catch (error) {
      console.error('Failed to process Google sign in:', error);
      throw new Error('Failed to sign in with Google');
    }
  };

  const signUpWithGoogle = async (credential: string) => {
    // For Google, sign up and sign in are the same
    await signInWithGoogle(credential);
  };

  const signOut = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('authUser');
    // Don't remove userProfile - user might want to keep it for next login
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    if (user) {
      const profileJson = JSON.stringify(profile);
      localStorage.setItem(`userProfile_${user.id}`, profileJson);
      localStorage.setItem('userProfile', profileJson); // Keep for backward compatibility
    } else {
      // If no user but profile is being set (legacy case), save to default location
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signUpWithGoogle,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

