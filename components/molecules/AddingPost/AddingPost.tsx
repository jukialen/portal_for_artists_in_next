import { useState } from 'react';
import { auth } from '../../../firebase';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Textarea } from '@chakra-ui/react';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { AuthorType, FormType } from 'types/global.types';

import { addingPost } from 'references/referencesFirebase';

import { useHookSWR } from 'hooks/useHookSWR';

import { FormError } from 'components/molecules/FormError/FormError';

import styles from './AddingPost.module.scss';

type AddingPostType = {
  title: string;
  post: string;
}

export const AddingPost = ({ name }: AuthorType) => {
  const [showForm, setShowForm] = useState(false);
  
  const user = auth.currentUser;
  const data = useHookSWR();
  
  const initialValues = {
    title: '',
    post: '',
  };
  
  const schemaNew = Yup.object({
    post: SchemaValidation().description,
    title: SchemaValidation().description
  });
  
  const createNewPost = async ({ title, post }: AddingPostType, { resetForm }: FormType) => {
    try {
      await addDoc(addingPost(name!), {
        nameGroup: name,
        title,
        message: post,
        date: serverTimestamp(),
        author: user?.uid,
        likes: 0,
        liked: []
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
      {data?.Groups?.addingPost?.add}
    </button>
    <Formik
      initialValues={initialValues}
      validationSchema={schemaNew}
      onSubmit={createNewPost}
    >
      {({ values, handleChange, errors, touched }) => (
        <Form className={showForm ? '' : styles.hiding}>
          <Input
            id='title'
            name='title'
            value={values.title}
            onChange={handleChange}
            placeholder={data?.Groups?.addingPost?.addTitPlaceholder}
            aria-label={data?.Groups?.addingPost?.addTitAria}
            className={styles.title__error}
          />
  
          <FormError nameError='title' />
          
          <Textarea
            id='post'
            name='post'
            value={values.post}
            onChange={handleChange}
            resize='vertical'
            placeholder={data?.Groups?.addingPost?.addDescription}
            aria-label={data?.Groups?.addingPost?.addDesAria}
            className={!!errors.post && touched.post ? styles.description__error : styles.description}
          />
          
          <FormError nameError='post' />
          
          <Button
            type='submit'
            colorScheme='blue.800'
            className={styles.addingButton}
          >
            {data?.Groups?.addingPost?.add}
          </Button>
        </Form>
      )}
    </Formik>
  </>;
};