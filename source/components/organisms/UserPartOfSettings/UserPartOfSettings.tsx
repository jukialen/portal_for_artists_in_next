'use client';

import { useI18n } from 'source/locales/client';

import { useUserData } from 'source/hooks/useUserData';

import { ChangePseuDescData } from 'source/components/atoms/ChangePseuDescData/ChangePseuDescData';
import { AccountData } from 'source/components/organisms/AccountData/AccountData';

export const UserPartOfSettings = () => {
  const userData = useUserData();

  const t = useI18n();

  console.log('id', userData);
  
  return !!userData?.id ? (
    <>
      <AccountData />
      <h3>{t('Nav.profile')}</h3>
      <ChangePseuDescData />
    </>
  ) : (
    <></>
  );
};
