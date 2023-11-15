import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Icon } from '@chakra-ui/react';

<<<<<<< Updated upstream:components/organisms/Header/Header.tsx
import { useHookSWR } from 'hooks/useHookSWR';

import { Nav } from 'components/molecules/Nav/Nav';
=======
import { getI18n } from "source/locales/server";

import { HeaderButtons } from "source/components/atoms/HeaderButtons/HeaderButtons";
import { Nav } from 'source/components/molecules/Nav/Nav';
>>>>>>> Stashed changes:source/components/organisms/Header/Header.tsx

import styles from './Header.module.scss';
import { MdOutlineSettings } from 'react-icons/md';
import { BiLogInCircle } from 'react-icons/bi';

export function Header() {
  const { push } = useRouter();

  const data = useHookSWR();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <Link href="/">
          <Image src="/pfartists.png" width={58} height={58} alt="Pfartists logo" quality={100} priority />
        </Link>
      </h1>
      <div className={styles.desktop_nav}>
        <Nav />
      </div>

      <Button
        colorScheme="yellow"
        className={styles.menu_buttons}
        id={styles.settings_button}
        onClick={() => push('/signin')}
        aria-label="sign in/up button">
        <Icon as={BiLogInCircle} />
        <p>{data?.Nav?.signIn}</p>
      </Button>
      <Button
        colorScheme="yellow"
        onClick={() => push('/settings')}
        className={styles.menu_buttons}
        aria-label="Settings">
        <Icon as={MdOutlineSettings} />
        <p>{data?.Settings?.title}</p>
      </Button>
    </header>
  );
}
