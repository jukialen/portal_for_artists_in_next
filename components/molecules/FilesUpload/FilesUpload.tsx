import { ChangeEvent, FC } from 'react';
import axios from "axios";
import Cookies from "js-cookie";

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

export const FilesUpload: FC = () => {
  
  const tagsArray = ['Choose tag', 'realistic', 'manga', 'anime', 'comics', 'photographs', 'animations', 'others'];
  
  const user = Cookies.get('user');
  
  // @ts-ignore
  const uploadImage = async ({ files, description, tags }: FileDataType, { resetForm }) => {
    
    
    const formData = new FormData();
    
    
    // @ts-ignore
    for (let i; i < formData.length; i++) {
      // @ts-ignore
      formData.append('files', files[i]);
      console.log(formData)
    }
    
    console.log("formData", formData);
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData)
      // @ts-ignore
      const imageId = response.data[i].id;
      console.log(imageId);
      
      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/files`, {
            multimedia: imageId,
            description,
            tags
          }, {
            headers:
              {
                Authorization: `Bearer ${user}`
              }
          }
        )
        console.log(data);
        resetForm(initialValues)
        
      } catch (error) {
        //handle error
      }
    } catch (error) {
      //handle error
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
      onSubmit={uploadImage}
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