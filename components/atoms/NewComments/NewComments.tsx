import { auth } from '../../../firebase';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { Avatar, Button, Textarea } from '@chakra-ui/react';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { addingComment } from 'references/referencesFirebase';

import { FormType } from 'types/global.types';

import styles from './NewComments.module.scss';
import group from 'public/group.svg';

type NewCommentsType = {
  name?: string;
  comment?: string;
  idPost?: string
}

export const NewComments = ({ name, idPost }: NewCommentsType ) => {
  const initialValues = {
    comment: '',
  };
  
  const user = auth.currentUser;
  
  const schemaNew = Yup.object({
    comment: SchemaValidation().description,
  });
  
  const createNewComment = async ({ comment }: NewCommentsType, { resetForm }: FormType) => {
    try {
      await addDoc(addingComment(name!, idPost!), {
        nameGroup: name,
        message: comment,
        date: serverTimestamp(),
        user: user?.uid
      });
      resetForm(initialValues);
    }
    catch (e) {
      console.error(e);
    }
  };
  
  return <Formik
    initialValues={initialValues}
    validationSchema={schemaNew}
    onSubmit={createNewComment}
  >
    {({ values, handleChange }) => (
      <Form>
        <div className={styles.comments}>
          <Avatar
            src={group}
            width={10}
            height={10}
            marginTop='.4rem'
          />
  
          <Textarea
            name='comment'
            id='comment'
            value={values.comment}
            onChange={handleChange}
            placeholder='Write new comment'
            aria-label='Adding description for new comment'
            isRequired
            className={styles.text}
          />
        </div>
        
        <Button
          type='submit'
          colorScheme='blue'
          display='flex'
          className={styles.addingButton}
        >
          Dodaj komentarz
        </Button>
        
        <ErrorMessage name='comment' />
      </Form>
    )}
  </Formik>
}