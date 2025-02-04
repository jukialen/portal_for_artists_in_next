'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button, IconButton, Input } from '@chakra-ui/react';
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

import { Database } from 'types/database.types';
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

  const supabase = createClientComponentClient<Database>();

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
      <img src={logo} alt={`${name} logo`} />

      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <IconButton
            aria-label="update group logo"
            colorScheme="yellow"
            className={styles.updateLogo}
            onClick={() => setOpen(true)}>
            <MdCameraEnhance />
          </IconButton>
        </DialogTrigger>
        <DialogContent backgroundColor="#2D3748" color={selectedColor} className={styles.modal}>
          <DialogHeader>
            <DialogTitle>logo</DialogTitle>
          </DialogHeader>

          <DialogBody className={styles.modal}>
            <Input
              type="file"
              name="newLogo"
              id="newLogo"
              padding=".35rem 1rem"
              margin=".5rem auto 1.5rem"
              onChange={changeFile}
              borderColor={!newLogo && required ? '#bd0000' : '#4F8DFF'}
            />

            <p style={{ color: '#bd0000' }}>{!newLogo && required && translated!.updateLogo!.validateRequired}</p>
            {!!newLogo && (
              <img
                src={`${process.env.NEXT_PUBLIC_PAGE}/${newLogo.name}`}
                alt="preview new logo"
                width={192}
                height={192}
                style={{
                  margin: '1rem auto',
                  display: 'flex',
                  justifyContent: 'center',
                  borderRadius: '1rem',
                }}
              />
            )}

            {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger colorScheme="blue" borderColor="transparent" mr={3}>
              {translated!.updateLogo!.cancelButton}
            </DialogActionTrigger>
            <Button onClick={updateLogo} colorScheme="yellow" borderColor="transparent">
              {translated!.updateLogo!.submit}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger color={selectedColor} borderColor="transparent" fontSize="md" />
        </DialogContent>
      </DialogRoot>
    </>
  );
};
