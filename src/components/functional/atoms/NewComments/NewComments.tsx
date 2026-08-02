'use client';

import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'schemasValidation/schemaValidation';
import { Avatar } from 'components/ui/atoms/Avatar/Avatar';

import { supabaseStorageProfileUrl } from 'constants/links';
import { selectCommentsData } from 'constants/values';
import { CommentType, ResetFormType } from 'types/global.types';

import { useScopedI18n } from 'locales/client';
import { newComment } from 'utils/comments';

import styles from './NewComments.module.css';

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
  onCommentAdded?: (newComment: CommentType) => void;
};

export const NewComments = ({
  fileId,
  authorId,
  postId,
  roleId,
  commentId,
  subCommentId,
  fileCommentId,
  profilePhoto,
  onCommentAdded,
}: NewComment) => {
  const initialValues = { comment: '' };

  const tComments = useScopedI18n('Comments');

  const schemaNew = Yup.object({ comment: SchemaValidation().description });

  const createNewComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      const { role, message } = await newComment({
        content: comment,
        authorId,
        postId,
        roleId,
        commentId,
        fileId,
        fileCommentId,
        subCommentId,
      });

      if (!role || !!message) return;

      const { tableName } = selectCommentsData(postId, fileId, commentId, fileCommentId, subCommentId);

      onReplyAddedAction?.({
        authorName: 'dafaefw',
        idLiked: '19/02/2027',
        liked: false,
        likes: 0,
        role,
        tableName,
        fileId,
        authorId,
        postId,
        roleId,
        commentId,
        subCommentId,
        fileCommentId,
        authorProfilePhoto: profilePhoto,
        content: comment,
      });
      resetForm(initialValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={createNewComment} validateOnChange>
      {({ values, handleChange }) => (
        <Form>
          <div className={styles.comments}>
            <Avatar
              src={`${supabaseStorageProfileUrl}/${profilePhoto}`}
              fallbackName="my profile photo icon"
              alt="my profile photo icon"
            />

            <textarea
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

          <button type="submit" className={styles.addingButton}>
            {tComments('newComButton')}
          </button>

          <ErrorMessage name="comment" />
        </Form>
      )}
    </Formik>
  );
};
