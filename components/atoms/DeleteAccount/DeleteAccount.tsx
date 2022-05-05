import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db, storage } from '../../../firebase';
import { deleteUser } from '@firebase/auth';
import { deleteObject, ref } from 'firebase/storage';
import { deleteDoc } from '@firebase/firestore';
import { doc } from 'firebase/firestore';

import { useHookSWR } from 'hooks/useHookSWR';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { deleteCollection } from 'pages/api/deletions/storage';

import { deleterUser as delete__user } from 'pages/api/sendgrid/deleteUser';


import styles from './DeleteAccount.module.scss';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export const DeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState<string>('');
  const cancelRef = useRef(null);
  
  const { push } = useRouter();
  const data = useHookSWR();
  
  const user = auth.currentUser!;
  
  const profileUserRef = ref(storage, `profilePhotos/${user.uid}/${user?.uid}`);
  const userRef = `users/${user.uid}`;
  
  const onClose = () => setIsOpen(false);
  
  const deletionUser = async () => {
    try {
      await onClose();
      await setDeleting(!deleting);
      await deleteObject(profileUserRef);
      setValues('Usuwanie zdjęcia profilowego');
      await deleteDoc(doc(db, userRef));
      setValues('Usuwanie twoich danych');
      await deleteUser(user);
      await delete__user(user);
      await setDeleting(!deleting);
      setValues('Usunięto konto');
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
        loadingText='Deleting'
        size='md'
        leftIcon={<DeleteIcon />}
        colorScheme='red'
        borderColor='red.500'
        w={145}
        m={4}
        variant='ghost'
        onClick={() => setIsOpen(true)}
      >
        Deletion
      </Button>
      
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent m='auto'>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Account
            </AlertDialogHeader>
            
            <AlertDialogBody>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            
            <AlertDialogFooter>
              <Button ref={cancelRef} borderColor='gray.100' onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' borderColor='red.500' onClick={deletionUser} ml={3}>
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