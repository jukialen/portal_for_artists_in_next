import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { setStaticParamsLocale } from 'next-international/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getI18n } from 'locales/server';

import { LangType } from 'types/global.types';
import { HeadCom } from 'constants/HeadCom';

import { NewPasswordForm } from "components/molecules/NewPasswordForm/NewPasswordForm";

export const metadata: Metadata = HeadCom('The site for resetting password.');

export default async function NewPassword({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const translate = {
    success: t('NewPassword.success'),
    unknownError: t('unknownError'),
    error: t('error'),
    title: t('NewPassword.title'),
    subtitle: t('NewPassword.subtitle'),
    password: t('NavForm.password'),
    buttonAria: t('NewPassword.buttonAria'),
    send: t('AnotherForm.send'),
  }
  const supabase = createServerComponentClient({ cookies });

  return <NewPasswordForm translate={translate} />
  
}
