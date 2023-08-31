import axios from 'axios';
import { Avatar, Button, Textarea } from '@chakra-ui/react';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { backUrl } from 'utilites/constants';

import { ResetFormType, NewCommentsType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import styles from './NewComments.module.scss';

type NewCommentType = { comment: string };

export const NewComments = ({
  profilePhoto,
  fileId,
  commentId,
  subCommentId,
  roleId,
  fileCommentId,
  postId,
}: NewCommentsType) => {
  const initialValues = { comment: '' };

  const data = useHookSWR();

  const schemaNew = Yup.object({ comment: SchemaValidation().description });

  const createNewComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      !!subCommentId &&
        (await axios.post(`${backUrl}/last-comments`, {
          lastComment: comment,
          subCommentId,
        }));
      !!(commentId || fileCommentId) &&
        (await axios.post(`${backUrl}/sub-comments`, {
          subComment: comment,
          commentId,
          fileCommentId,
          fileId,
          postId,
        }));
      !!fileId
        ? await axios.post(`${backUrl}/files-comments`, { comment, fileId })
        : await axios.post(`${backUrl}/comments`, { comment, roleId });
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
