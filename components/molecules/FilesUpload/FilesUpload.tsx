import { useState } from 'react';

import { FormError } from 'components/molecules/FormError/FormError';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import styles from './FileUpload.module.scss';
import { useHookSWR } from '../../../hooks/useHookSWR';
import { auth, storage } from '../../../firebase';
import { getDownloadURL, ref, updateMetadata, uploadBytes } from 'firebase/storage';


const initialValues = {
  files: '',
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
  const user = auth.currentUser;
  const data = useHookSWR();
  const [photo, setPhoto] = useState(null);
  
  const tagsArray = ['Choose tag', 'realistic', 'manga', 'anime', 'comics', 'photographs', 'animations', 'others'];
  
  const handleChange = async (e: any) => {
    e.target.files[0] && setPhoto(e.target.files[0]);
  };
  
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
        console.log('Uploaded a blob or file!');
        updateMetadata(fileRef, metadata);
      });
      
      console.log('File has been uploaded');
      resetForm(initialValues);
    } catch (e) {
      console.log(e);
    }
  }
  
  return (
    <Formik // @ts-ignore
      initialValues={initialValues}
      validationSchema={Yup.object({
        description: Yup.string()
        .min(3, 'Opis jest zbyt krótki')
        .max(20, 'Opis nie może być dłuższy niż 20 liter')
        .matches(/[a-zA-Z0-9]/g, 'Może zawierać tylko litery i cyfry'),
        files: Yup.object().required('Required'),
        tags: Yup.string().required("Required")
      })} // @ts-ignore
      onSubmit={uploadFiles}
    >
      <Form className={styles.adding__files}>
        <Field
          title='Description:'
          name='description'
          type='text'
          className={styles.input}
          placeholder='Description'
          required='required'
          aria-required='true'
        />
  
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
            name='profilePhoto'
            type='file'
            id='profilePhoto'
            accept='.jpg, .jpeg, .png, .webp, .avif'
            onChange={handleChange}
            placeholder={data?.NavForm?.profilePhoto}
            className={styles.input}
          />
        </div>
    
        <FormError nameError='profilePhoto' />
    
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
      </Form>
    </Formik>
  );
};