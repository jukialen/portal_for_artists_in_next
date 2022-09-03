import { useRef, useState } from 'react';
import { auth, db } from '../../../firebase';
import { CollectionReference, doc, getDocs, query, where, deleteDoc, Query } from 'firebase/firestore';
import { deleteObject, StorageReference } from 'firebase/storage';

import { useHookSWR } from 'hooks/useHookSWR';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './DeletionFile.module.scss';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';

type DeletionFileType = {
  subCollection: string;
  refFile: CollectionReference | Query;
  refStorage: StorageReference;
  description?: string
}

export const DeletionFile = ({ subCollection, refFile, refStorage, description }: DeletionFileType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState<string>('');
  
  const user = auth.currentUser;
  const cancelRef = useRef(null);
  const onClose = () => setIsOpen(false);
  const [del, setDel] = useState(false);
  
  const data = useHookSWR();
  
  const deleteFile = async () => {
    try {
      const queryFile = query(refFile, where('description', '==', description));
      await onClose();
      await setDeleting(!deleting);
      await setValues(data?.DeletionFile?.deleting);
      await deleteObject(refStorage!);
      const querySnapshot = await getDocs(queryFile);
      await querySnapshot.forEach((document) => {
        deleteDoc(doc(db, `users/${user?.uid}/${subCollection}/${document.id}`))
      });
      await setDeleting(!deleting);
      await setValues(data?.DeletionFile?.deleted);
      await setDeleting(!deleting);
      
    } catch (e) {
      console.log(e);
      setValues(data?.error);
    }
  };
  
  return (
    <>
      <IconButton
        icon={del ? <ChevronUpIcon /> : <ChevronDownIcon />}
        width='3rem'
        height='3rem'
        colorScheme='transparent'
        borderColor='transparent'
        color='#333'
        onClick={() => setDel(!del)}
        className={styles.icon}
        cursor='pointer'
        aria-label='menu button for a file'
        fontSize='5xl'
        variant='outline'
        position='absolute'
      />
      
      <div className={`${styles.container} ${del ? styles.container__active : ''}`}>
        <Button
          isLoading={deleting}
          loadingText={data?.DeletionFile?.loadingText}
          size='md'
          leftIcon={<DeleteIcon />}
          colorScheme='red'
          borderColor='red.500'
          w={145}
          m='1rem .5rem'
          cursor='pointer'
          onClick={() => setIsOpen(true)}
        >
          {data?.DeletionFile?.deletionButton}
        </Button>
        <div className={styles.alert}>
          {!!values && <Alerts valueFields={values} />}
        </div>
      </div>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent m='auto'>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {data?.DeletionFile?.title}
            </AlertDialogHeader>
            
            <AlertDialogBody>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              {data?.DeletionFile?.question}
            </AlertDialogBody>
            
            <AlertDialogFooter>
              <Button ref={cancelRef} borderColor='gray.100' onClick={onClose}>
                {data?.DeletionFile?.cancelButton}
              </Button>
              <Button colorScheme='red' borderColor='red.500' onClick={deleteFile} ml={3}>
                {data?.DeletionFile?.deleteButton}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
