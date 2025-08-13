'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from 'utils/supabase/clientCSR';
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
import { Button } from 'components/ui/button';
import { useCurrentLocale, useI18n, useScopedI18n } from 'locales/client';

import { UserType } from 'types/global.types';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './DeleteAccount.module.scss';
import { AiTwotoneDelete } from 'react-icons/ai';

export const DeleteAccount = ({ userData }: { userData: UserType }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [values, setValues] = useState('');
  const t = useI18n();
  const tContact = useScopedI18n('Contact');
  const tDeletionAccount = useScopedI18n('DeletionAccount');

  const supabase = createClient();
  const { push } = useRouter();

  const deletionUser = async () => {
    try {
      setOpen(false);
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
        .delete({ count: 'estimated' })
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
      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button loading={deleting} loadingText="Deleting" variant="ghost" className={styles.button}>
            <AiTwotoneDelete />
            {`${tDeletionAccount('button')} account`}
          </Button>
        </DialogTrigger>
        <DialogContent className={styles.content}>
          <DialogHeader className={styles.header}>
            <DialogTitle>{tDeletionAccount('title')}</DialogTitle>
          </DialogHeader>

          <DialogBody className={styles.body}>{tDeletionAccount('body')}</DialogBody>

          <DialogFooter className={styles.footer}>
            <DialogActionTrigger>{tDeletionAccount('cancel')}</DialogActionTrigger>
            <Button onClick={deletionUser}>{tDeletionAccount('button')}</Button>
          </DialogFooter>
          <DialogCloseTrigger asChild />
        </DialogContent>
      </DialogRoot>
      {!!values && <Alerts valueFields={values} />}
    </div>
  );
};
