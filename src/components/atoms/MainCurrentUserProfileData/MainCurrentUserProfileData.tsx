'use client';

import { useState, useContext } from 'react';
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

import { useScopedI18n } from 'locales/client';

import { backUrl, darkMode } from 'constants/links';
import { EventType, UserType } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';

import styles from './MainCurrentUserProfileData.module.scss';
import { MdCameraEnhance } from 'react-icons/md';

export const MainCurrentUserProfileData = ({
  userData,
  tCurrPrPhoto,
}: {
  userData: UserType;
  tCurrPrPhoto: {
    validateRequired: string;
    uploadFile: string;
    cancelButton: string;
    submit: string;
  };
}) => {
  const [valuesFields, setValuesFields] = useState('');
  const [required, setRequired] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const { isMode } = useContext(ModeContext);

  const supabase = createClient();

  const selectedColor = '#FFD068';

  const tAnotherForm = useScopedI18n('AnotherForm');

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
        const { data, error } = await supabase.storage.from('profiles').upload(`/${userData?.id!}`, newLogo, {
          upsert: !!userData?.profilePhoto,
        });

        if (!!error) console.error(error);

        const { error: er } = await supabase.from('Users').update({ profilePhoto: data?.path });

        if (!!er) console.error(er);

        setValuesFields(tAnotherForm('uploadFile'));
      }
    } catch (e) {
      console.error(e);
      setValuesFields(tAnotherForm('notUploadFile'));
    }
  };

  return (
    <article className={styles.mainData}>
      <div className={styles.logoPseu}>
        <div className={styles.logo}>
          <Image src={userData?.profilePhoto!} fill alt={`${userData?.profilePhoto} logo`} priority />
          <DialogRoot
            lazyMount
            open={open}
            onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <Button
                aria-label="update group logo"
                colorScheme="yellow"
                className={styles.updateLogo}
                onClick={() => setOpen(true)}>
                <MdCameraEnhance />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader backgroundColor={`${isMode === darkMode ? '#2D3748' : ''}`} color={selectedColor}>
                <DialogTitle>Update logo</DialogTitle>
              </DialogHeader>

              <DialogBody>
                <Input
                  type="file"
                  name="newLogo"
                  id="newLogo"
                  padding=".5rem 1rem"
                  margin=".5rem auto 1.5rem"
                  borderRadius="1rem"
                  onChange={changeFile}
                  borderColor={!newLogo && required ? '#bd0000' : '#4F8DFF'}
                />

                <p style={{ color: '#bd0000' }}>{!newLogo && required && tCurrPrPhoto.validateRequired}</p>
                {!!newLogo && (
                  <Image
                    src={`${backUrl}/${newLogo.name}`}
                    alt="preview new logo"
                    fill
                    priority
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
                  {tCurrPrPhoto.cancelButton}
                </DialogActionTrigger>
                <Button onClick={updateLogo} colorScheme="yellow" borderColor="transparent">
                  {tCurrPrPhoto.submit}
                </Button>
              </DialogFooter>
              <DialogCloseTrigger color={selectedColor} borderColor="transparent" />
            </DialogContent>
          </DialogRoot>
        </div>
        <h1 className={styles.name}>{userData?.pseudonym}</h1>
      </div>
      <div className={styles.description}>{userData?.description}</div>
      <FilesUpload userId={userData?.id!} />
    </article>
  );
};
