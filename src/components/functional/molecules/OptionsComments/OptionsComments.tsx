'use client';

import { useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'schemasValidation/schemaValidation';

import { updComment, delComment } from 'utils/comments';
import { toggleLiked } from 'utils/server/likes';

import { ResetFormType, CommentsTableNameType, ColumnCommentsTableNameType, CommentType } from 'types/global.types';

import { useI18n, useScopedI18n } from 'locales/client';

import { NewComments } from 'components/functional/atoms/NewComments/NewComments';
import { Comments } from 'components/functional/molecules/Comments/Comments';

import styles from './OptionsComments.module.css';
import { AiFillLike, AiOutlineLike, AiOutlineMore } from 'react-icons/ai';

type OptionsType = {
  fileId?: string;
  fileCommentId?: string | null;
  commentId?: string | null;
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
  tableName: CommentsTableNameType;
  fieldName: ColumnCommentsTableNameType;
  onDeleteSuccessAction: () => void;
  onUpdateSuccessAction: (text: string) => void;
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
  onDeleteSuccessAction,
  onUpdateSuccessAction,
}: OptionsType) => {
  const [like, setLike] = useState(liked);
  const [likes, setLikes] = useState(l || 0);
  const [moreOptions, setMoreOptions] = useState(false);
  const [com, setCom] = useState(false);
  const [newReply, setNewReply] = useState<CommentType | null>(null);

  const toggleMoreOptions = () => setMoreOptions(!moreOptions);
  const openComs = () => setCom(!com);

  const initialValues = { comment };
  const schemaNew = Yup.object({ comment: SchemaValidation().description });

  const t = useI18n();
  const tComments = useScopedI18n('Comments');
  const tDeletionFile = useScopedI18n('DeletionFile');

  const popoverEditId = `edit_popover_${fileCommentId || commentId || subCommentId || lastCommentId}`;
  const popoverRemoveId = `remove_popover_${fileCommentId || commentId || subCommentId || lastCommentId}`;

  const toggleLike = async () => {
    try {
      const toggle = await toggleLiked({ is: like, authorId, postId, fileId, fileCommentId, commentId, subCommentId });

      if (toggle) {
        setLikes((prev) => (like ? prev - 1 : prev + 1));
        setLike(!like);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const deleteComment = async () => {
    try {
      await delComment({ commentId, fileCommentId, subCommentId, lastCommentId });
      const popover = document.getElementById(popoverEditId) as HTMLDivElement | null;
      if (popover) {
        popover.hidePopover();
        onDeleteSuccessAction();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const updateComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      const upd = await updComment({ commentId, fileCommentId, subCommentId, lastCommentId }, comment);

      const popover = document.getElementById(popoverEditId) as HTMLDivElement | null;
      if (upd && popover) {
        popover.hidePopover();

        onUpdateSuccessAction(comment);
        setMoreOptions(false);
      } else {
        resetForm({ values: initialValues });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className={styles.options}>
        <button
          aria-label={like ? t('Posts.likedAria') : t('Posts.likeAria')}
          className={like ? styles.isLikes : styles.likes}
          onClick={toggleLike}>
          {like ? <AiFillLike /> : <AiOutlineLike />}
          <p className={like ? styles.isLikesCount : styles.likesCount}>{likes}</p>
        </button>

        <div className={styles.buttons}>
          {authorId === userId && (
            <>
              <button className={styles.moreBut} onClick={toggleMoreOptions} aria-label="open more options">
                <AiOutlineMore />
              </button>
              {moreOptions && (
                <div className={styles.more}>
                  <button className={styles.delete} popoverTarget={popoverRemoveId} popoverTargetAction="show">
                    {tDeletionFile('deleteButton')}
                  </button>
                  <button className={styles.edit} popoverTarget={popoverEditId} popoverTargetAction="show">
                    {t('edit')}
                  </button>
                </div>
              )}

              <div id={popoverEditId} popover="auto" className={styles.content}>
                <h3 className={styles.title}>{tComments('updateTitle')}</h3>

                <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={updateComment}>
                  {({ values, handleChange }) => (
                    <Form>
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
                          popoverTarget={popoverEditId}
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

              <div id={popoverRemoveId} popover="auto" className={styles.removeContent}>
                <h3 className={styles.title}>{tComments('deleteCommentTitle')}</h3>
                <h4>{tDeletionFile('question')}</h4>

                <div className={styles.actionButton}>
                  <button className={styles.cancel} popoverTarget={popoverRemoveId} popoverTargetAction="hide">
                    {tDeletionFile('cancelButton')}
                  </button>
                  <button className={styles.submit} onClick={deleteComment} popoverTargetAction="hide">
                    {tDeletionFile('deleteButton')}
                  </button>
                </div>
              </div>
            </>
          )}
          {!lastCommentId && (
            <button className={styles.answer} onClick={openComs}>
              {tComments('reply')}
            </button>
          )}
        </div>
      </div>
      {com && (
        <NewComments
          fileId={fileId}
          fileCommentId={fileCommentId}
          commentId={commentId}
          subCommentId={subCommentId}
          authorId={authorId}
          profilePhoto={authorProfilePhoto}
          roleId={roleId!}
          onReplyAddedAction={setNewReply}
        />
      )}
      {com && (
        <div className={styles.repliesContainer}>
          <Comments
            commentId={commentId}
            fileCommentId={fileCommentId}
            subCommentId={subCommentId}
            lastCommentId={lastCommentId}
            postId={postId}
            fileId={fileId}
            roleId={roleId}
            newReply={newReply}
          />
        </div>
      )}
    </>
  );
};
