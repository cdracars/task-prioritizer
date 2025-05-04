import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state that is persisted in localStorage.
 *
 * @template T The type of the state value
 * @param {string} key The localStorage key to store the value under
 * @param {T} initialValue The initial value if no value is found in localStorage
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} A stateful value and a function to update it
 */
function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    // Get from local storage then parse stored json or return initialValue
    const readValue = (): T => {
        // Prevent build error "window is undefined" but keeps working
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Listen for changes to this localStorage key in other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                setStoredValue(JSON.parse(e.newValue) as T);
            }
        };

        // Add event listener for window storage changes
        window.addEventListener('storage', handleStorageChange);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;
