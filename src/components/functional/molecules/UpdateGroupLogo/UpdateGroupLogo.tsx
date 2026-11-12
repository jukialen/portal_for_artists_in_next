'use client';

import { useState } from 'react';
import Image from 'next/image';

import { createClient } from 'utils/supabase/clientCSR';

import { backUrl } from 'constants/links';
import { EventType, nameGroupTranslatedType } from 'types/global.types';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';

import styles from './UpdateGroupLogo.module.css';
import { MdCameraEnhance } from 'react-icons/md';

type UpdateGorupLogo = {
  logo: string;
  name: string;
  translated: nameGroupTranslatedType;
};

export const UpdateGroupLogo = ({ logo, name, translated }: UpdateGorupLogo) => {
  const [required, setRequired] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');

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
      console.log('!!newLogo && !required', !!newLogo && !required);
      console.log('name', name);

      if (!!newLogo && !required) {
        const { data, error } = await supabase.storage.from('logos').upload(`/${name}/${newLogo.name}`, newLogo, {
          upsert: !!logo,
        });

        console.log('data', data);
        console.log('error', error);

        !!data && setValuesFields(translated!.updateLogo!.upload);
        !!error && setValuesFields(translated!.updateLogo!.notUpload);

        const { data: upRec, error: erRec } = await supabase
          .from('Groups')
          .update({ logo: data?.path! })
          .eq('name', name);

        console.log('upRec', upRec);
        console.log('erRec', erRec);
      } else {
        console.log('no logo selected');
        setValuesFields('no logo selected');
      }
    } catch (e) {
      console.error(e);
      setValuesFields(translated!.updateLogo!.notUpload);
    }
  };

  const popoverId = `update-group-logo-${name}`;

  return (
    <>
      <button aria-label="update group logo" className={styles.updateLogo} popoverTarget={popoverId}>
        <MdCameraEnhance />
      </button>
      <div id={popoverId} popover="auto" className={styles.modal}>
        <h2>Logo</h2>

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

        <div className={styles.alert}>{valuesFields !== '' && <Alerts valueFields={valuesFields} />}</div>

        <div className={styles.actionButton}>
          <button className={styles.cancel} popoverTarget={popoverId} popoverTargetAction="hide">
            {translated!.updateLogo!.cancelButton}
          </button>
          <button className={styles.submit} onClick={updateLogo} popoverTarget={popoverId} popoverTargetAction="hide">
            {translated!.updateLogo!.submit}
          </button>
        </div>
      </div>
    </>
  );
};
