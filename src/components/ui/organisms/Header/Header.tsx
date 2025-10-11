import Image from 'next/image';
import Link from 'next/link';

import { getI18n } from 'locales/server';

import { LangType } from 'types/global.types';

import { Nav } from 'components/functional/atoms/Nav/Nav';

import styles from './Header.module.scss';
import { BiLogInCircle } from 'react-icons/bi';
import { MdOutlineSettings } from 'react-icons/md';

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
        <Link href="/">
          <Image src="/pfartists.png" width={imgSize} height={imgSize} alt="Pfartists logo" quality={100} priority />
        </Link>
      </h1>
      <div className={styles.desktop_nav}>
        <Nav headers={headers} locale={locale} />
      </div>

      <section className={styles.mobileButtons}>
        <Link href="/signin" className={styles.menu_buttons} id={styles.settings_button} aria-label="sign in/up link">
          <BiLogInCircle />
          <p>{headers.signIn}</p>
        </Link>
        <Link href="/settings" className={styles.menu_buttons} aria-label="Settings">
          <MdOutlineSettings />
          <p>{headers.title}</p>
        </Link>
      </section>
    </header>
  );
};
