import Image from 'next/image';
import Link from 'next/link';

import { getI18n } from 'locales/server';

import styles from './Header.module.scss';
import { BiLogInCircle } from 'react-icons/bi';
import { MdOutlineSettings } from 'react-icons/md';

export const Header = async () => {
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

      <section className={styles.menuButtons}>
        <Link href="/signin" className={styles.menu_button} aria-label="sign in link">
          <BiLogInCircle />
          <p>{headers.signIn}</p>
        </Link>
        <Link href={'/signup'} className={styles.menu_button} id={styles.signupLink} aria-label="Sign up link">
          <p>{headers.signUp}</p>
        </Link>
        <Link href="/settings" className={styles.menu_button} aria-label="Settings">
          <MdOutlineSettings />
          <p>{headers.title}</p>
        </Link>
      </section>
    </header>
  );
};
