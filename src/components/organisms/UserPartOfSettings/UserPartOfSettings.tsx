import { getI18n } from 'locales/server';

import { getUserData } from 'helpers/getUserData';

import { ChangePseuDescData } from 'components/atoms/ChangePseuDescData/ChangePseuDescData';
import { AccountData } from 'components/organisms/AccountData/AccountData';

export const UserPartOfSettings = async () => {
  const userData = await getUserData();
  const t = await getI18n();
  
  return !!userData?.id ? (
    <>
      <AccountData userData={userData!} />
      <h3>{t('Nav.profile')}</h3>
      <ChangePseuDescData userData={userData!} />
    </>
  ) : (
    <></>
  );
};
