'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { updateProfilePhoto } from 'app/actions/files';
import { filesProfileTypes, validateFile } from 'utils/common/files';
import { useScopedI18n } from 'locales/client';

import { EventType, FilesUploadType, UserType } from 'types/global.types';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

import styles from './UpdateProfilePhotoOnAccount.module.css';
import { MdCameraEnhance } from 'react-icons/md';

const POPOVER_ID = 'update-profile-photo';

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

  const previewUrl = useMemo(() => (newLogo ? URL.createObjectURL(newLogo) : null), [newLogo]);

  const router = useRouter();
  const tAnotherForm = useScopedI18n('AnotherForm');

  const changeFile = (e: EventType) => {
    e.preventDefault()
    const file = e.target.files?.[0];
    setNewLogo(file ?? null);
    setRequired(!file);
  };

  const updateLogo = async () => {
    try {
      if (!!newLogo && !required) {
        const validationError = await validateFile(fileTranslated, newLogo, userData?.plan!);
        if (!validationError) {
          const formData = new FormData();
          formData.append('photo', newLogo);

          const result = await updateProfilePhoto(formData);

          if (result.success) {
            setValuesFields(tAnotherForm('uploadFile'));
            router.refresh();
          } else {
            setValuesFields(tAnotherForm('notUploadFile'));
          }
          return;
        } else {
          setValuesFields(validationError);
          setRequired(true);
        }
      } else {
        setRequired(true);
      }
    } catch (e) {
      console.error(e);
      setValuesFields(tAnotherForm('notUploadFile'));
    }
  };

  return (
    <>
      <button
        aria-label="update logo"
        className={styles.updateLogo}
        popoverTarget={POPOVER_ID}>
        <MdCameraEnhance />
      </button>

      <div
        id={POPOVER_ID}
        popover="auto"
        className={styles.logoContent}>
        <p className={styles.logoHeader}>Update logo</p>

        <div className={!newLogo && required ? styles.logBody__error : styles.logBody}>
          <label className={styles.newLogo}>
            {tAnotherForm('file')}
            <input type="file" name="newLogo" className={styles.visuallyHidden} accept={filesProfileTypes} onChange={changeFile} />
          </label>

          {!newLogo && required && <p>{tCurrPrPhoto!.validateRequired}</p>}
          {!!previewUrl && <Image src={previewUrl} alt="preview new logo" fill priority />}
          {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
        </div>

        <div className={styles.logoFooter}>
          <button
            className={styles.cancel}
            popoverTarget={POPOVER_ID}
            popoverTargetAction="hide"
            onClick={() => setNewLogo(null)}>
            {tCurrPrPhoto!.cancelButton}
          </button>
          <button
            type="submit"
            className={styles.edit}
            onClick={updateLogo}
            popoverTarget={POPOVER_ID}
            popoverTargetAction="hide">
            {tCurrPrPhoto!.submit}
          </button>
        </div>
      </div >
    </>
  );
};
