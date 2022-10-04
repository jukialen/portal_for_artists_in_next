import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Nav } from 'components/molecules/Nav/Nav';

import { ModeContext } from 'providers/ModeProvider';
import { ShowMenuContext } from 'providers/ShowMenuProvider';

import styles from './Header.module.scss';

type TitleNav = {
  titleFirstNav: string;
  titleSecondNav: string;
  logoLink: string;
};

export function Header({ titleFirstNav, titleSecondNav, logoLink }: TitleNav) {
  const { isMode, changeMode } = useContext(ModeContext);

  const { showMenu } = useContext(ShowMenuContext);

  const image = 40;

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <Link href={logoLink}>
          <a>
            <Image src="/pfartists.png" width={58} height={58} alt="Pfartists logo" quality={100} />
          </a>
        </Link>
      </h1>

      <button
        className={isMode ? styles.light__mode : styles.dark__mode}
        aria-label="mode button"
        onClick={changeMode}>
        <Image
          src={isMode ? '/light__mode.svg' : '/dark__mode.svg'}
          width={image}
          height={image}
          aria-label="mode icon"
          quality={100}
        />
      </button>

      <Nav titleFirstNav={titleFirstNav} titleSecondNav={titleSecondNav} />

      <button className={styles.hamburger__menu} aria-label="menu button" onClick={showMenu}>
        <Image
          src={'/menu.svg'}
          width={image}
          height={image}
          aria-label="menu icon"
          quality={100}
        />
      </button>
    </header>
  );
}
