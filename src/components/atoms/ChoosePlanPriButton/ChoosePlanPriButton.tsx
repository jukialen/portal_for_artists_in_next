'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@chakra-ui/react';

import { useUserData } from 'hooks/useUserData';

import { useI18n } from 'locales/client';

import styles from './ChoosePlanPriButton.module.scss';
import { ArrowForwardIcon } from '@chakra-ui/icons';

export const ChoosePlanPriButton = () => {
  const [open, setOpen] = useState(false);
  const { push, replace } = useRouter();
  const userData = useUserData();

  const t = useI18n();

  const changePlan = () => (userData?.pseudonym ? replace(`/account/${userData.pseudonym}`) : setOpen(!open));

  return (
    <>
      <Button
        colorScheme="whiteAlpha"
        iconSpacing={20}
        rightIcon={<ArrowForwardIcon />}
        className={styles.choosePlan}
        onClick={changePlan}>
        {t('Plans.choosePlan')}
      </Button>
      <div className={open ? styles.openButton : styles.hideButton}>
        <div className={styles.noUsersPlan}>
          <Button colorScheme="whiteAlpha" onClick={() => push('/signin')}>
            {t('Nav.signIn')}
          </Button>
          <Button colorScheme="whiteAlpha" onClick={() => push('/signup')}>
            {t('Nav.signUp')}
          </Button>
        </div>
      </div>
    </>
  );
};
