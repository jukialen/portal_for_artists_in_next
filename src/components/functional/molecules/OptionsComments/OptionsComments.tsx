'use client';

import { ReactNode, useContext, useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Dialog } from '@ark-ui/react/dialog';

import { updComment, delComment } from 'utils/comments';
import { toggleLiked } from 'utils/likes';

import { ResetFormType, TableNameType } from 'types/global.types';

import { useI18n, useScopedI18n } from 'locales/client';

import { DCContext } from 'providers/DeleteCommentProvider';

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
  tableName,
  children,
}: OptionsType) => {
  const [like, setLike] = useState(liked);
  let [likes, setLikes] = useState(l || 0);
  const [moreOptions, setMoreOptions] = useState(false);
  const [com, setCom] = useState(false);
  const { changeDel } = useContext(DCContext);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const initialValues = { comment: '' };

  const schemaNew = Yup.object({ comment: SchemaValidation().description });

  const openMoreOptions = () => setMoreOptions(!moreOptions);
  const onClose = () => setOpen(false);
  const onCloseEdit = () => setOpenEdit(false);
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
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const updateComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      let upd: boolean | undefined;

      if (!!fileId) {
        upd = await updComment(tableName, 'fileId', fileId!, comment);
      }
      if (!!fileCommentId) {
        upd = await updComment(tableName, 'fileCommentId', fileCommentId!, comment);
      }
      if (!!commentId) {
        upd = await updComment(tableName, 'commentId', commentId!, comment);
      }
      if (!!subCommentId) {
        upd = await updComment(tableName, 'subCommentId', subCommentId!, comment);
      }
      if (!!lastCommentId) {
        upd = await updComment(tableName, 'lastCommentId', lastCommentId!, comment);
      }

      if (!!upd) {
        onCloseEdit();
        resetForm(initialValues);
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
            className={styles.likes}
            onClick={toggleLike}>
            like ? <AiFillLike size="sm" /> : <AiOutlineLike size="sm" />
          </button>
          <p className={styles.likesCount}>{likes}</p>
        </div>

        <div className={styles.buttons}>
          {authorId === userId && (
            <>
              <button className={styles.moreBut} onClick={openMoreOptions} aria-label="open more options">
                <AiOutlineMore />
              </button>
              {moreOptions && (
                <div className={styles.more}>
                  <button className={styles.delete} onClick={() => setOpen(!open)}>
                    {tDeletionFile('deleteButton')}
                  </button>
                  <button className={styles.edit} onClick={() => setOpenEdit(!openEdit)}>
                    {t('edit')}
                  </button>
                </div>
              )}
              <Dialog.Root
                lazyMount
                unmountOnExit
                onExitComplete={() => console.log('onExitComplete invoked')}
                open={open}
                onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
                <Dialog.Content className={styles.content}>
                  <Dialog.Title className={styles.title}>{tComments('deleteCommentTitle')}</Dialog.Title>
                  <Dialog.Description>{tDeletionFile('question')}</Dialog.Description>

                  <div className={styles.actionButton}>
                    <button className={styles.cancel}>{tDeletionFile('cancelButton')}</button>
                    <button className={styles.submit} onClick={deleteComment}>
                      {tDeletionFile('deleteButton')}
                    </button>
                  </div>
                  <Dialog.CloseTrigger className={styles.closeButton} />
                </Dialog.Content>
              </Dialog.Root>

              <Dialog.Root
                lazyMount
                unmountOnExit
                onExitComplete={() => console.log('onExitComplete invoked')}
                open={openEdit}
                onOpenChange={() => setOpenEdit(!openEdit)}>
                <Dialog.Content className={styles.content}>
                  <Dialog.Title className={styles.title}>{tComments('updateTitle')}</Dialog.Title>

                  <Dialog.Description>
                    <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={updateComment}>
                      {({ values, handleChange }) => (
                        <Form>
                          <div className={styles.comment}>
                            <textarea
                              name="comment"
                              id="comment"
                              value={values.comment}
                              onChange={handleChange}
                              placeholder={tComments('newComPlaceholder')}
                              aria-label={tComments('newComAria')}
                              required
                            />
                          </div>

                          <div className={styles.actionButton}>
                            <button type="submit" className={styles.submit}>
                              {tComments('updateButton')}
                            </button>

                            <div className={styles.cancel} onClick={onCloseEdit}>
                              {tDeletionFile('cancelButton')}
                            </div>
                          </div>
                          <ErrorMessage name="comment" />
                        </Form>
                      )}
                    </Formik>
                  </Dialog.Description>
                  <Dialog.CloseTrigger className={styles.closeButton} />
                </Dialog.Content>
              </Dialog.Root>
            </>
          )}
          <button className={styles.answer} onClick={openComs}>
            {tComments('reply')}
          </button>
        </div>
      </div>

      {!!children && children}
    </>
  );
};
