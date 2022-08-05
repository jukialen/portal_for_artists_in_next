import { auth } from '../../../firebase';
import { addDoc, CollectionReference, serverTimestamp } from 'firebase/firestore';
import { Avatar, Button, Textarea } from '@chakra-ui/react';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { FormType, GroupNameType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './NewComments.module.scss';
import group from 'public/group.svg';

type NewCommentsType = {
  name?: GroupNameType;
  refCom?: CollectionReference;
  comment?: string;
}

export const NewComments = ({ name, refCom }: NewCommentsType ) => {
  const initialValues = {
    comment: '',
  };
  
  const data = useHookSWR();
  
  const user = auth.currentUser;
  
  const schemaNew = Yup.object({
    comment: SchemaValidation().description,
  });
  
  const createNewComment = async ({ comment }: NewCommentsType, { resetForm }: FormType) => {
    try {
      await addDoc(refCom!, {
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
            src={user?.photoURL!}
            width={10}
            height={10}
            marginTop='.4rem'
          />
  
          <Textarea
            name='comment'
            id='comment'
            value={values.comment}
            onChange={handleChange}
            placeholder={data?.Comments?.newComPlaceholder}
            aria-label={data?.Comments?.newComAria}
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
          {data?.Comments?.newComButton}
        </Button>
        
        <ErrorMessage name='comment' />
      </Form>
    )}
  </Formik>
}