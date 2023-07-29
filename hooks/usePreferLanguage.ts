'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const usePreferLanguage = () => {
  const { locale, replace, asPath } = useRouter();

  //  let browserLang = typeoff window !== 'undefined' && window.navigator.language;

  const localst = typeof window !== 'undefined' && localStorage.getItem('lang');

  //  const languageFistTwo =
  //    browserLang.toString().length === 2 ? browserLang.toString() : browserLang.toString().substring(0, 2);
  //
  const refresh = async (loc: string) => {
    //    console.log('loc', loc);
    console.log(`${process.env.NEXT_PUBLIC_PAGE}${loc === 'en' ? '' : `/${loc}`}${asPath}`);
    return replace(`/${loc === 'en' ? '' : loc}${asPath}`);
  };

  //  const [preferLang, setPreferLang] = useState(languageFistTwo);
  const [lang, setLang] = useState(locale!);

  useEffect(() => {
    console.log(localst);
    console.log(locale);
    console.log(locale !== localst);
    console.log(asPath);
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
