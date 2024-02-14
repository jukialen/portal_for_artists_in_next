import Image from 'next/image';
import Link from 'next/link';

import { getI18n } from 'locales/server';

import { HeaderButtons } from 'components/atoms/HeaderButtons/HeaderButtons';
import { Nav } from 'components/atoms/Nav/Nav';

import styles from './Header.module.scss';

export const Header = async ({ locale }: { locale: string }) => {
  const t = await getI18n();

  const headers = {
    title: t('Settings.title'),
    signIn: t('Nav.signIn'),
    signUp: t('Nav.signUp'),
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <Link href={`/${locale}`}>
          <Image src="/pfartists.png" width={58} height={58} alt="Pfartists logo" quality={100} priority />
        </Link>
      </h1>
      <div className={styles.desktop_nav}>
        <Nav headers={headers} locale={locale} />
      </div>

      <HeaderButtons headers={headers} locale={locale} />
    </header>
  );
};
