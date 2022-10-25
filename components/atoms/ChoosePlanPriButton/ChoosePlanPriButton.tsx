import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';
import { Button } from '@chakra-ui/react';

import { StatusLoginContext } from 'providers/StatusLogin';
import { NavFormContext } from 'providers/NavFormProvider';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './ChoosePlanPriButton.module.scss';
import { ArrowForwardIcon } from '@chakra-ui/icons';

export const ChoosePlanPriButton = () => {
  const { isUser } = useContext(StatusLoginContext);
  const data = useHookSWR();
  const { replace } = useRouter();
  const [open, setOpen] = useState(false);

  const { isLogin, showLoginForm, showCreateForm } = useContext(NavFormContext);
  const currentUser = auth.currentUser?.uid;

  const changePlan = () => {
    isUser ? replace(`/account/${currentUser}`) : setOpen(!open);
  };

  const openLogin = () => {
    console.log(isLogin);
    showLoginForm();
  };

  return (
    <>
      <Button
        colorScheme="whiteAlpha"
        iconSpacing={20}
        rightIcon={<ArrowForwardIcon />}
        className={styles.choosePlan}
        onClick={changePlan}>
        {data?.Pricing?.choosePlan}
      </Button>
      <div className={open ? styles.openButton : styles.hideButton}>
        <div className={styles.noUsersPlan}>
          <Button colorScheme="whiteAlpha" onClick={openLogin}>
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
