import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, storage } from '../../../firebase';
import { deleteUser } from 'firebase/auth';
import { deleteDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
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

import { useHookSWR } from 'hooks/useHookSWR';

import { user } from 'config/referencesFirebase';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './DeleteAccount.module.scss';
import { DeleteIcon } from '@chakra-ui/icons';

export const DeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState<string>('');
  const cancelRef = useRef(null);
  const toast = useToast();

  const { push } = useRouter();
  const data = useHookSWR();

  const currentUser = auth.currentUser!;

  const profileUserRef = ref(storage, `profilePhotos/${currentUser?.uid}/${currentUser?.uid}`);

  const onClose = () => setIsOpen(false);

  const deletionUser = async () => {
    try {
      await onClose();
      await setDeleting(!deleting);
      await deleteObject(profileUserRef);
      await setValues(data?.DeletionAccount?.deletionProfilePhoto);
      await deleteDoc(user(currentUser?.uid));
      await setValues(data?.DeletionAccount?.deletionAccount);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_PAGE}/api/deleteUser`, {
        email: currentUser!.email,
        uid: currentUser!.uid,
      });
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
      await deleteUser(currentUser);
      await setDeleting(!deleting);
      await push('/');
    } catch (e) {
      setValues(data?.error);
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
        colorScheme="red"
        borderColor="red.500"
        w={145}
        m={4}
        onClick={() => setIsOpen(true)}>
        {data?.DeletionAccount?.button}
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
