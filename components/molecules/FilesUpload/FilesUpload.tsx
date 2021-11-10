import { ChangeEvent, FC, useState } from 'react';

import { FormError } from 'components/molecules/FormError/FormError';

import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { LoadingOutlined, PauseCircleTwoTone, ReloadOutlined, UploadOutlined, } from '@ant-design/icons';
import styles from './FileUpload.module.scss';

const initialValues = {
  files: null,
  description: '',
};

type FileDataType = {
  files: FileList[] | File;
  description: string;
  e: ChangeEvent<HTMLInputElement>;
  accept: string;
};

export const FilesUpload: FC = () => {
  // const user = localStorage.getItem('user');
  
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [errorMessage, setErrorMessage] = useState<string>('');
  // const [valuesFields, setValuesFields] = useState<boolean>(false);
  
  const [files, setFiles] = useState<FileList | File>();
  // const [description, setDescription] = useState('');
  
  // //
  const onFileChange = (e: FileDataType) => {
    // @ts-ignore
    setFiles(e.currentTarget.files);
  };
  
  const uploadToDb = () => {
    console.log("upload")
  }
  
  // const uploadToDb = useCallback(
  //   async ({ e }: FileDataType, { resetForm }) => {
  //     setIsLoading(true);
  //     // @ts-ignore
  //     e.preventDefault();
  //     const formData = new FormData();
  //     // @ts-ignore
  //     formData.append('files', files[0]);
  //     try {
  //       setDescription(description);
  //       const { data } = await axios.post(`http://localhost:1337/files`, formData, {
  //         headers: {
  //           Authorization: `Bearer ${user}`,
  //         },
  //       });
  //       console.log(user);
  //       console.log('New files were upload', data);
  
  //       setValuesFields(!valuesFields);
  //       // @ts-ignore
  //       resetForm(initialValues);
  //     } catch ({ response }) {
  //       console.log(response);
  //       setErrorMessage('Nie mogliśmy Cię zarejestrować');
  //     }
  //     setIsLoading(false);
  //   },
  //   [valuesFields, user, files, description],
  // );
  return (
    <Formik // @ts-ignore
      initialValues={initialValues}
      validationSchema={Yup.object({
        description: Yup.string()
        .min(3, 'Opis jest zbyt krótki')
        .max(20, 'Opis nie może być dłuższy niż 20 liter')
        .matches(/[a-zA-Z0-9]/g, 'Może zawierać tylko litery i cyfry'),
        files: Yup.mixed().required('Required'),
      })} // @ts-ignore
      onSubmit={uploadToDb}
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
            onChange={onFileChange}
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
          name='descriptions'
          type='text'
          className={styles.input}
          placeholder='Description'
          required='required'
          aria-required='true'
        />
        
        <FormError nameError='description' />
        
        <button
          className={`button ${styles.button}`}// @ts-ignore
          // onClick={uploadToDb}
        >
          Upload
        </button>
      </Form>
    </Formik>
  );
};
