import { useRef, useState } from 'react';
import axios from 'axios';

<<<<<<< Updated upstream:components/molecules/DeletionFile/DeletionFile.tsx
import { backUrl } from 'utilites/constants';

import { useHookSWR } from 'hooks/useHookSWR';
=======
import { backUrl } from 'source/constants/links';

import { useUserData } from "source/hooks/useUserData";
>>>>>>> Stashed changes:source/components/molecules/DeletionFile/DeletionFile.tsx

import { Alerts } from 'source/components/atoms/Alerts/Alerts';

import styles from './DeletionFile.module.scss';
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
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';

type DeletionFileType = {
  name: string;
};

export const DeletionFile = ({ name }: DeletionFileType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState<string>('');
  const [del, setDel] = useState(false);

  const cancelRef = useRef(null);

  const onClose = () => setIsOpen(false);

  const data = useHookSWR();

  const deleteFile = async () => {
    try {
      await onClose();
      await setDeleting(!deleting);
      await setValues(data?.DeletionFile?.deleting);
      await axios.delete(`${backUrl}/files/${name}`);
      await setValues(data?.DeletionFile?.deleted);
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
        colorScheme="transparent"
        borderColor="transparent"
        color="#333"
        onClick={() => setDel(!del)}
        className={styles.icon}
        cursor="pointer"
        aria-label="menu button for a file"
        fontSize="5xl"
        variant="outline"
        position="absolute"
      />

      <div className={`${styles.container} ${del ? styles.container__active : ''}`}>
        <Button
          isLoading={deleting}
          loadingText={data?.DeletionFile?.loadingText}
          size="md"
          leftIcon={<DeleteIcon />}
          colorScheme="red"
          borderColor="red.500"
          w={145}
          m="1rem .5rem"
          cursor="pointer"
          onClick={() => setIsOpen(true)}>
          {data?.DeletionFile?.deletionButton}
        </Button>
        <div className={styles.alert}>{!!values && <Alerts valueFields={values} />}</div>
      </div>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent m="auto">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {data?.DeletionFile?.title}
            </AlertDialogHeader>

            <AlertDialogBody>{data?.DeletionFile?.question}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} borderColor="gray.100" onClick={onClose}>
                {data?.DeletionFile?.cancelButton}
              </Button>
              <Button colorScheme="red" borderColor="red.500" onClick={deleteFile} ml={3}>
                {data?.DeletionFile?.deleteButton}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
