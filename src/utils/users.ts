'use server';

import { getUserData } from 'helpers/getUserData';

import { getScopedI18n } from 'locales/server';

export const transAndUserData = async () => {
  const userData = await getUserData();
  // const tComments = await getScopedI18n('Comments');
  // tComments('noComments');
  return { pseudonym: userData?.pseudonym!, profilePhoto: userData?.profilePhoto! };
};
