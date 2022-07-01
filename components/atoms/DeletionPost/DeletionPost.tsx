import { useRef, useState } from 'react';
import { deleteDoc } from 'firebase/firestore';

import { deletingPost } from 'references/referencesFirebase';

import { useHookSWR } from 'hooks/useHookSWR';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './DeletionPost.module.scss';
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

type DeletionPostType = {
  name: string;
  idPost: string;
}

export const DeletePost = ({ name, idPost }: DeletionPostType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState<string>('');
  
  const cancelRef = useRef(null);
  const onClose = () => setIsOpen(false);
  const [del, setDel] = useState(false);
  
  const data = useHookSWR();
  
  const deletePost = async () => {
    try {
      await onClose();
      await setDeleting(!deleting);
      await setValues(data?.DeletionPost?.deleting);
      await deleteDoc(deletingPost(name, idPost));
      await setValues(data?.DeletionPost?.deleted);
      await setDeleting(!deleting);
    } catch (e) {
      console.error(e);
      setValues(data?.error);
    }
  };
  
  return (
    <>
      <IconButton
        icon={del ? <ChevronUpIcon /> : <ChevronDownIcon />}
        height='3rem'
        onClick={() => setDel(!del)}
        className={styles.icon}
        aria-label='menu button for a post'
        fontSize='5xl'
        variant='link'
      />
      
      <div className={`${styles.container} ${del ? styles.container__active : ''}`}>
        <Button
          isLoading={deleting}
          loadingText={data?.DeletionFile?.loadingText}
          size='md'
          leftIcon={<DeleteIcon />}
          colorScheme='red'
          borderColor='red.500'
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
              {data?.DeletionPost?.title}
            </AlertDialogHeader>
            
            <AlertDialogBody>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              {data?.DeletionFile?.question}
            </AlertDialogBody>
            
            <AlertDialogFooter>
              <Button ref={cancelRef} borderColor='gray.100' onClick={onClose}>
                {data?.DeletionFile?.cancelButton}
              </Button>
              <Button colorScheme='red' borderColor='red.500' onClick={deletePost} ml={3}>
                {data?.DeletionFile?.deleteButton}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};