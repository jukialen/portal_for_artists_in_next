import {useContext, useEffect} from 'react';
import Link from 'next/link';

import { Nav } from 'components/molecules/Nav/Nav';
import { Button } from 'components/atoms/Button/Button';

import { ModeContext } from 'providers/ModeProvider';
import { ShowMenuContext } from 'providers/ShowMenuProvider';

import styles from './Header.module.scss';

type TitleNav = {
  titleFirstNav: string;
  titleSecondNav: string;
  logoLink: string;
}

export function Header({ titleFirstNav, titleSecondNav, logoLink }: TitleNav) {
  const { isMode, changeMode } = useContext(ModeContext);

  const { showMenu } = useContext(ShowMenuContext);

  return (
  <header className={styles.header}>
    <h1 className={styles.title}>
      <Link href={logoLink}><a>Portal dla artystów</a></Link>
    </h1>

    <Button
      classButton={!!isMode ? styles.light__mode : styles.dark__mode}
      ariaLabel="mode button"
      onClick={changeMode}
    />

    <Nav titleFirstNav={titleFirstNav} titleSecondNav={titleSecondNav} />

    <Button classButton={styles.hamburger__menu} ariaLabel="menu button" onClick={showMenu} />
  </header>
  );
}
