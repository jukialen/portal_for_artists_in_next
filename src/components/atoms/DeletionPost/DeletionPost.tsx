import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { IconButton } from '@chakra-ui/react';
import { Button } from 'components/ui/button';
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

import styles from './DeletionPost.module.scss';
import { RiDeleteBinLine } from 'react-icons/ri';
import { RxChevronUp, RxChevronDown } from 'react-icons/rx';

type DeletionPostType = {
  postId: string;
  groupId: string;
};

export const DeletePost = ({ postId, groupId }: DeletionPostType) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState('');
  const [del, setDel] = useState(false);

  const t = useI18n();
  const tDeletionFile = useScopedI18n('DeletionFile');
  const tDeletionPost = useScopedI18n('DeletionPost');
  const selectedColor = '#FFD068';

  const deletePost = async () => {
    const supabase = createClient();

    try {
      setOpen(false);
      setDeleting(!deleting);
      setValues(tDeletionPost('deleting'));
      const { error } = await supabase.from('Posts').delete().eq('postId', postId).eq('groupId', groupId);

      if (!!error) {
        setValues('');
        return;
      }
      setValues(tDeletionPost('deleted'));
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
        onClick={() => setDel(!del)}
        className={styles.icon}
        aria-label="menu button for a post"
        fontSize="5xl"
        variant="outline">
        {del ? <RxChevronUp /> : <RxChevronDown />}
      </IconButton>

      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
        <DialogTrigger>
          <div className={`${styles.container} ${del ? styles.container__active : ''}`}>
            <Button
              loading={deleting}
              loadingText={tDeletionFile('loadingText')}
              colorScheme="red"
              borderColor="red.500"
              onClick={() => setOpen(true)}>
              <RiDeleteBinLine />
              {tDeletionFile('deletionButton')}
            </Button>
            <div className={styles.alert}>{!!values && <Alerts valueFields={values} />}</div>
          </div>
        </DialogTrigger>
        <DialogContent m="auto">
          <DialogHeader fontSize="lg" fontWeight="bold">
            <DialogTitle>{tDeletionPost('title')}</DialogTitle>
          </DialogHeader>

          <DialogBody>{tDeletionFile('question')}</DialogBody>

          <DialogFooter>
            <DialogActionTrigger borderColor="gray.100">{tDeletionFile('cancelButton')}</DialogActionTrigger>
            <Button colorScheme="red" borderColor="red.500" onClick={deletePost} ml={3}>
              {tDeletionFile('deleteButton')}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger color={selectedColor} borderColor="transparent" />
        </DialogContent>
      </DialogRoot>
    </>
  );
};
