/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { API_BASE } from '../api/apiClient';

type BackendStatus = {
  alive: boolean;
  checking: boolean;
  check: () => Promise<boolean>;
};

const BackendStatusContext = createContext<BackendStatus>({
  alive: true,
  checking: true,
  check: async () => false,
});

export function BackendStatusProvider({ children }: { children: React.ReactNode }) {
  const [alive, setAlive] = useState(true);
  const [checking, setChecking] = useState(true);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
      if (!res.ok) {
        setAlive(false);
        return false;
      }
      const json = await res.json();
      const ok = Boolean(json && json.success);
      setAlive(ok);
      return ok;
    } catch {
      setAlive(false);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    // initial check (deferred to avoid synchronous setState in effect)
    setTimeout(() => {
      void check().catch(() => {});
    }, 0);

    // poll every 30s
    const id = setInterval(() => {
      if (!mounted) return;
      // defer to avoid setState synchronously inside effect
      setTimeout(() => {
        void check().catch(() => {});
      }, 0);
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [check]);

  return (
    <BackendStatusContext.Provider value={{ alive, checking, check }}>
      {children}
    </BackendStatusContext.Provider>
  );
}

export function useBackendStatus() {
  return useContext(BackendStatusContext);
}

export default BackendStatusContext;
