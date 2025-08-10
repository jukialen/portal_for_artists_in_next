import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { getScopedI18n } from 'locales/server';

import { LangType } from 'types/global.types';

import styles from './AuthErrorPage.module.scss';

export default async function AuthErrorPage({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const tErrorPage = await getScopedI18n('ErrorPage');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{tErrorPage('title')}</h1>
      <p className={styles.description}>{tErrorPage('description')}</p>
      <div className={styles.actions}>
        <Link href="/" className={styles.homeButton}>
          {tErrorPage('goHome')}
        </Link>
        <Link href="/signin" className={styles.signInButton}>
          {tErrorPage('tryAgain')}
        </Link>
      </div>
    </div>
  );
}
