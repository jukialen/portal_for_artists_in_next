import { useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UploadTaskSnapshot } from '@firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { Button, Input, Progress, Textarea } from '@chakra-ui/react';
import * as Yup from 'yup';

import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { EventType, FormType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/molecules/FormError/FormError';

import styles from './adding_group.module.scss';

type AddingGroupType = {
  groupName: string;
  description: string
};

export default function AddingGroup() {
  const { asPath } = useRouter();
  
  const loading = useCurrentUser('/');
  const data = useHookSWR();
  
  const [valuesFields, setValuesFields] = useState<string>('');
  const [logoGroup, setLogoGroup] = useState<File | null>(null);
  const [progressUpload, setProgressUpload] = useState<number>(0);
  
  const initialValues = {
    groupName: '',
    description: ''
  };
  
  const schemaValidation = Yup.object({
    groupName: SchemaValidation().groupName,
    description: SchemaValidation().description,
  });
  
  const user = auth.currentUser!;
  
  const handleChangeFile = async (e: EventType) => {
    e.target.files?.[0] ? setLogoGroup(e.target.files[0]) : setLogoGroup(null);
  };
  
  const createGroup = async ({ groupName, description }: AddingGroupType, { resetForm }: FormType) => {
    try {
      const fileRef = await ref(storage, `groups/${groupName}/${logoGroup?.name}`);
  
      const newGroup = async () => {
        await setDoc(doc(db, `groups/${groupName}`), {
          name: groupName,
          description,
          logo: null,
          admin: user.uid
        });
        await resetForm(initialValues);
      }
  
      const newGroupWithLogo = () => {
        const upload = uploadBytesResumable(fileRef, logoGroup!);
  
        upload.on('state_changed', (snapshot: UploadTaskSnapshot) => {
            const progress: number = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgressUpload(progress);
            switch (snapshot.state) {
              case 'running':
                setValuesFields('Upload is running');
                break;
              case 'paused':
                setValuesFields('Upload is paused');
                break;
            }
          }, (e) => {
            console.error(e);
            setValuesFields(`${data?.AnotherForm?.notUploadFile}`);
          },
          async () => {
            const groupLogoURL = await getDownloadURL(fileRef);
      
            await setDoc(doc(db, `groups/${groupName}`), {
              name: groupName,
              description,
              logo: groupLogoURL,
              admin: user.uid
            });
      
            await setValuesFields(`${data?.AnotherForm?.uploadFile}`);
            await setLogoGroup(null);
            await resetForm(initialValues);
            return null;
          });
      }
      
      logoGroup === null ? await newGroup() : newGroupWithLogo();
    } catch (e) {
      console.log(e);
      setValuesFields(data?.NewUser?.errorSending);
    }
  };
  
  if (loading) { return null };
  
  return <>
    <HeadCom path={asPath} content="User's adding some group " />

    <Formik
      initialValues={initialValues}
      validationSchema={schemaValidation}
      onSubmit={createGroup}
    >
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.container__form}>
          <h2 className={styles.title}>{data?.AddingGroup.title}</h2>
      
          <Input
            id='groupName'
            name='groupName'
            value={values.groupName}
            onChange={handleChange}
            placeholder={data?.AddingGroup?.name}
            className={touched.groupName && !!errors.groupName ? styles.field__error : styles.field}
          />
      
          <FormError nameError='groupName' />
      
          <Textarea
            id='description'
            name='description'
            value={values.description}
            onChange={handleChange}
            placeholder={data?.AnotherForm?.description}
            className={touched.description && !!errors.description ? styles.field__error : styles.field}
          />
      
          <FormError nameError='description' />
      
          <Input
            name='logo'
            type='file'
            accept='.jpg, .jpeg, .png, .webp, .avif'
            onChange={handleChangeFile}
            placeholder={data?.AnotherForm?.profilePhoto}
            focusBorderColor='transparent'
            className={styles.input}
          />
          
          <Button
            colorScheme='transparent'
            color='black.800'
            type='submit'
            className={`button ${styles.submit__button}`}
            aria-label={data?.NewUser?.ariaLabelButtom}
          >
            {data?.AnotherForm?.send}
          </Button>
      
          {progressUpload >= 1 && !(valuesFields === `${data?.AnotherForm?.uploadFile}`) &&
          <Progress
            value={progressUpload}
            colorScheme='green'
            isAnimated
            hasStripe
            min={0}
            max={100}
            w={280}
            bg='blue.400'
            m='1.5rem auto'
            size='md'
          />
          }
      
          {valuesFields !== '' && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  </>
}