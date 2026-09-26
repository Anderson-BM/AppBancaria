import { useCallback, useState } from 'react';
import { loadData, saveData, setSessionActive, isSessionActive, clearSession } from '../../storage/storage.js';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(isSessionActive());

  const hasPin = useCallback(() => {
    return Boolean(loadData().pin);
  }, []);

  const createPin = useCallback((pin) => {
    const data = loadData();
    data.pin = pin;
    saveData(data);
    setSessionActive();
    setAuthenticated(true);
  }, []);

  const login = useCallback((pin) => {
    const data = loadData();
    if (data.pin === pin) {
      setSessionActive();
      setAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAuthenticated(false);
  }, []);

  return { authenticated, hasPin, createPin, login, logout };
}
