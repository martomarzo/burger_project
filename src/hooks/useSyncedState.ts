"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

declare global {
  interface Window {
    BURGER_CONFIG?: { token?: string };
  }
}

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return window.BURGER_CONFIG?.token ?? '';
}

/**
 * Drop-in replacement for useLocalStorage that mirrors state to the server when
 * a token is configured (via /config.js), and falls back to localStorage when
 * offline / unconfigured. Whole-state save, debounced ~700ms (playbook pattern).
 *
 * @param key       localStorage key (offline cache)
 * @param initialValue  default when nothing is stored
 * @param apiPath   the /api/<apiPath> collection to sync (e.g. 'ingredients')
 */
function useSyncedState<T>(key: string, initialValue: T, apiPath: string): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onlineRef = useRef<boolean>(false);

  const readLocal = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const writeLocal = useCallback(
    (value: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* quota / private mode — ignore */
      }
    },
    [key]
  );

  const pushToServer = useCallback(
    (value: T) => {
      const token = getToken();
      if (!token) return;
      fetch(`/api/${apiPath}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(value),
      }).catch(() => {
        /* network blip — localStorage still holds the value */
      });
    },
    [apiPath]
  );

  // Load: prefer the server when configured, else localStorage. On first
  // connect, migrate any existing local data up to an empty server.
  useEffect(() => {
    let cancelled = false;
    const local = readLocal();
    const token = getToken();

    if (!token) {
      setStoredValue(local);
      return;
    }

    onlineRef.current = true;
    fetch(`/api/${apiPath}`, { headers: { authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((serverValue: T) => {
        if (cancelled) return;
        const serverEmpty = Array.isArray(serverValue) && serverValue.length === 0;
        const localHasData = Array.isArray(local) && local.length > 0;
        if (serverEmpty && localHasData) {
          // One-time import of existing local data.
          setStoredValue(local);
          writeLocal(local);
          pushToServer(local);
        } else {
          setStoredValue(serverValue);
          writeLocal(serverValue);
        }
      })
      .catch(() => {
        if (!cancelled) setStoredValue(local);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? (value as (p: T) => T)(prev) : value;
        writeLocal(newValue);
        if (onlineRef.current) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => pushToServer(newValue), 700);
        }
        return newValue;
      });
    },
    [writeLocal, pushToServer]
  );

  return [storedValue, setValue];
}

export default useSyncedState;
