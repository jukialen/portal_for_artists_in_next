import { Metadata } from 'next';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { LangType } from 'types/global.types';

import { HeadCom } from 'constants/HeadCom';

import { getI18n, getScopedI18n } from 'locales/server';

import { Providers } from 'components/atoms/Providers/Providers';

import { FormSignUp } from 'components/atoms/FormSignUp/FormSignUp';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Sign up site');

export default async function Registration({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const tNavForm = await getScopedI18n('NavForm');

  const translated = {
    successInfoRegistration: tNavForm('successInfoRegistration'),
    theSameEmail: tNavForm('theSameEmail'),
    titleOfRegistration: tNavForm('titleOfRegistration'),
    email: tNavForm('email'),
    password: tNavForm('password'),
    createSubmit: tNavForm('createSubmit'),
    loadingRegistration: tNavForm('loadingRegistration'),
    error: t('error'),
  };

  return (
    <>
      <div className={styles.create__account}>
        <div className={styles.orientation}>
          <FormSignUp translated={translated} />
        </div>
        <div className={styles.orientation}>
          <div className={styles.dividerWithText}>
            <hr />
            <h4 className={styles.provider__title}>{tNavForm('providerTitleRegistration')}</h4>
            <hr />
          </div>

          <Providers />

          <p className={styles.acceptInfo}>
            {tNavForm('acceptInfoOne')}
            <Link href={'/terms'}>{tNavForm('acceptInfoTwo')}</Link>
            {tNavForm('acceptInfoThree')}
            <Link href={'/privacy'}>{tNavForm('acceptInfoFour')}</Link>
            {tNavForm('dot')}
          </p>

          <p className={styles.changeForm}>
            {tNavForm('changeToCreate')}
            <Link href={'/signin'}>{t('Nav.signIn')}</Link>
          </p>
        </div>
      </div>
    </>
  );
}
