'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Session from 'supertokens-web-js/recipe/session';
import { MenuContext } from '../providers/MenuProvider';

export const useCurrentUser = (locale: string) => {
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();
  const pathname = usePathname();

  const { changeMenu } = useContext(MenuContext);

  const pathBoolFaq = usePathname() === `/${locale}/faq`;
  const pathBoolTerms = usePathname() === `/${locale}/terms`;
  const pathBoolContact = usePathname() === `/${locale}/contact`;
  const pathBoolMain = usePathname() === `/${locale}`;
  const pathBoolSettings = usePathname() === `/${locale}/settings`;

  const signIn = usePathname() === `/${locale}/signin`;
  const signUp = usePathname() === `/${locale}/signup`;

  const currentUser = async () => {
    if (await Session.doesSessionExist()) {
      console.log('loading', loading);
      console.log('signIn', signIn);
      changeMenu('true');

      if (signIn || signUp || pathBoolMain) push(`/${locale}/app`);
      setLoading(false);
    } else {
      console.log('loading1', loading);
      console.log('signIn1', signIn);
      if (pathBoolFaq || pathBoolTerms || pathBoolContact || pathBoolSettings) {
        setLoading(false);
        return;
      }

      push(`/${locale}/signin`);
    }
  };

  useEffect(() => {
  !!pathname && currentUser();
  }, [currentUser, pathname]);

  return loading;
};
