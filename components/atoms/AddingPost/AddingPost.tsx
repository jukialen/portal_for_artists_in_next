import { useState } from 'react';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Textarea } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { AuthorType, FormType } from 'types/global.types';

import { addingPost } from 'references/referencesFirebase';

import styles from './AddingPost.module.scss';

type PostType = {
  title: string;
  post: string;
}

export const AddingPost = (name: AuthorType) => {
  
  const [showForm, setShowForm] = useState(false);
  
  const initialValues = {
    title: '',
    post: '',
  };
  
  const schemaNew = Yup.object({
    post: SchemaValidation().description,
    title: SchemaValidation().description
  });
  
  const createNewPost = async ({ title, post }: PostType, { resetForm }: FormType) => {
    try {
      await addDoc(addingPost(name!), {
        nameGroup: name!,
        title,
        message: post,
        date: serverTimestamp()
      });
      resetForm(initialValues);
    } catch (e) {
      console.error(e);
    }
  };
  
  return <>
    <button
      className={styles.showForm}
      onClick={() => setShowForm(!showForm)}
    >
      Dodaj post
    </button>
    <Formik
      initialValues={initialValues}
      validationSchema={schemaNew}
      onSubmit={createNewPost}
    >
      {({ values, handleChange }) => (
        <Form className={showForm ? '' : styles.hiding}>
          <Input
            id='title'
            name='title'
            value={values.title}
            onChange={handleChange}
            placeholder='Dodaj tytuł'
            aria-label='Adding title for new post'
            isRequired
            className={styles.title}
          />
  
          <ErrorMessage name='title' />
          
          <Textarea
            id='post'
            name='post'
            value={values.post}
            onChange={handleChange}
            resize='vertical'
            placeholder='Dodaj opis'
            aria-label='Adding description for new post'
            isRequired
            className={styles.description}
          />
          
          <ErrorMessage name='post' />
          
          <Button
            type='submit'
            colorScheme='blue.800'
            className={styles.addingButton}
          >
            Dodaj post
          </Button>
        </Form>
      )}
    </Formik>
  </>;
};