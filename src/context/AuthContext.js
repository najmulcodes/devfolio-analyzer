import React, { createContext, useContext, useState, useEffect } from 'react';

// Navbar and Sidebar import { AuthContext }; pages use useAuth() — both valid.
export const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL || 'https://devfolio-analyzer-server.onrender.com';

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('devfolio_token');
      const storedUser  = localStorage.getItem('devfolio_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupted storage — clear it
      localStorage.removeItem('devfolio_token');
      localStorage.removeItem('devfolio_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithToken = async (authToken) => {
  const res = await fetch(`${API}/api/auth/me`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error('Invalid token');
  const { user: userData } = await res.json();
  login(userData, authToken);
};

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('devfolio_token', authToken);
    localStorage.setItem('devfolio_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('devfolio_token');
    localStorage.removeItem('devfolio_user');
  };

  const value = { user, token, loading, login, loginWithToken, logout };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Convenience hook ──────────────────────────────────────────────────────────
// Pages: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
