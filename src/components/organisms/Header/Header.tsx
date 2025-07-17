import Image from 'next/image';
import Link from 'next/link';

import { getI18n } from 'locales/server';

import { LangType } from 'types/global.types';

import { HeaderButtons } from 'components/atoms/HeaderButtons/HeaderButtons';
import { Nav } from 'components/atoms/Nav/Nav';

import styles from './Header.module.scss';

export const Header = async ({ locale }: { locale: LangType }) => {
  const t = await getI18n();

  const headers = {
    title: t('Settings.title'),
    signIn: t('Nav.signIn'),
    signUp: t('Nav.signUp'),
  };
  
  const imgSize = 60;

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <Link href='/'>
          <Image src="/pfartists.png" width={imgSize} height={imgSize} alt="Pfartists logo" quality={100} priority />
        </Link>
      </h1>
      <div className={styles.desktop_nav}>
        <Nav headers={headers} locale={locale} />
      </div>

      <HeaderButtons headers={headers} />
    </header>
  );
};
