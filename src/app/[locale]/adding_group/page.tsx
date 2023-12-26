import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';

import { getI18n, getScopedI18n } from 'locales/server';

import { AddingGroupForm } from 'components/molecules/AddingGroupForm/AddingGroupForm';

export const metadata: Metadata = HeadCom("User's adding some group");

export default async function AddingGroup({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tAddingGroup = await getScopedI18n('AddingGroup');
  const tAnotherForm = await getScopedI18n('AnotherForm');

  const AddingGroupTr = {
    title: tAddingGroup('title'),
    name: tAddingGroup('name'),
    description: tAnotherForm('description'),
    profilePhoto: tAnotherForm('profilePhoto'),
    send: tAnotherForm('send'),
    uploadFile: tAnotherForm('uploadFile'),
    ariaLabelButton: t('NewUser.ariaLabelButton'),
    error: t('error'),
  };
  return <AddingGroupForm tr={AddingGroupTr} />;
}
