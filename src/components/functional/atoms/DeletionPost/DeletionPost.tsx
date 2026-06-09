'use client';

import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Dialog } from '@ark-ui/react/dialog';

import { useI18n, useScopedI18n } from 'locales/client';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

import styles from './DeletionPost.module.css';
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
      <button onClick={() => setDel(!del)} className={styles.icon} aria-label="menu button for a post">
        {del ? <RxChevronUp /> : <RxChevronDown />}
      </button>

      <Dialog.Root
        id={`deletion-post-${postId}`}
        lazyMount
        unmountOnExit
        onExitComplete={() => console.log('onExitComplete invoked')}
        open={open}
        onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
        <Dialog.Trigger className={styles.container}>
          <button onClick={() => setOpen(true)}>
            <RiDeleteBinLine />
            {deleting ? tDeletionFile('loadingText') : tDeletionFile('deletionButton')}
          </button>
          <div className={styles.alert}>{!!values && <Alerts valueFields={values} />}</div>
        </Dialog.Trigger>
        <Dialog.Content className={styles.content}>
          <Dialog.Title>{tDeletionPost('title')}</Dialog.Title>

          <Dialog.Description>{tDeletionFile('question')}</Dialog.Description>

          <div className={styles.actionButton}>
            <Dialog.CloseTrigger className={styles.cancel} onClick={() => setDel(!del)}>
              {tDeletionFile('cancelButton')}
            </Dialog.CloseTrigger>
            <button className={styles.submit} onClick={deletePost}>
              {tDeletionFile('deleteButton')}
            </button>
          </div>
          <Dialog.CloseTrigger className={styles.closeButton}>Close</Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
