import { Avatar, Button, Textarea } from '@chakra-ui/react';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { ResetFormType, NewCommentsType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './NewComments.module.scss';

export const NewComments = ({ name }: NewCommentsType) => {
  const initialValues = {
    comment: '',
  };

  const data = useHookSWR();

  let user: { photoURL: string | undefined };
  const schemaNew = Yup.object({ comment: SchemaValidation().description });

  const createNewComment = async ({ comment }: NewCommentsType, { resetForm }: ResetFormType) => {
    try {
      resetForm(initialValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={createNewComment}>
      {({ values, handleChange }) => (
        <Form>
          <div className={styles.comments}>
            <Avatar src={user?.photoURL!} width={10} height={10} marginTop=".4rem" />

            <Textarea
              name="comment"
              id="comment"
              value={values.comment}
              onChange={handleChange}
              placeholder={data?.Comments?.newComPlaceholder}
              aria-label={data?.Comments?.newComAria}
              isRequired
              className={styles.text}
            />
          </div>

          <Button type="submit" colorScheme="blue" display="flex" className={styles.addingButton}>
            {data?.Comments?.newComButton}
          </Button>

          <ErrorMessage name="comment" />
        </Form>
      )}
    </Formik>
  );
};
