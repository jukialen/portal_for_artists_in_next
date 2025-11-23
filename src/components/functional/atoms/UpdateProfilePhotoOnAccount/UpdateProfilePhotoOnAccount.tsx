'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog } from '@ark-ui/react/dialog';

import { createClient } from 'utils/supabase/clientCSR';
import { filesProfileTypes, handleFileSelection, isFileAccessApiSupported, validateFile } from 'utils/client/files';

import { useScopedI18n } from 'locales/client';

import { EventType, FilesUploadType, UserType } from 'types/global.types';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

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

  const closePreviewPhoto = () => {
    setPreviewUrl(null);
    setNewLogo(null);
  };

  useEffect(() => {
    if (!newLogo) {
      closePreviewPhoto();
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
      closePreviewPhoto();
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
        if (!(await validateFile(fileTranslated, newLogo))) {
          const pathPhoto = `/${userData?.id!}/${newLogo.name}`;

          if (!!userData?.profilePhoto) {
            const { data: fileList, error: listError } = await supabase.storage.from('profiles').list(userData?.id);

            if (!listError && fileList && fileList.length > 0) {
              const filesToRemove = fileList.map((file) => `${userData?.id}/${file.name}`);

              await supabase.storage.from('profiles').remove(filesToRemove);
            }

            const { data, error } = await supabase.storage.from('profiles').upload(pathPhoto, newLogo, {
              contentType: newLogo.type,
              upsert: !!userData?.profilePhoto,
            });

            console.log('data', data);

            if (!!error) console.error(error);

            await supabase.from('Users').update({ profilePhoto: data?.path }).eq('id', userData?.id!);

            !error && setValuesFields(tAnotherForm('uploadFile'));
            return;
          }

          const { error } = await supabase.storage.from('profiles').upload(pathPhoto, newLogo, {
            contentType: newLogo.type,
          });

          !!error && setValuesFields(tAnotherForm('notUploadFile'));
          return;
        } else {
          setRequired(true);
        }
      }
    } catch (e) {
      console.error(e);
      setValuesFields(tAnotherForm('notUploadFile'));
    }
  };

  return (
    <Dialog.Root
      lazyMount
      unmountOnExit
      onExitComplete={() => console.log('onExitComplete invoked')}
      open={open}
      onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <button aria-label="update logo" className={styles.updateLogo} onClick={() => setOpen(true)}>
          <MdCameraEnhance />
        </button>
      </Dialog.Trigger>
      <Dialog.Content className={styles.logoContent} id={!!newLogo ? styles.logoContentPreview : ''}>
        <Dialog.Title className={styles.logoHeader}>Update logo</Dialog.Title>

        <Dialog.Description className={!newLogo && required ? styles.logBody__error : styles.logBody}>
          {isFileAccessApiSupported ? (
            <button onClick={() => handleFile()} className={styles.filePickerButton}>
              {tAnotherForm('file')}
            </button>
          ) : (
            <input type="file" name="newLogo" id={styles.newLogo} accept={filesProfileTypes} onChange={changeFile} />
          )}
          {!newLogo && required && <p>{tCurrPrPhoto!.validateRequired}</p>}
          {!!previewUrl && <Image src={previewUrl} alt="preview new logo" fill priority />}
          {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
        </Dialog.Description>
        <div className={styles.logoFooter}>
          <Dialog.CloseTrigger className={styles.cancel} onClick={closePreviewPhoto}>
            {tCurrPrPhoto!.cancelButton}
          </Dialog.CloseTrigger>
          <button type="submit" className={styles.edit} onClick={updateLogo}>
            {tCurrPrPhoto!.submit}
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
