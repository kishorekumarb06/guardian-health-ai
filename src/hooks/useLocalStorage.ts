/**
 * Health Guardian - Persistent Storage Hook
 * Saves and loads all form data to localStorage automatically.
 * Drop-in replacement for useState — data survives page refresh.
 */

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = (value: T | ((prev: T) => T)) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (err) {
            console.error("localStorage write error:", err);
        }
    };

    return [storedValue, setValue] as const;
}
