'use client';

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

import { useI18n, useScopedI18n } from 'locales/client';

import { backUrl } from 'constants/links';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './DeletionFile.module.scss';

import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';

export const DeletionFile = ({ name }: { name: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState<string>('');
  const [del, setDel] = useState(false);

  const t = useI18n();
  const tDeletionFile = useScopedI18n('DeletionFile');
  const cancelRef = useRef(null);

  const onClose = () => setIsOpen(false);

  const deleteFile = async () => {
    try {
      onClose();
      setDeleting(!deleting);
      setValues(tDeletionFile('deleting'));
      await axios.delete(`${backUrl}/files/${name}`);
      setValues(tDeletionFile('deleted'));
      setDeleting(!deleting);
    } catch (e) {
      console.error(e);
      setValues(t('error'));
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
          loadingText={tDeletionFile('loadingText')}
          size="md"
          leftIcon={<DeleteIcon />}
          colorScheme="red"
          borderColor="red.500"
          w={145}
          m="1rem .5rem"
          cursor="pointer"
          onClick={() => setIsOpen(true)}>
          {tDeletionFile('deletionButton')}
        </Button>
        <div className={styles.alert}>{!!values && <Alerts valueFields={values} />}</div>
      </div>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent m="auto">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {tDeletionFile('title')}
            </AlertDialogHeader>

            <AlertDialogBody>{tDeletionFile('question')}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} borderColor="gray.100" onClick={onClose}>
                {tDeletionFile('cancelButton')}
              </Button>
              <Button colorScheme="red" borderColor="red.500" onClick={deleteFile} ml={3}>
                {tDeletionFile('deleteButton')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
