'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useI18n } from 'locales/client';

import styles from './ChoosePlanPriButton.module.scss';
import { IoIosArrowRoundForward } from 'react-icons/io';

export const ChoosePlanPriButton = ({ pseudonym }: { pseudonym?: string }) => {
  const [open, setOpen] = useState(false);
  const { push, replace } = useRouter();

  const t = useI18n();

  const changePlan = () => (!!pseudonym ? replace(`/account/${pseudonym}`) : setOpen(!open));
  return (
    <>
      <button className={styles.choosePlan} onClick={changePlan}>
        {t('Plans.choosePlan')}
        <IoIosArrowRoundForward spacing={20} />
      </button>
      <div className={open ? styles.openButton : styles.hideButton}>
        <div className={styles.noUsersPlan}>
          <button onClick={() => push('/signin')}>{t('Nav.signIn')}</button>
          <button onClick={() => push('/signup')}>{t('Nav.signUp')}</button>
        </div>
      </div>
    </>
  );
};
