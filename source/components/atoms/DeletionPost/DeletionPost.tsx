import { useRef, useState } from 'react';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
} from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

<<<<<<< Updated upstream:components/atoms/DeletionPost/DeletionPost.tsx
import { backUrl } from 'utilites/constants';
=======

import { backUrl } from 'source/constants/links';
>>>>>>> Stashed changes:source/components/atoms/DeletionPost/DeletionPost.tsx

import { Alerts } from 'source/components/atoms/Alerts/Alerts';

import styles from './DeletionPost.module.scss';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';

type DeletionPostType = {
  postId: string;
  groupId: string;
};

export const DeletePost = ({ postId, groupId }: DeletionPostType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState('');

  const cancelRef = useRef(null);
  const onClose = () => setIsOpen(false);
  const [del, setDel] = useState(false);

  const data = useHookSWR();

  const deletePost = async () => {
    try {
      await onClose();
      await setDeleting(!deleting);
      await setValues(data?.DeletionPost?.deleting);
      await axios.delete(`${backUrl}/posts/${postId}${groupId}`);
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
        width="3rem"
        height="3rem"
        onClick={() => setDel(!del)}
        className={styles.icon}
        aria-label="menu button for a post"
        fontSize="5xl"
        variant="link"
      />

      <div className={`${styles.container} ${del ? styles.container__active : ''}`}>
        <Button
          isLoading={deleting}
          loadingText={data?.DeletionFile?.loadingText}
          leftIcon={<DeleteIcon />}
          colorScheme="red"
          borderColor="red.500"
          onClick={() => setIsOpen(true)}>
          {data?.DeletionFile?.deletionButton}
        </Button>
        <div className={styles.alert}>{!!values && <Alerts valueFields={values} />}</div>
      </div>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent m="auto">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {data?.DeletionPost?.title}
            </AlertDialogHeader>

            <AlertDialogBody>{data?.DeletionFile?.question}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} borderColor="gray.100" onClick={onClose}>
                {data?.DeletionFile?.cancelButton}
              </Button>
              <Button colorScheme="red" borderColor="red.500" onClick={deletePost} ml={3}>
                {data?.DeletionFile?.deleteButton}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
