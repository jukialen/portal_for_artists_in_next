'use client';

import { useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'schemasValidation/schemaValidation';

import { supabaseStorageProfileUrl } from 'constants/links';
import { selectCommentsData } from 'constants/values';
import { CommentType, ResetFormType } from 'types/global.types';

import { useI18n, useScopedI18n } from 'locales/client';
import { getUserData } from 'helpers/getUserData';
import { newComment } from 'app/actions/comments';
import { toggleLiked } from 'app/actions/likes';

import { Alerts } from 'components/ui/atoms/Alerts/Alerts';
import { Avatar } from 'components/ui/atoms/Avatar/Avatar';

import styles from './NewComments.module.css';

type NewCommentType = { comment: string };

type NewComment = {
  authorId: string;
  profilePhoto: string;
  roleId: string;
  postId?: string;
  fileId?: string;
  commentId?: string | null;
  subCommentId?: string;
  fileCommentId?: string | null;
  onReplyAddedAction?: (newComment: CommentType) => void;
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
  onReplyAddedAction,
}: NewComment) => {
  const [valuesFields, setValuesFields] = useState('');

  const t = useI18n();
  const tComments = useScopedI18n('Comments');

  const initialValues = { comment: '' };
  const schemaNew = Yup.object({ comment: SchemaValidation().description });

  const createNewComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      const userData = await getUserData();

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

      const newLike = await toggleLiked({
        is: false,
        authorId: userData?.id!,
        postId,
        fileId,
        commentId,
        subCommentId,
        fileCommentId,
      });

      if (!newLike.changed || !newLike.idLiked) {
        setValuesFields(t('error'));
        return;
      }

      const { tableName } = selectCommentsData(postId, fileId, commentId, fileCommentId, subCommentId);

      onReplyAddedAction?.({
        authorName: userData?.pseudonym!,
        idLiked: newLike.idLiked,
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
          {valuesFields && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
