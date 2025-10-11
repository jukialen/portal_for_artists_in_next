'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from 'utils/supabase/clientCSR';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';

import { useI18n, useScopedI18n } from 'locales/client';

import { UserType } from 'types/global.types';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

import styles from './DeleteAccount.module.scss';
import { AiTwotoneDelete } from 'react-icons/ai';

export const DeleteAccount = ({ userData }: { userData: UserType }) => {
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState('');
  const t = useI18n();
  const tContact = useScopedI18n('Contact');
  const tDeletionAccount = useScopedI18n('DeletionAccount');

  const supabase = createClient();
  const { push } = useRouter();

  const deletionUser = async () => {
    try {
      setDeleting(!deleting);
      setValues(tDeletionAccount('deletionAccount'));

      const { data, error } = await supabase.auth.admin.deleteUser(userData?.id!);

      if (!data.user || !!error) {
        setValues(t('error'));
        return;
      }

      setValues(!!data.user || !error ? tContact('success') : tContact('fail'));

      const { data: usData, error: usError } = await supabase
        .from('Users')
        .delete({ count: 'exact' })
        .eq('id', userData.id!)
        .select();

      if (!usData || !!usError) {
        setValues(t('error'));
        return;
      }

      setDeleting(!deleting);
      push('/');
    } catch (e) {
      setValues(t('error'));
      console.error(e);
    }
  };

  return (
    <div className={styles.deleteDiv}>
      <Dialog.Root lazyMount unmountOnExit>
        <Dialog.Trigger asChild>
          <button className={styles.button}>
            <AiTwotoneDelete />
            {deleting && tDeletionAccount('deletionAccount')}
            {!deleting && `${tDeletionAccount('button')} account`}
          </button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content className={styles.content}>
              <Dialog.Title className={styles.header}>{tDeletionAccount('title')}</Dialog.Title>

              <Dialog.Description className={styles.body}>{tDeletionAccount('body')}</Dialog.Description>

              <footer className={styles.footer}>
                <Dialog.CloseTrigger>{tDeletionAccount('cancel')}</Dialog.CloseTrigger>
                <button onClick={deletionUser}>{tDeletionAccount('button')}</button>
              </footer>
              <Dialog.CloseTrigger asChild />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      {!!values && <Alerts valueFields={values} />}
    </div>
  );
};
