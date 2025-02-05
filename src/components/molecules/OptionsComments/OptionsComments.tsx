'use client';

import { ReactNode, useContext, useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Button } from 'components/ui/button';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { IconButton, Textarea } from '@chakra-ui/react';

import { updComment, delComment } from 'utils/comments';
import { toggleLiked } from 'utils/likes';

import { darkMode } from 'constants/links';
import { ResetFormType, TableNameEnum } from 'types/global.types';

import { useI18n, useScopedI18n } from 'locales/client';

import { ModeContext } from 'providers/ModeProvider';
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
  tableName: TableNameEnum;
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
  const { isMode } = useContext(ModeContext);
  const { changeDel } = useContext(DCContext);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const selectedColor = '#FFD068';

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
          <IconButton
            aria-label={like ? t('Posts.likedAria') : t('Posts.likeAria')}
            colorScheme="blue"
            className={styles.likes}
            onClick={toggleLike}>
            like ? <AiFillLike size="sm" /> : <AiOutlineLike size="sm" />
          </IconButton>
          <p className={styles.likesCount}>{likes}</p>
        </div>

        <div className={styles.buttons}>
          {authorId === userId && (
            <>
              <IconButton
                variant="outline"
                colorScheme="blue"
                _hover={{ background: 'blue.200' }}
                className={styles.moreBut}
                onClick={openMoreOptions}
                aria-label="open more options">
                <AiOutlineMore />
              </IconButton>
              {moreOptions && (
                <div className={styles.more}>
                  <Button variant="ghost" colorScheme="red" className={styles.delete} onClick={() => setOpen(!open)}>
                    {tDeletionFile('deleteButton')}
                  </Button>
                  <Button asChild className={styles.edit} onClick={() => setOpenEdit(!openEdit)}>
                    {t('edit')}
                  </Button>
                </div>
              )}
              <DialogRoot
                lazyMount
                open={open}
                onOpenChange={(e: { open: boolean | ((prevState: boolean) => boolean) }) => setOpen(e.open)}>
                <DialogTrigger></DialogTrigger>
                <DialogContent m="auto">
                  <DialogHeader fontSize="lg" fontWeight="bold">
                    <DialogTitle>{tComments('deleteCommentTitle')}</DialogTitle>
                  </DialogHeader>

                  <DialogBody>{tDeletionFile('question')}</DialogBody>

                  <DialogFooter>
                    <DialogActionTrigger borderColor="gray.100" onClick={onClose}>
                      {tDeletionFile('cancelButton')}
                    </DialogActionTrigger>
                    <Button colorScheme="red" borderColor="red.500" onClick={deleteComment} ml={3}>
                      {tDeletionFile('deleteButton')}
                    </Button>
                  </DialogFooter>
                  <DialogCloseTrigger color={selectedColor} borderColor="transparent" />
                </DialogContent>
              </DialogRoot>

              <DialogRoot
                lazyMount
                open={openEdit}
                onOpenChange={(e: { openEdit: boolean | ((prevState: boolean) => boolean) }) =>
                  setOpenEdit(e.openEdit)
                }>
                <DialogTrigger></DialogTrigger>
                <DialogContent m="auto" backgroundColor={`${isMode === darkMode ? '#2D3748' : '#f7f7f7'}`}>
                  <DialogHeader
                    fontSize="lg"
                    fontWeight="bold"
                    color={`${isMode === darkMode ? '#f7f7f7' : '#2D3748'}`}>
                    <DialogTitle>{tComments('updateTitle')}</DialogTitle>
                  </DialogHeader>

                  <DialogBody>
                    <Formik initialValues={initialValues} validationSchema={schemaNew} onSubmit={updateComment}>
                      {({ values, handleChange }) => (
                        <Form>
                          <div
                            style={{
                              width: '95%',
                              margin: '1rem auto 0',
                              padding: '0 0.25rem',
                            }}>
                            <Textarea
                              name="comment"
                              id="comment"
                              value={values.comment}
                              onChange={handleChange}
                              placeholder={tComments('newComPlaceholder')}
                              aria-label={tComments('newComAria')}
                              required
                              color="#4F8DFF"
                            />
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              gap: '1rem',
                              margin: '2rem',
                              justifyContent: 'space-around',
                            }}>
                            <Button
                              type="submit"
                              colorScheme="blue"
                              display="flex"
                              backgroundColor="#4F8DFF"
                              borderColor="#4F8DFF"
                              cursor="pointer">
                              {tComments('updateButton')}
                            </Button>

                            <DialogActionTrigger
                              backgroundColor="gray.300"
                              borderColor="gray.300"
                              onClick={onCloseEdit}
                              cursor="pointer">
                              {tDeletionFile('cancelButton')}
                            </DialogActionTrigger>
                          </div>
                          <ErrorMessage name="comment" />
                        </Form>
                      )}
                    </Formik>
                  </DialogBody>
                  <DialogCloseTrigger color={selectedColor} borderColor="transparent" />
                </DialogContent>
              </DialogRoot>
            </>
          )}
          <Button asChild color="blue" className={styles.answer} onClick={openComs}>
            {tComments('reply')}
          </Button>
        </div>
      </div>

      {!!children && children}
    </>
  );
};
