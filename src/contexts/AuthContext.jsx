import React, { createContext, useContext, useState, useEffect } from 'react';
import FullScreenLoader from '../components/FullScreenLoader';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const MIN_LOADER_TIME = 1500; // milliseconds
    const startTime = Date.now();
    let timeoutId;

    const finishLoading = () => {
      const elapsed = Date.now() - startTime;
      const remaining = MIN_LOADER_TIME - elapsed;
      if (remaining > 0) {
        timeoutId = setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    };

    try {
      const existingId = window.localStorage.getItem('clientId');
      if (existingId) {
        setCurrentUser({ clientId: existingId });
        finishLoading();
      } else {
        const generatedId =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        window.localStorage.setItem('clientId', generatedId);
        setCurrentUser({ clientId: generatedId });
        finishLoading();
      }
    } catch (error) {
      console.error(error);
      finishLoading();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <FullScreenLoader /> : children}
    </AuthContext.Provider>
  );
};
