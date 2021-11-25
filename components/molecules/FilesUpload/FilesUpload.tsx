import { ChangeEvent } from 'react';
import axios from "axios";

import { FormError } from 'components/molecules/FormError/FormError';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { UploadOutlined, } from '@ant-design/icons';
import styles from './FileUpload.module.scss';


const initialValues = {
  files: '',
  description: '',
  tags: ''
};

type FileDataType = {
  files: FileList;
  description: string;
  e: ChangeEvent<HTMLInputElement>;
  accept: string;
};

export const FilesUpload = () => {
  const tagsArray = ['Choose tag', 'realistic', 'manga', 'anime', 'comics', 'photographs', 'animations', 'others'];
  
  // @ts-ignore
  const uploadFiles = async ({ files, description, tags }: FileDataType, { resetForm }) => {
    
    const formData = new FormData();
    // @ts-ignore
    formData.append('files', files[0]);
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData)
      // @ts-ignore
      const imageId = response.data[0].id;
      
      try {
         await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/files`, {
            multimedia: imageId,
            description,
            tags
          },
        )
        resetForm(initialValues)
        
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error)
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
        <label>
          <div>
            <UploadOutlined />
            Select
          </div>
          <Field
            title='Select'
            name='files'
            type='file'
            className={styles.input}
            placeholder='Select files' // @ts-ignore
            accept='.jpg, .jpeg, .png, .svg, .gif, video/*'
            multiple={true}
            required='required'
            aria-required='true'
          />
          {/*<div>*/}
          {/*  <PauseCircleTwoTone className={styles.icons} />*/}
          {/*  <ReloadOutlined className={styles.icons} />*/}
          {/*  <LoadingOutlined className={styles.icons} />*/}
          {/*</div>*/}
        </label>
        
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
        
        <button
          type='submit'
          className={`button ${styles.button}`}
        >
          Upload
        </button>
      </Form>
    </Formik>
  );
};