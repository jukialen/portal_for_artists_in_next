import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'source/constants/HeadCom';

import { getI18n, getScopedI18n } from "source/locales/server";

import { ResetPasswordForm } from 'source/components/molecules/ResetPasswordForm/ResetPasswordForm';

export const metadata: Metadata = HeadCom('The site for resetting password.');

export default async function ResetPassword({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);
  
  const t = await getI18n();
  const tResetPassword = await getScopedI18n('ResetPassword');
  
  const ResetPassword = {
    wrongValues: tResetPassword('wrongValues'),
    failed: tResetPassword('failed'),
    success: tResetPassword('success'),
    unknownError: t('unknownError'),
    title: t('Forgotten.title'),
    subtitle: t('Forgotten.subtitle'),
    newPassword: t('Account.aData.newPassword'),
    againNewPassword: t('Account.aData.againNewPassword'),
    buttonAria: t('Forgotten.buttonAria'),
    changePassword: t('Account.aData.changePassword'),
  }
  
  return <ResetPasswordForm reset={ResetPassword} locale={locale} />;
}
