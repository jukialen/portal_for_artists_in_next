import { Metadata } from 'next';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { getUserData } from 'helpers/getUserData';

import { getI18n, getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { LangType } from 'types/global.types';

import { ChangePseuDescData } from 'components/atoms/ChangePseuDescData/ChangePseuDescData';
import { LanguagesSettings } from 'components/atoms/LanguagesSettings';
import { ModeContainer } from 'components/atoms/ModeContainer';
import { DeleteAccount } from 'components/atoms/DeleteAccount/DeleteAccount';
import { AccountData } from 'components/organisms/AccountData/AccountData';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Settings site for unlogged in users.');

export default async function Settings({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();
  const tSettings = await getScopedI18n('Settings');

  const userData = await getUserData();

  return (
    <div className={styles.settings}>
      <h2 className={styles.settings_title}>{t('title')}</h2>

      <h3>{tSettings('appearance')}</h3>

      <div className={styles.flow}>
        <ModeContainer light={tSettings('Mode.light')} dark={tSettings('Mode.dark')} />

        <LanguagesSettings locale={locale} />
      </div>

      {!!userData?.id && (
        <>
          <AccountData userData={userData!} />
          <h3>{t('Nav.profile')}</h3>
          <ChangePseuDescData userData={userData!} />
        </>
      )}
      <footer>
        <Link href="/terms" className={styles.links}>
          {t('Footer.termsOfUse')}
        </Link>
        <Link href="/privacy" className={styles.links}>
          {t('Footer.privacyPolice')}
        </Link>
        <Link href="/contact" className={styles.links}>
          {t('Footer.contact')}
        </Link>
        <Link href="/faq" className={styles.links}>
          {t('Footer.faq')}
        </Link>
        <Link href="/plans" className={styles.links}>
          {t('Footer.plans')}
        </Link>
      </footer>

      {!!userData?.id && <DeleteAccount userData={userData!} />}
    </div>
  );
}
