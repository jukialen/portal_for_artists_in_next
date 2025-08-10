'use client';

import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Button } from 'components/ui/button';
import { IconButton } from '@chakra-ui/react';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';

import { useI18n, useScopedI18n } from 'locales/client';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './DeletionFile.module.scss';
import { RiDeleteBinLine } from 'react-icons/ri';
import { RxChevronUp, RxChevronDown } from 'react-icons/rx';

export const DeletionFile = ({ fileId }: { fileId: string }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState<string>('');
  const [del, setDel] = useState(false);

  const t = useI18n();
  const tDeletionFile = useScopedI18n('DeletionFile');
  const selectedColor = 'hsl(44, 100%, 71%)';

  const deleteFile = async () => {
    const supabase = createClient();

    try {
      setOpen(false);
      setDeleting(!deleting);
      setValues(tDeletionFile('deleting'));
      const { error } = await supabase.from('Files').delete().eq('fileId', fileId);

      if (!!error) {
        setValues(t('error'));
        return;
      }

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
        position="absolute">
        {del ? <RxChevronUp /> : <RxChevronDown />}
      </IconButton>

      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <div className={`${styles.container} ${del ? styles.container__active : ''}`}>
            <Button
              loading={deleting}
              loadingText={tDeletionFile('loadingText')}
              size="md"
              colorScheme="red"
              borderColor="red.500"
              w={145}
              m="1rem .5rem"
              cursor="pointer"
              onClick={() => setOpen(true)}>
              <RiDeleteBinLine />
              {tDeletionFile('deletionButton')}
            </Button>
            <div className={styles.alert}>{!!values && <Alerts valueFields={values} />}</div>
          </div>
        </DialogTrigger>
        <DialogContent m="auto">
          <DialogHeader fontSize="lg" fontWeight="bold">
            <DialogTitle>{tDeletionFile('title')}</DialogTitle>
          </DialogHeader>

          <DialogBody>{tDeletionFile('question')}</DialogBody>

          <DialogFooter>
            <DialogActionTrigger borderColor="gray.100">{tDeletionFile('cancelButton')}</DialogActionTrigger>
            <Button colorScheme="red" borderColor="red.500" onClick={deleteFile} ml={3}>
              {tDeletionFile('deleteButton')}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger color={selectedColor} borderColor="transparent" />
        </DialogContent>
      </DialogRoot>
    </>
  );
};
