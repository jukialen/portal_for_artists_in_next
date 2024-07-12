import { getScopedI18n } from 'locales/server';

import { AsideWrapper } from 'components/molecules/AsideWrapper/AsideWrapper';

import { getUserData } from 'helpers/getUserData';

export async function Aside() {
  const tAside = await getScopedI18n('Aside');
  const userData = await getUserData();

  return <AsideWrapper asideCategory={tAside('category')} userData={userData!} />;
}
