'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const usePreferLanguage = () => {
  const { locale, replace, asPath } = useRouter();

  const localst = typeof window !== 'undefined' && localStorage.getItem('lang');

  const refresh = async (loc: string) => {
    console.log(`${process.env.NEXT_PUBLIC_PAGE}${loc === 'en' ? '' : `/${loc}`}${asPath}`);
    return replace(`/${loc === 'en' ? '' : loc}${asPath}`);
  };

  const [lang, setLang] = useState(locale!);

  useEffect(() => {
    if (localst === null) {
      switch (locale) {
        case 'jp':
          localStorage.setItem('lang', 'jp');
          setLang('jp');
          //          refresh('jp');
          break;
        case 'pl':
          localStorage.setItem('lang', locale);
          setLang(locale!);
          //          refresh('pl');
          //          replace(`pl${asPath}`);
          break;
        default:
          localStorage.setItem('lang', locale!);
          setLang(locale!);
          //          refresh('en');
          //          replace(asPath);
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
