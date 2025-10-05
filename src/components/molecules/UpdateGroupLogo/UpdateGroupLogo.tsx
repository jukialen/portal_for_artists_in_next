'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog } from '@ark-ui/react/dialog';

import { createClient } from 'utils/supabase/clientCSR';

import { backUrl } from 'constants/links';
import { EventType, nameGroupTranslatedType } from 'types/global.types';

import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './UpdateGroupLogo.module.scss';
import { MdCameraEnhance } from 'react-icons/md';

type UpdateGorupLogo = {
  logo: string;
  name: string;
  selectedColor: string;
  translated: nameGroupTranslatedType;
};

export const UpdateGroupLogo = ({ logo, name, selectedColor, translated }: UpdateGorupLogo) => {
  const [required, setRequired] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [open, setOpen] = useState(false);

  const supabase = createClient();

  const changeFile = (e: EventType) => {
    if (e.target.files?.[0]) {
      setNewLogo(e.target.files[0]);
      setRequired(false);
    } else {
      setNewLogo(null);
      setRequired(true);
    }
  };

  const updateLogo = async () => {
    try {
      if (!!newLogo && !required) {
        const { data, error } = await supabase.storage.from('logos').upload('', newLogo, {
          upsert: !!logo,
        });

        !!data && setValuesFields(translated!.updateLogo!.upload);
        !!error && setValuesFields(translated!.updateLogo!.notUpload);

        await supabase.from('Groups').update({ logo: data?.path! });
      } else {
        console.log('no logo selected');
        setValuesFields('no logo selected');
      }
    } catch (e) {
      console.error(e);
      setValuesFields(translated!.updateLogo!.notUpload);
    }
  };

  return (
    <>
      <Image src={logo} fill priority alt={`${name} logo`} />

      <Dialog.Root
        lazyMount
        open={open}
        onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
        <Dialog.Trigger asChild>
          <button aria-label="update group logo" className={styles.updateLogo} onClick={() => setOpen(true)}>
            <MdCameraEnhance />
          </button>
        </Dialog.Trigger>
        <Dialog.Content className={styles.modal}>
          <Dialog.Title>logo</Dialog.Title>

          <Dialog.Description className={styles.modal}>
            <input
              type="file"
              name="newLogo"
              id="newLogo"
              className={!newLogo && required ? styles.input__error : styles.input}
              onChange={changeFile}
            />

            <p>{!newLogo && required && translated!.updateLogo!.validateRequired}</p>
            {!!newLogo && (
              <Image src={`${backUrl}/${newLogo.name}`} alt="preview new logo" fill priority className={styles.img} />
            )}

            {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
          </Dialog.Description>
          <div className={styles.actionButton}>
            <button className={styles.cancel}>{translated!.updateLogo!.cancelButton}</button>
            <button className={styles.submit} onClick={updateLogo}>
              {translated!.updateLogo!.submit}
            </button>
          </div>
          <Dialog.CloseTrigger className={styles.closeButton}>Close</Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
