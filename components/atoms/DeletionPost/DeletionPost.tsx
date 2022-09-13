import { useRef, useState } from 'react';
import { deleteDoc, getDocs } from 'firebase/firestore';
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

import {
  deletingPost,
  docLastPostsComments,
  docPostsComments,
  docSubPostsComments,
  lastPostsComments, postsComments,
  subPostsComments
} from 'references/referencesFirebase';

import { GroupNameType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './DeletionPost.module.scss';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';

type DeletionPostType = {
  name: GroupNameType;
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
      const docsSnap = await getDocs(postsComments(name, idPost));

      for (const doc of docsSnap.docs) {
        const docsSnap2 = await getDocs(subPostsComments(name, idPost, doc.id));
        
          for (const doc2 of docsSnap2.docs) {
            const docsSnap3 = await getDocs(lastPostsComments(name, idPost, doc.id, doc2.id));

            for (const doc3 of docsSnap3.docs) {
              await deleteDoc(docLastPostsComments(name, idPost, doc.id, doc2.id, doc3.id));
            };
            await deleteDoc(docSubPostsComments(name, idPost, doc.id, doc2.id));
          };
        await deleteDoc(docPostsComments(name, idPost, doc.id))
      }
  
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
        width='3rem'
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