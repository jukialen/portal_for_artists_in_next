'use client';

import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Dialog } from '@ark-ui/react/dialog';

import { useI18n, useScopedI18n } from 'locales/client';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

import styles from './DeletionFile.module.css';
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
      setDeleting(true);
      setValues(tDeletionFile('deleting'));
      const { error } = await supabase.from('Files').delete().eq('fileId', fileId);

      if (!!error) {
        setValues(t('error'));
        setDeleting(false);
        return;
      }

      setValues(tDeletionFile('deleted'));
      setDeleting(false);
    } catch (e) {
      console.error(e);
      setValues(t('error'));
      setDeleting(false);
    }
  };

  return (
    <>
      <button onClick={() => setDel(!del)} className={styles.icon} aria-label="menu button for a file">
        {del ? <RxChevronUp /> : <RxChevronDown />}
      </button>

      <Dialog.Root lazyMount unmountOnExit open={open} onOpenChange={(details) => setOpen(details.open)}>
        <Dialog.Trigger asChild>
          <div className={styles.container} style={{ display: del ? 'flex' : 'none' }}>
            <button type="button">
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
            <Dialog.CloseTrigger className={styles.cancel}>{tDeletionFile('cancelButton')}</Dialog.CloseTrigger>
            <button type="button" className={styles.container} onClick={deleteFile}>
              {tDeletionFile('deleteButton')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
