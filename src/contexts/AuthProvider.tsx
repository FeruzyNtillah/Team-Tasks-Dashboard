import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.client';
import type { User, Session } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import type { AuthResponse } from '../types';

/**
 * Props interface for AuthProvider component
 */
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * This component provides authentication context to all child components.
 * It handles:
 * - User session management
 * - Authentication state persistence
 * - Authentication operations (sign up, sign in, sign out, password reset)
 * - Real-time authentication state updates
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /**
         * Retrieves the initial session from Supabase
         * This runs once when the component mounts
         */
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Error getting initial session:', error);
                } else {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            } catch (err) {
                console.error('Unexpected error getting session:', err);
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        /**
         * Sets up a listener for authentication state changes
         * This handles real-time updates when user signs in/out
         */
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session);
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        // Cleanup subscription when component unmounts
        return () => subscription.unsubscribe();
    }, []);

    /**
     * Signs up a new user with email and password
     * @param email - User's email address
     * @param password - User's password
     * @param fullName - User's full name
     * @returns Promise with success status and error message if any
     */
    const signUp = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) {
                return { error: error.message, success: false };
            }

            return { error: null, success: true };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            return { error: message, success: false };
        }
    };

    /**
     * Signs in an existing user
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise with success status and error message if any
     */
    const signIn = async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { error: error.message, success: false };
            }

            return { error: null, success: true };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            return { error: message, success: false };
        }
    };

    /**
     * Signs out the current user
     */
    const signOut = async () => {
        await supabase.auth.signOut();
    };

    /**
     * Sends a password reset email to the user
     * @param email - User's email address
     * @returns Promise with success status and error message if any
     */
    const resetPassword = async (email: string): Promise<AuthResponse> => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                return { error: error.message, success: false };
            }

            return { error: null, success: true };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            return { error: message, success: false };
        }
    };

    // Context value object
    const value: AuthContextType = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
