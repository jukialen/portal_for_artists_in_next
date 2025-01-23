import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Button, Textarea } from '@chakra-ui/react';
import { Avatar } from 'components/ui/avatar';

import { ResetFormType } from 'types/global.types';

import { useScopedI18n } from 'locales/client';

import { newComment } from 'utils/comments';

import styles from './NewComments.module.scss';

type NewCommentType = { comment: string };

type NewComment = {
  authorId: string;
  profilePhoto: string;
  roleId: string;
  postId?: string;
  fileId?: string;
  commentId?: string;
  subCommentId?: string;
  fileCommentId?: string;
}

export const NewComments = ({
  fileId,
  authorId,
  postId,
  roleId,
  commentId,
  subCommentId,
  fileCommentId,
  profilePhoto,
}: NewComment) => {
  const initialValues = { comment: '' };

  const tComments = useScopedI18n('Comments');

  const schemaNew = Yup.object({ comment: SchemaValidation().description });
  
  const createNewComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      await newComment({
        content: comment,
        authorId,
        postId,
        roleId,
        commentId,
        fileId,
        subCommentId,
        fileCommentId,
      });

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
            <Avatar src={profilePhoto} width={10} height={10} marginTop=".4rem" />

            <Textarea
              name="comment"
              id="comment"
              value={values.comment}
              onChange={handleChange}
              placeholder={tComments('newComPlaceholder')}
              aria-label={tComments('newComAria')}
              required
              className={styles.text}
            />
          </div>

          <Button type="submit" colorScheme="blue" display="flex" className={styles.addingButton}>
            {tComments('newComButton')}
          </Button>

          <ErrorMessage name="comment" />
        </Form>
      )}
    </Formik>
  );
};
