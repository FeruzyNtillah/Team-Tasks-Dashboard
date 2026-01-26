import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.client';
import { useAuth } from '../contexts/AuthContext';

export const useEmailVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const resendVerificationEmail = async () => {
    if (!user?.email) {
      setError('No email address found');
      return;
    }

    setIsVerifying(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setVerificationSent(true);
        setMessage('Verification email sent! Please check your inbox.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const checkEmailVerification = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error checking verification:', error);
        return;
      }

      if (data.user?.email_confirmed_at) {
        setMessage('Email verified successfully!');
        return true;
      }
    } catch (err: any) {
      console.error('Error checking verification:', err);
    }
    return false;
  };

  useEffect(() => {
    if (user && !user.email_confirmed_at) {
      setMessage('Please verify your email address to access all features.');
    }
  }, [user]);

  return {
    isVerifying,
    verificationSent,
    error,
    message,
    resendVerificationEmail,
    checkEmailVerification,
    isEmailVerified: user?.email_confirmed_at ? true : false,
  };
};
