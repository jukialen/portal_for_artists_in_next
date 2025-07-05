import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType, Provider } from 'types/global.types';

import { getScopedI18n } from 'locales/server';

import { NewUserForm } from 'components/molecules/NewUserForm/NewUserForm';
import { createServer } from 'utils/supabase/clientSSR';

export const metadata: Metadata = HeadCom('Site for new user');

export default async function NewUser({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const tAnotherForm = await getScopedI18n('AnotherForm');
  const tNewUser = await getScopedI18n('NewUser');

  const newUserTranslate = {
    title: tNewUser('title'),
    username: tNewUser('name'),
    pseudonym: tAnotherForm('pseudonym'),
    profilePhoto: tAnotherForm('profilePhoto'),
    ariaLabelButton: tNewUser('ariaLabelButton'),
    send: tAnotherForm('send'),
    uploadFile: tAnotherForm('uploadFile'),
    successSending: tNewUser('successSending'),
    errorSending: tNewUser('errorSending'),
  };

  const supabase = await createServer();
  const userDataAuth = await supabase.auth.getUser();
  const id = userDataAuth.data.user?.id!;
  const email = userDataAuth.data.user?.email!;
  const provider = userDataAuth.data.user?.app_metadata.provider! as Provider;

  return <NewUserForm 
    newUserTranslate={newUserTranslate} 
    id={id}
    email={email}
    provider={provider}
  />;
}
