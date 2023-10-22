'use client'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { LangType } from 'types/global.types';

export const usePreferLanguage = (langLocale: string) => {
  const { replace } = useRouter();
  const pathname = usePathname()

  const localst = typeof window !== 'undefined' && localStorage.getItem('lang');

  const refresh = async (langLocale: string) => {
    console.log(`${process.env.NEXT_PUBLIC_PAGE}${langLocale === 'en' ? '' : `/${langLocale}`}${pathname}`);
    return replace(`/${langLocale === 'en' ? '' : langLocale}${pathname}`);
  };

  const [lang, setLang] = useState(langLocale);

  useEffect(() => {
    if (localst === null) {
      switch (langLocale) {
        case 'jp':
          localStorage.setItem('lang', 'jp');
          setLang('jp');
          //          refresh('jp');
          break;
        case 'pl':
          localStorage.setItem('lang', langLocale);
          setLang(langLocale!);
          //          refresh('pl');
          //          replace(`pl${pathname}`);
          break;
        default:
          localStorage.setItem('lang', langLocale!);
          setLang(langLocale!);
          //          refresh('en');
          //          replace(pathname);
          break;
      }
    } else {
      if (locale !== localst) {
        setLang(localst.toString());
        refresh(localst.toString());
      } else {
        setLang(locale!);
        localStorage.setItem('lang', locale!);
        refresh(locale!);
      }
    }
  }, []);

  return lang;
};
