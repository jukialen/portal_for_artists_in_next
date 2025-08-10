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
  const locale = useCurrentLocale();
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
      push(`${locale}/`);
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
          <Button
            loading={deleting}
            loadingText="Deleting"
            variant="ghost"
            colorScheme="red"
            borderColor="red.500"
            w={145}
            m={4}>
            <AiTwotoneDelete />
            {`${tDeletionAccount('button')} account`}
          </Button>
        </DialogTrigger>
        <DialogContent m="auto">
          <DialogHeader fontSize="lg" fontWeight="bold">
            <DialogTitle>{tDeletionAccount('title')}</DialogTitle>
          </DialogHeader>

          <DialogBody>{tDeletionAccount('body')}</DialogBody>

          <DialogFooter>
            <DialogActionTrigger borderColor="gray.100" asChild>
              {tDeletionAccount('cancel')}
            </DialogActionTrigger>
            <Button colorScheme="red" borderColor="red.500" onClick={deletionUser} ml={3}>
              {tDeletionAccount('button')}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
      {!!values && <Alerts valueFields={values} />}
    </div>
  );
};
