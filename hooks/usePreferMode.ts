'use client';

import { useEffect, useState } from 'react';

import { ModeType } from 'types/global.types';

export const usePreferMode = () => {
  const [prefer, setPrefer] = useState<ModeType>('');

  const prefer_color = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const localV = prefer_color && localStorage.getItem('mode');

  useEffect(() => {
    if (prefer === '') {
      // @ts-ignore
      setPrefer(prefer_color);
      localStorage.setItem('mode', prefer_color.toString());
    } else {
      console.log(!!localV);
      // @ts-ignore
      setPrefer(!!localV);
      localStorage.setItem('mode', localV!.toString());
    }
  }, []);

  return prefer;
};
