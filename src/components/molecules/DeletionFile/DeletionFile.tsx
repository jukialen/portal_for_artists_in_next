'use client';

import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Dialog } from '@ark-ui/react/dialog';

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
      <button onClick={() => setDel(!del)} className={styles.icon} aria-label="menu button for a file">
        {del ? <RxChevronUp /> : <RxChevronDown />}
      </button>

      <Dialog.Root
        lazyMount
        unmountOnExit
        onExitComplete={() => console.log('onExitComplete invoked')}
        open={open}
        onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
        <Dialog.Trigger asChild>
          <div className={`${styles.container} ${del ? styles.container__active : ''}`}>
            <button onClick={() => setOpen(true)}>
              <RiDeleteBinLine />
              {deleting ? tDeletionFile('loadingText') : tDeletionFile('deletionButton')}
            </button>
            <div className={styles.alert}>{!!values && <Alerts valueFields={values} />}</div>
          </div>
        </Dialog.Trigger>
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>{tDeletionFile('title')}</Dialog.Title>

          <Dialog.Description>{tDeletionFile('question')}</Dialog.Description>

          <div className={styles.actionButton}>
            <button className={styles.cancel}>{tDeletionFile('cancelButton')}</button>
            <button className={styles.submit} onClick={deleteFile}>
              {tDeletionFile('deleteButton')}
            </button>
          </div>

          <Dialog.CloseTrigger className={styles.closeButton} />
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
