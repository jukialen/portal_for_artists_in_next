'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@chakra-ui/react';

import { LangType } from 'types/global.types';

import styles from 'components/organisms/Header/Header.module.scss';

import { BiLogInCircle } from 'react-icons/bi';
import { MdOutlineSettings } from 'react-icons/md';

type HeadersType = {
  headers: {
    title: string;
    signIn: string;
    signUp: string;
  };
  locale: LangType;
};

export const HeaderButtons = ({ headers, locale }: HeadersType) => {
  const { push } = useRouter();

  return (
    <>
      <Button
        colorScheme="yellow"
        className={styles.menu_buttons}
        id={styles.settings_button}
        onClick={() => push('/signin')}
        aria-label="sign in/up button">
        <BiLogInCircle />
        <p>{headers.signIn}</p>
      </Button>
      <Button
        colorScheme="yellow"
        onClick={() => push('/settings')}
        className={styles.menu_buttons}
        aria-label="Settings">
        <MdOutlineSettings />
        <p>{headers.title}</p>
      </Button>
    </>
  );
};
