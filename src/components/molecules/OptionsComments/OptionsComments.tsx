'use client';

import { ReactNode, useContext, useEffect, useState } from 'react';
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

import { darkMode } from 'constants/links';
import { ResetFormType, RoleType, TableNameEnum } from 'types/global.types';

import { ModeContext } from 'providers/ModeProvider';
import { DCContext } from 'providers/DeleteCommentProvider';

import styles from './OptionsComments.module.scss';
import { AiFillLike, AiOutlineLike, AiOutlineMore } from 'react-icons/ai';
import { useI18n, useScopedI18n } from 'locales/client';

type OptionsType = {
  fileId?: string;
  fileCommentId?: string;
  commentId?: string;
  subCommentId?: string;
  lastCommentId?: string;
  roleId: string;
  postId?: string;
  authorId: string;
  userId: string;
  liked?: boolean;
  likes?: number;
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
  roleId,
  postId,
  authorId,
  userId,
  liked,
  likes,
  tableName,
  children,
}: OptionsType) => {
  const [like, setLike] = useState(false);
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

  const likedCount = () => {
    try {
      //      liked?.forEach((like) => (like === userId ? setLike(true) : setLike(false)));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    likedCount();
  }, []);

  const toggleLike = async () => {
    if (like) {
    } else {
    }
    //    setLikeCount(like ? (likeCount -= 1) : (likeCount += 1));
    setLike(!like);
  };

  const deleteComment = async () => {
    // const fileParams = encodeURI(
    //   JSON.stringify({
    //     fileCommentId: fileId,
    //     where: 'fileId',
    //     roleId,
    //     userId: authorId,
    //   }),
    // );
    // const params = encodeURI(
    //   JSON.stringify({
    //     commentId,
    //     where: 'commentId',
    //     roleId,
    //     userId: authorId,
    //     postId,
    //   }),
    // );
    // const subParams = encodeURI(
    //   JSON.stringify({
    //     commentId: subCommentId,
    //     where: 'subCommentId',
    //     roleId,
    //     userId: authorId,
    //     postId,
    //   }),
    // );
    // const lastParams = encodeURI(
    //   JSON.stringify({
    //     commentId: lastCommentId,
    //     where: 'postId',
    //     postId,
    //     userId: authorId,
    //     roleId,
    //   }),
    // );
    //
    try {
      //   !!commentId && (await axios.delete(`${backUrl}/comments/${params}`));
      //   !!fileId && (await axios.delete(`${backUrl}/api/files-comments/${fileParams}`));
      //   !!subCommentId && (await axios.delete(`${backUrl}/api/sub-comments/${subParams}`));
      //   !!lastCommentId && (await axios.delete(`${backUrl}/api/last-comments/${lastParams}`));
      //
      changeDel();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const updateComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      await updComment(tableName, commentId || fileCommentId || subCommentId || lastCommentId!, comment);
      onCloseEdit();
      resetForm(initialValues);
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
