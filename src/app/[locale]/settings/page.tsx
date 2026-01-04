import { Metadata } from 'next';
import Link from 'next/link';
import { setStaticParamsLocale } from 'next-international/server';

import { getUserData } from 'helpers/getUserData';
import { getSubscriptionsOptions } from 'helpers/Paddle/paddle.server';

import { getI18n, getScopedI18n } from 'locales/server';

import { HeadCom } from 'constants/HeadCom';
import { FilesUploadType, LangType } from 'types/global.types';

import { ChangePseuDescData } from 'components/functional/atoms/ChangePseuDescData/ChangePseuDescData';
import { LanguagesSettings } from 'components/functional/atoms/LanguagesSettings';
import { ModeContainer } from 'components/functional/atoms/ModeContainer';
import { DeleteAccount } from 'components/functional/atoms/DeleteAccount/DeleteAccount';
import { AccountData } from 'components/functional/organisms/AccountData/AccountData';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Settings site for unlogged in users.');

export default async function Settings({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();
  const tAnotherForm = await getScopedI18n('AnotherForm');
  const tSettings = await getScopedI18n('Settings');

  const fileTranslated: FilesUploadType = {
    fileSelectionCancelled: tAnotherForm('fileSelectionCancelled'),
    errorOpeningFilePicker: tAnotherForm('errorOpeningFilePicker'),
    validateRequired: t('NavForm.validateRequired'),
    fileTooLarge: tAnotherForm('fileTooLarge'),
    unsupportedFileType: tAnotherForm('unsupportedFileType'),
  };

  const subscriptionsOptionsList = await getSubscriptionsOptions();

  const userData = await getUserData();

  return (
    <div className={styles.settings}>
      <h2>{tSettings('appearance')}</h2>

      <div className={styles.flow}>
        <ModeContainer light={tSettings('Mode.light')} dark={tSettings('Mode.dark')} />

        <LanguagesSettings locale={locale} />
      </div>

      {!!userData?.id && (
        <>
          <AccountData userData={userData!} subscriptionsOptionsList={subscriptionsOptionsList} />
          <h3>{t('Nav.profile')}</h3>
          <ChangePseuDescData userData={userData!} fileTranslated={fileTranslated} />
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
