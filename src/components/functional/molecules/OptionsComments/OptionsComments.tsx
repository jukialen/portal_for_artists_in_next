'use client';

import { ReactNode, useContext, useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { updComment, delComment } from 'utils/comments';
import { toggleLiked } from 'utils/likes';

import { ResetFormType, TableNameType } from 'types/global.types';

import { useI18n, useScopedI18n } from 'locales/client';

import { DCContext } from 'providers/DeleteCommentProvider';

import { NewComments } from 'components/functional/atoms/NewComments/NewComments';

import styles from './OptionsComments.module.scss';
import { AiFillLike, AiOutlineLike, AiOutlineMore } from 'react-icons/ai';

type OptionsType = {
  fileId?: string;
  fileCommentId?: string;
  commentId?: string;
  subCommentId?: string;
  lastCommentId?: string;
  postId?: string;
  authorId: string;
  userId: string;
  liked: boolean;
  likes: number;
  authorProfilePhoto: string;
  roleId: string;
  comment: string;
  tableName: TableNameType;
  children?: ReactNode;
};

type NewCommentType = { comment: string };

export const OptionsComments = ({
  fileId,
  fileCommentId,
  commentId,
  subCommentId,
  lastCommentId,
  postId,
  authorId,
  userId,
  liked,
  likes: l,
  authorProfilePhoto,
  roleId,
  comment,
  tableName,
  children,
}: OptionsType) => {
  const [like, setLike] = useState(liked);
  let [likes, setLikes] = useState(l || 0);
  const [moreOptions, setMoreOptions] = useState(false);
  const [com, setCom] = useState(false);
  const { changeDel } = useContext(DCContext);

  const initialValues = { comment };

  const schemaNew = Yup.object({ comment: SchemaValidation().description });

  const toggleMoreOptions = () => setMoreOptions(!moreOptions);
  const openComs = () => setCom(!com);

  const t = useI18n();
  const tComments = useScopedI18n('Comments');
  const tDeletionFile = useScopedI18n('DeletionFile');

  const toggleLike = async () => {
    try {
      const toggle = async () => (await toggleLiked(like, authorId, postId, fileId))!;

      if (await toggle()) {
        setLikes(like ? --likes : ++likes);
        setLike(!like);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteComment = async () => {
    try {
      !!fileId && (await delComment(tableName, 'fileId', fileId));
      !!fileCommentId && (await delComment(tableName, 'fileCommentId', fileCommentId));
      !!commentId && (await delComment(tableName, 'commentId', commentId));
      !!subCommentId && (await delComment(tableName, 'subCommentId', subCommentId));
      !!lastCommentId && (await delComment(tableName, 'lastCommentId', lastCommentId));

      changeDel();
    } catch (e) {
      console.error(e);
    }
  };

  const updateComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      const ids = [
        [fileId, 'fileId'] as const,
        [fileCommentId, 'fileCommentId'] as const,
        [commentId, 'commentId'] as const,
        [subCommentId, 'subCommentId'] as const,
        [lastCommentId, 'lastCommentId'] as const,
      ] as const;
      const [id, fieldName] = ids.find(([val]) => !!val)!;

      if (id && fieldName) {
        const upd = await updComment(tableName, fieldName, id, comment);
        if (upd) resetForm(initialValues);
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className={styles.options}>
        <div className={styles.likesContainer}>
          <button
            aria-label={like ? t('Posts.likedAria') : t('Posts.likeAria')}
            className={like ? styles.isLikes : styles.likes}
            onClick={toggleLike}>
            {like ? <AiFillLike size="sm" /> : <AiOutlineLike size="sm" />}
          </button>
          <p className={like ? styles.isLikesCount : styles.likesCount}>{likes}</p>
        </div>

        <div className={styles.buttons}>
          {authorId === userId && (
            <>
              <button className={styles.moreBut} onClick={toggleMoreOptions} aria-label="open more options">
                <AiOutlineMore />
              </button>
              {moreOptions && (
                <div className={styles.more}>
                  <button
                    className={styles.delete}
                    popoverTarget={`remove_popover_${fileCommentId}`}
                    popoverTargetAction="show">
                    {tDeletionFile('deleteButton')}
                  </button>
                  <button
                    className={styles.edit}
                    popoverTarget={`edit_popover_${fileCommentId}`}
                    popoverTargetAction="show">
                    {t('edit')}
                  </button>
                </div>
              )}

              <div id={`edit_popover_${fileCommentId}`} popover="auto" className={styles.content}>
                <h3 className={styles.title}>{tComments('updateTitle')}</h3>

                <Formik
                  initialValues={initialValues}
                  validationSchema={schemaNew}
                  onSubmit={updateComment}
                  enableReinitialize>
                  {({ values, handleChange }) => (
                    <Form method="post">
                      <textarea
                        name="comment"
                        id="comment"
                        value={values.comment}
                        onChange={handleChange}
                        className={styles.comment}
                        placeholder={tComments('newComPlaceholder')}
                        aria-label={tComments('newComAria')}
                      />

                      <div className={styles.actionButton}>
                        <button
                          type="button"
                          className={styles.cancel}
                          onClick={toggleMoreOptions}
                          popoverTarget={`edit_popover_${fileCommentId}`}
                          popoverTargetAction="hide">
                          {tDeletionFile('cancelButton')}
                        </button>

                        <button type="submit" className={styles.submit} popoverTargetAction="hide">
                          {tComments('updateButton')}
                        </button>
                      </div>
                      <ErrorMessage name="comment" />
                    </Form>
                  )}
                </Formik>
              </div>

              <div id={`remove_popover_${fileCommentId}`} popover="auto" className={styles.removeContent}>
                <h3 className={styles.title}>{tComments('deleteCommentTitle')}</h3>
                <h4>{tDeletionFile('question')}</h4>

                <div className={styles.actionButton}>
                  <button
                    className={styles.cancel}
                    popoverTarget={`remove_popover_${fileCommentId}`}
                    popoverTargetAction="hide">
                    {tDeletionFile('cancelButton')}
                  </button>
                  <button className={styles.submit} onClick={deleteComment} popoverTargetAction="hide">
                    {tDeletionFile('deleteButton')}
                  </button>
                </div>
              </div>
            </>
          )}
          <button className={styles.answer} onClick={openComs}>
            {tComments('reply')}
          </button>
        </div>
      </div>
      {com && (
        <NewComments
          fileId={fileId}
          fileCommentId={fileCommentId}
          authorId={authorId}
          profilePhoto={authorProfilePhoto}
          roleId={roleId!}
        />
      )}
      {!!children && children}
    </>
  );
};
