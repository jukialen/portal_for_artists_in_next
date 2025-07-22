'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@chakra-ui/react';

import styles from './HeadersButtons.module.scss';

import { BiLogInCircle } from 'react-icons/bi';
import { MdOutlineSettings } from 'react-icons/md';

type HeadersType = {
  headers: {
    title: string;
    signIn: string;
    signUp: string;
  };
};

export const HeaderButtons = ({ headers }: HeadersType) => {
  const { push } = useRouter();

  return (
    <>
      <Button
        className={styles.menu_buttons}
        id={styles.settings_button}
        onClick={() => push('/signin')}
        aria-label="sign in/up button">
        <BiLogInCircle />
        <p>{headers.signIn}</p>
      </Button>
      <Button
        onClick={() => push('/settings')}
        className={styles.menu_buttons}
        aria-label="Settings">
        <MdOutlineSettings />
        <p>{headers.title}</p>
      </Button>
    </>
  );
};
