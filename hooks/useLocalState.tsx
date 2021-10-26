import { useState, useEffect } from 'react';

export const useLocalState = (defaultValue: boolean, key: string) => {
  const [value, setValue] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const localValue = localStorage.getItem(key);
      return localValue !== null ? JSON.parse(localValue) : defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
