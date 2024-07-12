import { setStaticParamsLocale } from 'next-international/server';
import { Metadata } from 'next';
import Link from 'next/link';

import { getI18n, getScopedI18n } from 'locales/server';

import { LangType } from 'types/global.types';

import { HeadCom } from 'constants/HeadCom';

import { Providers } from 'components/atoms/Providers/Providers';
import { FormSignIn } from 'components/atoms/FormSignIn/FormSignIn';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Sign in site');

export default async function Login({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);
  const t = await getI18n();
  const tNavForm = await getScopedI18n('NavForm');

  return (
    <>
      <div className={styles.login}>
        <FormSignIn locale={locale} />

        <Link href={`/${locale}/forgotten`} className={styles.forgotten}>
          {tNavForm('forgottenPasswordLink')}
        </Link>

        <div className={styles.dividerWithText}>
          <hr />
          <h4 className={styles.provider__title}>{tNavForm('providerTitleLogin')}</h4>
          <hr />
        </div>

        <Providers locale={locale} />

        <p className={styles.changeForm}>
          {tNavForm('changeToLogin')}
          <Link href={`/${locale}/signup`}>{t('Nav.signUp')}</Link>
        </p>
      </div>
    </>
  );
}
