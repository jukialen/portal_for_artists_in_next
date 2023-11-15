'use client';

import { useI18n } from 'src/locales/client';

import { useUserData } from 'src/hooks/useUserData';

import { ChangePseuDescData } from 'src/components/atoms/ChangePseuDescData/ChangePseuDescData';
import { AccountData } from 'src/components/organisms/AccountData/AccountData';

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
