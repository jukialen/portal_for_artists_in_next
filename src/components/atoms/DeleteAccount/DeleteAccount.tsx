import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from '@chakra-ui/react';

<<<<<<< Updated upstream:components/atoms/DeleteAccount/DeleteAccount.tsx
import { useHookSWR } from 'hooks/useHookSWR';

import { backUrl } from 'utilites/constants';
=======
import { backUrl } from 'src/constants/links';

import { useCurrentLocale, useI18n, useScopedI18n } from "src/locales/client";

import { useUserData } from 'src/hooks/useUserData';
>>>>>>> Stashed changes:source/components/atoms/DeleteAccount/DeleteAccount.tsx

import { Alerts } from 'src/components/atoms/Alerts/Alerts';

import styles from './DeleteAccount.module.scss';
import { DeleteIcon } from '@chakra-ui/icons';

type DeletionPropsType = {
  pseudonym: string;
};

export const DeleteAccount = ({ pseudonym }: DeletionPropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState('');
  const cancelRef = useRef(null);
  const toast = useToast();

  const { push } = useRouter();
  const data = useHookSWR();

  const onClose = () => setIsOpen(false);

  const deletionUser = async () => {
    try {
      await onClose();
      await setDeleting(!deleting);
      await setValues(data?.DeletionAccount?.deletionAccount);
      const res = await axios.delete(`${backUrl}/users/${pseudonym}`);
      await setValues('');

      res.status === 200
        ? toast({
            description: data?.Contact?.success,
            status: 'success',
            variant: 'subtle',
            duration: 9000,
          })
        : toast({
            description: data?.Contact?.fail,
            status: 'error',
            variant: 'subtle',
            duration: 9000,
          });

      await setDeleting(!deleting);
      await push('/');
    } catch (e) {
      setValues(data?.error);
      console.error(e);
    }
  };

  return (
    <div className={styles.deleteDiv}>
      {/*<h3>Do you want to delete your account?</h3>*/}
      <Button
        isLoading={deleting}
        loadingText="Deleting"
        size="md"
        leftIcon={<DeleteIcon />}
        variant="ghost"
        colorScheme="red"
        borderColor="red.500"
        w={145}
        m={4}
        onClick={() => setIsOpen(true)}>
        {`${data?.DeletionAccount?.button} account`}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent m="auto">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {data?.DeletionAccount?.title}
            </AlertDialogHeader>

            <AlertDialogBody>{data?.DeletionAccount?.body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} borderColor="gray.100" onClick={onClose}>
                {data?.DeletionAccount?.cancel}
              </Button>
              <Button colorScheme="red" borderColor="red.500" onClick={deletionUser} ml={3}>
                {data?.DeletionAccount?.button}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {!!values && <Alerts valueFields={values} />}
    </div>
  );
};
