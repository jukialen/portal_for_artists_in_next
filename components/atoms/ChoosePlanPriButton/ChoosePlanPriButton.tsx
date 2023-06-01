import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';

import { StatusLoginContext } from 'providers/StatusLogin';
import { NavFormContext } from 'providers/NavFormProvider';

import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import styles from './ChoosePlanPriButton.module.scss';
import { ArrowForwardIcon } from '@chakra-ui/icons';

export const ChoosePlanPriButton = () => {
  const { isUser } = useContext(StatusLoginContext);
  const { showLoginForm, showCreateForm } = useContext(NavFormContext);
  const [open, setOpen] = useState(false);
  const { replace } = useRouter();
  const { pseudonym } = useUserData();
  const data = useHookSWR();

  const changePlan = () => (isUser ? replace(`/account/${pseudonym}`) : setOpen(!open));

  return (
    <>
      <Button
        colorScheme="whiteAlpha"
        iconSpacing={20}
        rightIcon={<ArrowForwardIcon />}
        className={styles.choosePlan}
        onClick={changePlan}>
        {data?.Plans?.choosePlan}
      </Button>
      <div className={open ? styles.openButton : styles.hideButton}>
        <div className={styles.noUsersPlan}>
          <Button colorScheme="whiteAlpha" onClick={showLoginForm}>
            {data?.Nav?.signIn}
          </Button>
          <Button colorScheme="whiteAlpha" onClick={showCreateForm}>
            {data?.Nav?.signUp}
          </Button>
        </div>
      </div>
    </>
  );
};
