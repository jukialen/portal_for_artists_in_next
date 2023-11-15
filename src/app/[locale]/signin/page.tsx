import { setStaticParamsLocale } from 'next-international/server';
import { Metadata } from 'next';
import Link from 'next/link';

import { getI18n, getScopedI18n } from 'src/locales/server';

import { HeadCom } from 'src/constants/HeadCom';

import { Providers } from 'src/components/molecules/Providers/Providers';
import { FormSignIn } from 'src/components/atoms/FormSignIn/FormSignIn';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Sign in site');

export default async function Login({ params: { locale } }: { params: { locale: string } }) {
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

        <Providers />

        <p className={styles.changeForm}>
          {tNavForm('changeToLogin')}
          <Link href={`/${locale}/signup`}>{t('Nav.signUp')}</Link>
        </p>
      </div>
    </>
  );
}
