import { useState, useEffect } from "react";
import api from "@/services/api";

// Mock User type to replace Supabase User
export interface User {
  id: string; // Django ID is int, but we use string for compatibility
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('daat_token');
    const savedUser = localStorage.getItem('daat_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('daat_token');
        localStorage.removeItem('daat_user');
      }
    }
    setLoading(false);

    // Listen for 401 logout events from api.ts
    const handleLogout = () => {
      signOut();
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Django dj-rest-auth registration endpoint
      await api.post('/api/auth/registration/', {
        username: email, // Use email as username for simplicity or let backend handle it
        email: email,
        password: password,
        password2: password // dj-rest-auth might require this
      });
      // Auto login after signup? Or require login.
      // For now, let's return success and let user login.
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.response?.data?.detail || "Erro ao criar conta" } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Django dj-rest-auth login
      // Attempt 1: Standard Username = Email (dj-rest-auth default often expects 'username')
      let response;
      try {
        response = await api.post('/api/auth/login/', {
          username: email,
          password: password,
        });
      } catch (err: any) {
        // Attempt 2: Explicit Email field (if ACCOUNT_AUTHENTICATION_METHOD = 'email')
        console.log("Login attempt 1 failed, trying payload variant...");
        try {
          response = await api.post('/api/auth/login/', {
            email: email,
            password: password,
          });
        } catch (err2) {
          // Attempt 3: Username + Email (some legacy configs)
          response = await api.post('/api/auth/login/', {
            username: email,
            email: email,
            password: password,
          });
        }
      }

      const token = response.data.key || response.data.access || response.data.token;

      if (token) {
        localStorage.setItem('daat_token', token);

        // Mock user object since login endpoint might not return user details
        const mockUser: User = {
          id: 'dj-user', // unique ID
          email: email,
          user_metadata: { full_name: 'Usuário' }
        };
        // Ideally fetch user details here: const userResp = await api.get('/api/auth/user/');

        localStorage.setItem('daat_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { error: null };
      }
      return { error: { message: "Token não recebido" } };

    } catch (error: any) {
      console.error("Login Error:", error);
      const msg = error.response?.data?.non_field_errors?.[0] || "Credenciais inválidas";
      return { error: { message: msg } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('daat_token');
    localStorage.removeItem('daat_user');
    setUser(null);
    try {
      await api.post('/api/auth/logout/');
    } catch (e) {
      // ignore
    }
    return { error: null };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
}