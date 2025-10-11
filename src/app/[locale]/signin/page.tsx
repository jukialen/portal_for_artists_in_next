import { setStaticParamsLocale } from 'next-international/server';
import { Metadata } from 'next';
import Link from 'next/link';

import { getI18n, getScopedI18n } from 'locales/server';

import { LangType } from 'types/global.types';

import { HeadCom } from 'constants/HeadCom';

import { Providers } from 'components/functional/atoms/Providers/Providers';
import { FormSignIn } from 'components/functional/atoms/FormSignIn/FormSignIn';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Sign in site');

export default async function Login({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();
  const tNavForm = await getScopedI18n('NavForm');

  const translated = {
    unVerified: tNavForm('unVerified'),
    statusLogin: tNavForm('statusLogin'),
    wrongLoginData: tNavForm('wrongLoginData'),
    titleOfLogin: tNavForm('titleOfLogin'),
    email: tNavForm('email'),
    password: tNavForm('password'),
    loginSubmit: tNavForm('loginSubmit'),
  };

  return (
    <>
      <div className={styles.login}>
        <div className={styles.orientation}>
          <FormSignIn translated={translated} />

          <Link href={'/forgotten'} className={styles.forgotten}>
            {tNavForm('forgottenPasswordLink')}
          </Link>
        </div>
        <div className={styles.orientation}>
          <div className={styles.dividerWithText}>
            <hr />
            <h4 className={styles.provider__title}>{tNavForm('providerTitleLogin')}</h4>
            <hr />
          </div>

          <Providers />

          <p className={styles.changeForm}>
            {tNavForm('changeToLogin')}
            <Link href={'/signup'}>{t('Nav.signUp')}</Link>
          </p>
        </div>
      </div>
    </>
  );
}
