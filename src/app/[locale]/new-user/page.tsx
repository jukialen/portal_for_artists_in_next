import { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/dist/app/server";

import { HeadCom } from "constants/HeadCom";

import { getScopedI18n } from "locales/server";

import { NewUserForm } from "components/molecules/NewUserForm/NewUserForm";

export const metadata: Metadata = HeadCom('Site for new user');

export default async function NewUser({ params: { locale } }: { params: { locale: string } }) {
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

  return <NewUserForm newUserTranslate={newUserTranslate} locale={locale} />
}