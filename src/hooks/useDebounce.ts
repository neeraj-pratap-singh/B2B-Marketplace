import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * Prevents excessive API calls during rapid user input
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced search with loading state
 * Provides both debounced value and loading indicator
 * 
 * @param value - The search value
 * @param delay - Delay in milliseconds (default: 500ms for better UX)
 * @returns Object with debouncedValue and isDebouncing state
 */
export function useDebounceWithLoading<T>(
  value: T, 
  delay: number = 500
): { debouncedValue: T; isDebouncing: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    // Only set debouncing state if value actually changed
    if (value !== debouncedValue) {
      setIsDebouncing(true);
    }
    
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, debouncedValue]);

  return { debouncedValue, isDebouncing };
} 