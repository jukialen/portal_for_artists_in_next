import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db, storage } from '../../../firebase';
import { deleteUser } from '@firebase/auth';
import { deleteObject, ref } from 'firebase/storage';
import { deleteDoc } from '@firebase/firestore';
import { doc } from 'firebase/firestore';

import { useHookSWR } from 'hooks/useHookSWR';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './DeleteAccount.module.scss';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  toast,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

export const DeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState<string>('');
  const cancelRef = useRef(null);
  const toast = useToast();

  const { push } = useRouter();
  const data = useHookSWR();

  const user = auth.currentUser!;

  const profileUserRef = ref(storage, `profilePhotos/${user?.uid}/${user?.uid}`);
  const userRef = `users/${user?.uid}`;

  const onClose = () => setIsOpen(false);

  const deletionUser = async () => {
    try {
      await onClose();
      await setDeleting(!deleting);
      // await deleteObject(profileUserRef);
      setValues('Usuwanie zdjęcia profilowego');
      // await deleteDoc(doc(db, userRef));
      setValues(data?.progressDeletionUser);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_PAGE}/api/deleteUser`, {
        email: user!.email,
        uid: user!.uid,
      });
      console.log(res);
      console.log(res.request);
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
      // await deleteUser(user);
      await setDeleting(!deleting);
      setValues(data?.deletionUser);
      // await push('/');
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
        Deletion
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent m="auto">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} borderColor="gray.100" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" borderColor="red.500" onClick={deletionUser} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {!!values && <Alerts valueFields={values} />}
    </div>
  );
};
