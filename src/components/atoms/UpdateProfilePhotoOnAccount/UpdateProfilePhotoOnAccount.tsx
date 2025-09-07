'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button, Input } from '@chakra-ui/react';
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

import { createClient } from 'utils/supabase/clientCSR';
import { filesProfileTypes, handleFileSelection, isFileAccessApiSupported, validatePhoto } from 'utils/client/files';

import { useScopedI18n } from 'locales/client';

import { EventType, FilesUploadType, UserType } from 'types/global.types';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './UpdateProfilePhotoOnAccount.module.scss';
import { MdCameraEnhance } from 'react-icons/md';

export const UpdateProfilePhotoOnAccount = ({
  tCurrPrPhoto,
  fileTranslated,
  userData,
}: {
  tCurrPrPhoto: {
    validateRequired: string;
    uploadFile: string;
    cancelButton: string;
    submit: string;
  };
  fileTranslated: FilesUploadType;
  userData: UserType;
}) => {
  const [valuesFields, setValuesFields] = useState('');
  const [required, setRequired] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supabase = createClient();

  const tAnotherForm = useScopedI18n('AnotherForm');

  useEffect(() => {
    if (!newLogo) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(newLogo);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [newLogo]);

  const changeFile = (e: EventType) => {
    if (e.target.files?.[0]) {
      setNewLogo(e.target.files[0]);
      setRequired(false);
    } else {
      setNewLogo(null);
      setRequired(true);
    }
  };

  const handleFile = async (): Promise<void> => {
    const result = await handleFileSelection(fileTranslated, false);

    if (typeof result === 'string') {
      setValuesFields(result);
      setRequired(false);
    } else {
      setNewLogo(result);
      setRequired(true);
    }
  };

  const updateLogo = async () => {
    try {
      if (!!newLogo && !required) {
        if (!(await validatePhoto(fileTranslated, newLogo))) {
          const { data, error } = await supabase.storage.from('profiles').upload(`/${userData?.id!}`, newLogo, {
            upsert: !!userData?.profilePhoto,
          });

          if (!!error) console.error(error);

          const { error: er } = await supabase.from('Users').update({ profilePhoto: data?.path });

          if (!!er) console.error(er);

          setValuesFields(tAnotherForm('uploadFile'));
        }
      }
    } catch (e) {
      console.error(e);
      setValuesFields(tAnotherForm('notUploadFile'));
    }
  };

  return (
    <DialogRoot
      lazyMount
      open={open}
      onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button aria-label="update logo" className={styles.updateLogo} onClick={() => setOpen(true)}>
          <MdCameraEnhance />
        </Button>
      </DialogTrigger>
      <DialogContent className={styles.logoContent}>
        <DialogHeader className={styles.logoHeader}>
          <DialogTitle>Update logo</DialogTitle>
        </DialogHeader>

        <DialogBody className={!newLogo && required ? styles.logBody__error : styles.logBody}>
          {isFileAccessApiSupported ? (
            <button onClick={() => handleFile()} className={styles.filePickerButton}>
              {tAnotherForm('file')}
            </button>
          ) : (
            <Input type="file" name="newLogo" id="newLogo" accept={filesProfileTypes} onChange={changeFile} />
          )}
          {!newLogo && required && <p>{tCurrPrPhoto!.validateRequired}</p>}
          {!!previewUrl && <Image src={previewUrl} alt="preview new logo" fill priority />}
          {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
        </DialogBody>
        <DialogFooter className={styles.logoFooter}>
          <DialogActionTrigger className={styles.cancel} onChange={() => setNewLogo(null)}>
            {tCurrPrPhoto!.cancelButton}
          </DialogActionTrigger>
          <Button type="submit" className={styles.edit} onClick={updateLogo}>
            {tCurrPrPhoto!.submit}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger className={styles.closeTrigger} onChange={() => setNewLogo(null)} />
      </DialogContent>
    </DialogRoot>
  );
};
