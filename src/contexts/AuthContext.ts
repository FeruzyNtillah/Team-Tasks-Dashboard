import { createContext, useContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { AuthResponse } from '../types';

/**
 * Authentication context type definition
 * Provides all authentication-related state and methods
 */
export interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>;
    signIn: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<AuthResponse>;
}

/**
 * Authentication context
 * Provides authentication state and methods to all child components
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use authentication context
 * Throws error if used outside of AuthProvider
 * @returns AuthContextType
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
