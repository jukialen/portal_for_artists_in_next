import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Dialog } from '@ark-ui/react/dialog';

import { useI18n, useScopedI18n } from 'locales/client';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

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
        lazyMount
        unmountOnExit
        onExitComplete={() => console.log('onExitComplete invoked')}
        open={open}
        onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
        <Dialog.Trigger>
          <div className={`${styles.container} ${del ? styles.container__active : ''}`}>
            <button onClick={() => setOpen(true)}>
              <RiDeleteBinLine />
              {deleting ? tDeletionFile('loadingText') : tDeletionFile('deletionButton')}
            </button>
            <div className={styles.alert}>{!!values && <Alerts valueFields={values} />}</div>
          </div>
        </Dialog.Trigger>
        <Dialog.Content className={styles.content}>
          <Dialog.Title>{tDeletionPost('title')}</Dialog.Title>

          <Dialog.Description>{tDeletionFile('question')}</Dialog.Description>

          <div className={styles.actionButton}>
            <button className={styles.cancel}>{tDeletionFile('cancelButton')}</button>
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
