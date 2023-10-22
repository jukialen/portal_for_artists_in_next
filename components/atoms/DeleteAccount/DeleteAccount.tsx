'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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

import { backUrl } from 'constants/links';

import { useCurrentLocale, useI18n, useScopedI18n } from "locales/client";

import { useUserData } from 'hooks/useUserData';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './DeleteAccount.module.scss';
import { DeleteIcon } from '@chakra-ui/icons';

export const DeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState('');
  const cancelRef = useRef(null);
  const toast = useToast();

  const userData = useUserData();
  
  const locale = useCurrentLocale();
  const t = useI18n();
  const tContact = useScopedI18n('Contact');
  const tDeletionAccount = useScopedI18n('DeletionAccount');

  const { push } = useRouter();
  const onClose = () => setIsOpen(false);

  const deletionUser = async () => {
    try {
      onClose();
      setDeleting(!deleting);
      setValues(tDeletionAccount('deletionAccount'));
      const res = await axios.delete(`${backUrl}/users/${userData?.pseudonym}`);
      setValues('');

      res.status === 200
        ? toast({
            description: tContact('success'),
            status: 'success',
            variant: 'subtle',
            duration: 9000,
          })
        : toast({
            description: tContact('fail'),
            status: 'error',
            variant: 'subtle',
            duration: 9000,
          });

      setDeleting(!deleting);
      push(`${locale}/`);
    } catch (e) {
      setValues(t('error'));
      console.error(e);
    }
  };

  return (
    <div className={styles.deleteDiv}>
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
        {`${tDeletionAccount('button')} account`}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent m="auto">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {tDeletionAccount('title')}
            </AlertDialogHeader>

            <AlertDialogBody>{tDeletionAccount('body')}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} borderColor="gray.100" onClick={onClose}>
                {tDeletionAccount('cancel')}
              </Button>
              <Button colorScheme="red" borderColor="red.500" onClick={deletionUser} ml={3}>
                {tDeletionAccount('button')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {!!values && <Alerts valueFields={values} />}
    </div>
  );
};
