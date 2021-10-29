import { useState, useEffect } from 'react';

export const useLocalState = (defaultValue: boolean, key: string) => {
  const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      const localValue = localStorage.getItem(key);
      localValue !== null && setValue(JSON.parse(localValue));
    }, [key])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
