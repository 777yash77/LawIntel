'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';

// A mock user type
export type User = {
  email: string;
  name: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user in localStorage
    try {
      const storedUser = localStorage.getItem('lexigen-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Could not parse user from localStorage", error);
      // If there's an error, ensure user is logged out
      localStorage.removeItem('lexigen-user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string) => {
    const newUser: User = { email, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('lexigen-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lexigen-user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
