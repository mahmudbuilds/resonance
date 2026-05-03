import { useState, useEffect } from "react";
export function useLocalStorage<T>(key: string, initialValue:T) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        try {
            const value = localStorage.getItem(key);
            if (value) {
                setStoredValue(JSON.parse(value));
            }
        } catch (err) {
            console.error("Error getting from local storage", err);
        }
    }, [])
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch(err) {
            console.error("Error saving to local storage", err);
        }
    }
    return [storedValue, setValue, mounted] as const;
}