'use client';

import { useI18n } from 'locales/client';

import { useUserData } from 'hooks/useUserData';

import { ChangePseuDescData } from 'components/atoms/ChangePseuDescData/ChangePseuDescData';
import { AccountData } from 'components/organisms/AccountData/AccountData';

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
