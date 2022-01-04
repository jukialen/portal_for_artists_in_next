import { useState } from 'react';
import { ref, updateMetadata, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../../../firebase';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormError } from 'components/molecules/FormError/FormError';
import { InfoField } from 'components/atoms/InfoField/InfoField';

import styles from './FileUpload.module.scss';

const initialValues = {
  description: '',
  tags: ''
};

type FileDataType = {
  description: string;
  tags: string;
  resetForm: any;
  accept: string;
};

export const FilesUpload = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [valuesFields, setValuesFields] = useState<string>('');
  const data = useHookSWR();
  
  const user = auth.currentUser;
  
  const tagsArray = ['Choose tag', 'realistic', 'manga', 'anime', 'comics', 'photographs', 'animations', 'others'];
  
  const handleChange = async (e: any) => {
    e.target.files[0] && setPhoto(e.target.files[0]);
  };
  
  const schemaFile = Yup.object({
    description: Yup.string()
    .min(3, 'Opis jest zbyt krótki')
    .max(20, 'Opis nie może być dłuższy niż 20 liter')
    .matches(/[a-zA-Z0-9]/g, 'Może zawierać tylko litery i cyfry')
    .required(data?.NavForm?.validateRequired),
    tags: Yup.string().required(data?.NavForm?.validateRequired)
  });
  
  const uploadFiles = async ({ description, tags }: FileDataType, { resetForm }: FileDataType) => {
    try {
      const fileRef = ref(storage, `${user?.uid}/${photo?.name}`);
      
      const metadata = {
        customMetadata: {
          'tag': tags,
          'description': description
        }
      };
      await uploadBytes(fileRef, photo).then((snapshot) => {
        updateMetadata(fileRef, metadata);
      });
      
      setValuesFields('File has been uploaded');
      resetForm(initialValues);
      setPhoto(null)
    } catch (e) {
      setValuesFields(`File hasn't been uploaded`)
    }
  }
  
  return (
    <Formik // @ts-ignore
      initialValues={initialValues}
      validationSchema={schemaFile} // @ts-ignore
      onSubmit={uploadFiles}
    >
      
      <Form className={styles.adding__files}>
        <div className={styles.form__field}>
          <label htmlFor={data?.NavForm?.profilePhoto} className={styles.label}>
            Description:
          </label>
          <Field
            as='textarea'
            name='description:'
            type='text'
            placeholder='Description'
            className={styles.input}
          />
        </div>
    
        <FormError nameError='description' />
        
        <Field name='tags' as='select' className={styles.tags} required='required' aria-required='true'>
          {tagsArray.map(tag => <option key={tag} value={tag} className={styles.options}>{tag}</option>)}
        </Field>
  
        <FormError nameError='tags' />
    
        <div className={styles.form__field}>
          <label htmlFor={data?.NavForm?.profilePhoto} className={styles.label}>
            {data?.NavForm?.profilePhoto}:
          </label>
          <Field
            name='File:'
            type='file'
            accept='.jpg, .jpeg, .png, .webp, .avif'
            onChange={handleChange}
            placeholder={data?.NavForm?.profilePhoto}
            className={styles.input}
          />
        </div>
    
        <FormError nameError='file' />
    
        <button
          type='submit'
          className={`button ${styles.submit__button}`}
          aria-label={data?.NewUser?.ariaLabelButtom}
        >
          {data?.NewUser?.send}
        </button>
    
        {/*<div>*/}
        {/*  <PauseCircleTwoTone className={styles.icons} />*/}
        {/*  <ReloadOutlined className={styles.icons} />*/}
        {/*  <LoadingOutlined className={styles.icons} />*/}
        {/*</div>*/}
  
        {!!valuesFields && <InfoField value={valuesFields} />}

      </Form>
    </Formik>
  );
};