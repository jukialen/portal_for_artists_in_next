import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { getI18n } from 'locales/server';

import { LangType } from 'types/global.types';
import { HeadCom } from 'constants/HeadCom';

import { NewPasswordForm } from 'components/functional/molecules/NewPasswordForm/NewPasswordForm';

export const metadata: Metadata = HeadCom('The site for resetting password.');

export default async function NewPassword({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
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
  };

  return <NewPasswordForm translate={translate} />;
}
