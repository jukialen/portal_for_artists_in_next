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
}

export function Header({titleFirstNav, titleSecondNav, logoLink}: TitleNav) {
  const {isMode, changeMode} = useContext(ModeContext);
  
  const {showMenu} = useContext(ShowMenuContext);
  
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <Link href={logoLink}>
          <a>Portal dla artystów</a>
        </Link>
      </h1>
      
      <button
        className={!!isMode ? styles.light__mode : styles.dark__mode}
        aria-label='mode button'
        onClick={changeMode}
        //it only work in dev tools
        // style={isMode ? {
        //   backgroundImage: `url('dark__mode.svg')`
        // } : { backgroundImage: `url('light__mode.svg')` }}
      >
        {/*<Image src={!!isMode ? '/light__mode.svg' : '/dark__mode.svg'} width='50' height='50' aria-label='mode icon' />*/}
      </button>
      
      <Nav titleFirstNav={titleFirstNav} titleSecondNav={titleSecondNav} />
      
      <button
        className={styles.hamburger__menu}
        aria-label='menu button'
        onClick={showMenu}
      >
        <Image src={'/menu.svg'} width='50' height='50' aria-label='menu icon' />
      </button>
    </header>
  );
}
