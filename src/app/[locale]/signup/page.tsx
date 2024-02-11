import { Metadata } from 'next';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { LangType } from "types/global.types";

import { HeadCom } from 'constants/HeadCom';

import { getI18n, getScopedI18n } from 'locales/server';

import { Providers } from 'components/atoms/Providers/Providers';

import { FormSignUp } from 'components/atoms/FormSignUp/FormSignUp';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Sign up site');

export default async function Registration({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tNavForm = await getScopedI18n('NavForm');

  return (
    <>
      <div className={styles.create__account}>
        <FormSignUp locale={locale} />

        <div className={styles.dividerWithText}>
          <hr />
          <h4 className={styles.provider__title}>{tNavForm('providerTitleRegistration')}</h4>
          <hr />
        </div>

        <Providers locale={locale} />

        <p className={styles.acceptInfo}>
          {tNavForm('acceptInfoOne')}
          <Link href={`/${locale}/terms`}>{tNavForm('acceptInfoTwo')}</Link>
          {tNavForm('acceptInfoThree')}
          <Link href={`/${locale}/privacy`}>{tNavForm('acceptInfoFour')}</Link>
          {tNavForm('dot')}
        </p>

        <p className={styles.changeForm}>
          {tNavForm('changeToCreate')}
          <Link href={`/${locale}/signin`}>{t('Nav.signIn')}</Link>
        </p>
      </div>
    </>
  );
}
