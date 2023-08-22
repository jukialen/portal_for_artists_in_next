import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Textarea,
} from '@chakra-ui/react';

import { ResetFormType, Role } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import { ModeContext } from 'providers/ModeProvider';
import { DCContext } from 'providers/DeleteCommentProvider';

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { SubComments } from 'components/molecules/SubComments/SubComments';
import { LastComments } from 'components/molecules/LastComments/LastComments';

import styles from './OptionsComments.module.scss';
import { AiFillLike, AiOutlineLike, AiOutlineMore } from 'react-icons/ai';

type OptionsType = {
  postId?: string;
  commentId?: string;
  subCommentId?: string;
  lastComment?: string;
  roleId: string;
  groupRole: Role;
  authorId: string;
  liked?: boolean;
  likes?: number;
  name?: string;
};

type NewCommentType = { comment: string };

export const OptionsComments = ({
  postId,
  commentId,
  subCommentId,
  roleId,
  groupRole,
  authorId,
  liked,
  likes,
  name,
}: OptionsType) => {
  const [like, setLike] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [com, setCom] = useState(false);
  const { isMode } = useContext(ModeContext);
  const { changeDel } = useContext(DCContext);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const cancelRef = useRef(null);
  const cancelEditRef = useRef(null);

  const data = useHookSWR();
  const { id } = useUserData();

  const initialValues = { comment: '' };

  const schemaNew = Yup.object({ comment: SchemaValidation().description });

  const openMoreOptions = () => setMoreOptions(!moreOptions);
  const onClose = () => setOpen(false);
  const onCloseEdit = () => setOpenEdit(false);
  const openComs = () => setCom(!com);

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
    try {
      await axios.delete(`${backUrl}/comments/${commentId}/${roleId}/${groupRole}`);

      await changeDel();
      await onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const updateComment = async ({ comment }: NewCommentType, { resetForm }: ResetFormType) => {
    try {
      await onCloseEdit();
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
            aria-label={like ? data?.Posts?.likedAria : data?.Posts?.likeAria}
            colorScheme="blue"
            icon={like ? <AiFillLike size="sm" /> : <AiOutlineLike size="sm" />}
            className={styles.likes}
            onClick={toggleLike}
          />
          <p className={styles.likesCount}>{likes}</p>
        </div>

        <div className={styles.buttons}>
          {authorId === id && (
            <>
              <IconButton
                variant="outline"
                colorScheme="blue"
                _hover={{ background: 'blue.200' }}
                icon={<AiOutlineMore />}
                className={styles.moreBut}
                onClick={openMoreOptions}
                aria-label="open more options"
              />
              {moreOptions && (
                <div className={styles.more}>
                  <Button variant="ghost" colorScheme="red" className={styles.delete} onClick={() => setOpen(!open)}>
                    {data?.DeletionFile?.deleteButton}
                  </Button>
                  <Button variant="link" className={styles.edit} onClick={() => setOpenEdit(!openEdit)}>
                    {data?.edit}
                  </Button>
                </div>
              )}
              <AlertDialog isOpen={open} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                  <AlertDialogContent m="auto">
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      {data?.Comments?.deleteCommentTitle}
                    </AlertDialogHeader>

                    <AlertDialogBody>{data?.DeletionFile?.question}</AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} borderColor="gray.100" onClick={onClose}>
                        {data?.DeletionFile?.cancelButton}
                      </Button>
                      <Button colorScheme="red" borderColor="red.500" onClick={deleteComment} ml={3}>
                        {data?.DeletionFile?.deleteButton}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>

              <AlertDialog isOpen={openEdit} leastDestructiveRef={cancelEditRef} onClose={onCloseEdit}>
                <AlertDialogOverlay>
                  <AlertDialogContent m="auto" backgroundColor={`${isMode ? '#2D3748' : '#f7f7f7'}`}>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold" color={`${isMode ? '#f7f7f7' : '#2D3748'}`}>
                      {data?.Comments?.updateTitle}
                    </AlertDialogHeader>

                    <AlertDialogBody>
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
                                placeholder={data?.Comments?.newComPlaceholder}
                                aria-label={data?.Comments?.newComAria}
                                isRequired
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
                                {data?.Comments?.updateButton}
                              </Button>

                              <Button
                                ref={cancelRef}
                                backgroundColor="gray.300"
                                borderColor="gray.300"
                                onClick={onCloseEdit}
                                cursor="pointer">
                                {data?.DeletionFile?.cancelButton}
                              </Button>
                            </div>
                            <ErrorMessage name="comment" />
                          </Form>
                        )}
                      </Formik>
                    </AlertDialogBody>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          )}
          {/*{!!(refDocCom || refDocSubCom) && (*/}
          <Button variant="link" color="blue" className={styles.answer} onClick={openComs}>
            {data?.Comments?.reply}
          </Button>
          {/*)}*/}
        </div>
      </div>
      {com && (
        <>
          {/*<NewComments*/}
          {/*  name={groupSource ? nameGroup : subCollection}*/}
          {/*  // @ts-ignore*/}
          {/*  refCom={refLastCom! || refSubCom!}*/}
          {/*/>*/}
          {/*{!!refDocCom ? (*/}
          {/*  <SubComments*/}
          {/*    refSubCom={refSubCom}*/}
          {/*    userId={userId}*/}
          {/*    subCollection={subCollection}*/}
          {/*    idPost={idPost}*/}
          {/*    idComment={idComment}*/}
          {/*    groupSource={groupSource}*/}
          {/*  />*/}
          {/*) : !!refDocSubCom ? (*/}
          {/*  <LastComments*/}
          {/*    userId={userId}*/}
          {/*    subCollection={subCollection}*/}
          {/*    idPost={idPost}*/}
          {/*    idComment={idComment}*/}
          {/*    idSubComment={idSubComment}*/}
          {/*    refLastCom={refLastCom!}*/}
          {/*    groupSource={groupSource}*/}
          {/*  />*/}
          {/*) : null}*/}
        </>
      )}
    </>
  );
};
