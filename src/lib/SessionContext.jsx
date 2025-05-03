import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle magic link redirects
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSessionFromUrl();
      if (error) console.error("Auth redirect error:", error);
      
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };

    handleAuth();

    // Re-subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener?.subscription?.unsubscribe?.();
  }, []);

  return (
    <SessionContext.Provider value={{ user }}>
      {!loading && children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
