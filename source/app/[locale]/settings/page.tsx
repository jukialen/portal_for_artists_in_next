import { Metadata } from 'next';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { checkinSession } from 'source/helpers/components/checkingSession';
import { SessionAuthForNextJS } from 'source/helpers/components/sessionAuthForNextJS';

import { getI18n, getScopedI18n } from 'source/locales/server';

import { HeadCom } from 'source/constants/HeadCom';

import { LanguagesSettings } from 'source/components/atoms/LanguagesSettings';
import { ModeContainer } from 'source/components/atoms/ModeContainer';
import { DeleteSettings } from 'source/components/molecules/DeleteSettings/DeleteSettings';
import { UserPartOfSettings } from 'source/components/organisms/UserPartOfSettings/UserPartOfSettings';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Settings site for unlogged in users.');

export default async function Settings({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);
  const t = await getI18n();
  const tSettings = await getScopedI18n('Settings');

  await checkinSession(locale);

  return (
    <SessionAuthForNextJS>
      <div className={styles.settings}>
        <h2 className={styles.settings_title}>{t('title')}</h2>

        <h3>{tSettings('appearance')}</h3>

        <div className={styles.flow}>
          <ModeContainer />

          <LanguagesSettings />
        </div>

        <UserPartOfSettings />

        <footer>
          <button className={styles.links}>
            <Link href={`/${locale}/terms`}>{t('Footer.termsOfUse')}</Link>
          </button>
          <button className={styles.links}>
            <Link href={`/${locale}/privacy`}>{t('Footer.privacyPolice')}</Link>
          </button>
          <button className={styles.links}>
            <Link href={`/${locale}/contact`}>{t('Footer.contact')}</Link>
          </button>
          <button className={styles.links}>
            <Link href={`/${locale}/faq`}>{t('Footer.faq')}</Link>
          </button>
          <button className={styles.links}>
            <Link href={`/${locale}/plans`}>{t('Footer.plans')}</Link>
          </button>
        </footer>

        <DeleteSettings />
      </div>
    </SessionAuthForNextJS>
  );
}
