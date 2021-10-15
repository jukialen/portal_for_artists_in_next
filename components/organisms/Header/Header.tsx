import { useContext } from 'react';
import Link from 'next/link';

import './Header.module.scss';

import { Nav } from 'components/molecules/Nav/Nav';
import { Button } from 'components/atoms/Button/Button';

import { ModeContext } from 'providers/ModeProvider';
import { ShowMenuContext } from 'providers/ShowMenuProvider';

export function Header() {
  const { isMode, changeMode } = useContext(ModeContext);

  const { showMenu } = useContext(ShowMenuContext);

  let user;

  let titleFirstNav: string;
  let titleSecondNav: string;

  if (typeof window !== 'undefined') {
    user = window.localStorage.getItem('user');
    titleFirstNav = 'Wyloguj';
    titleSecondNav = 'Konto';
  } else {
    titleFirstNav = 'Zaloguj';
    titleSecondNav = 'Zarejestruj';
  }

  return (
    <header className="header">
      <h1 className="title">
        <Link href={!!user ? '/app' : '/'}>Portal dla artystów</Link>
      </h1>

      <Button
        classButton={isMode ? 'light__mode' : 'dark__mode'}
        ariaLabel="mode button"
        onClick={changeMode}
      />

      <Nav titleFirstNav={titleFirstNav} titleSecondNav={titleSecondNav} />

      <Button classButton="hamburger__menu" ariaLabel="menu button" onClick={showMenu} />
    </header>
  );
}
