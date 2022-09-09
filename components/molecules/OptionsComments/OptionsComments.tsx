import { useEffect, useRef, useState } from 'react';
import { auth } from '../../../firebase';
import { arrayRemove, arrayUnion, deleteDoc, setDoc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton
} from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

import { CommentType } from 'types/global.types';

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { SubComments } from 'components/molecules/SubComments/SubComments';
import { LastComments } from 'components/molecules/LastComments/LastComments';

import styles from './OptionsComments.module.scss';
import { AiFillLike, AiOutlineLike, AiOutlineMore } from 'react-icons/ai';

export const OptionsComments = ({
  userId,
  subCollection,
  idPost,
  idComment,
  idSubComment,
  authorId,
  likes,
  liked,
  refDocCom,
  refSubCom,
  refDelCom,
  refDocSubCom,
  refLastCom
}: CommentType) => {
  const [com, setCom] = useState(false);
  const [like, setLike] = useState(false);
  let [likeCount, setLikeCount] = useState(likes);
  const [moreOptions, setMoreOptions] = useState(false);
  const [open, setOpen] = useState(false);
  
  const cancelRef = useRef(null);
  const data = useHookSWR();
  
  const currentUser = auth.currentUser?.uid;
  
  const openMoreOptions = () => setMoreOptions(!moreOptions);
  const openComs = () => setCom(!com);
  const onClose = () => setOpen(false);
  
  const deleteComment = async () => {
    try {
      await deleteDoc(refDelCom!);
      await onClose();
    } catch (e) {
      console.error(e);
    }
  };
  
  const likedCount = () => {
    try {
      liked?.forEach(like => like === userId ? setLike(true) : setLike(false));
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    likedCount();
  }, []);
  
  const toggleLike = async () => {
    
    if (like) {
      await setDoc(refDelCom!,
        { likes: likeCount -= 1, liked: arrayRemove(currentUser) },
        { merge: true });
    } else {
      await setDoc(refDelCom!,
        { likes: likeCount += 1, liked: arrayUnion(currentUser) },
        { merge: true });
    };
    
    setLikeCount(like ? likeCount -= 1 : likeCount += 1);
    setLike(!like);
  };
  
  return <>
    <div className={styles.options}>
      <div className={styles.likesContainer}>
        <IconButton
          aria-label={like ? data?.Posts?.likedAria : data?.Posts?.likeAria}
          colorScheme='blue'
          icon={like ? <AiFillLike size='sm' /> : <AiOutlineLike size='sm' />}
          className={styles.likes}
          onClick={toggleLike}
        />
        <p className={styles.likesCount}>{likeCount}</p>
      </div>
      
      <div className={styles.buttons}>
        {authorId === currentUser && <>
          <IconButton
            variant='outline'
            colorScheme='blue'
            _hover={{ background: 'blue.200' }}
            icon={<AiOutlineMore />}
            className={styles.moreBut}
            onClick={openMoreOptions}
            aria-label='open more options'
          />
          {
            moreOptions && <div className={styles.more}>
              <Button
                variant='ghost'
                colorScheme='red'
                className={styles.delete}
                onClick={() => setOpen(!open)}
              >
                {data.DeletionFile?.deleteButton}
              </Button>
              <Button
                variant='link'
                className={styles.edit}
              >
                {data?.edit}
              </Button>
            </div>
          }
          <AlertDialog
            isOpen={open}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent m='auto'>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  {data?.DeletionFile?.title}
                </AlertDialogHeader>
                
                <AlertDialogBody>
                  {data?.DeletionFile?.question}
                </AlertDialogBody>
                
                <AlertDialogFooter>
                  <Button ref={cancelRef} borderColor='gray.100' onClick={onClose}>
                    {data?.DeletionFile?.cancelButton}
                  </Button>
                  <Button colorScheme='red' borderColor='red.500' onClick={deleteComment} ml={3}>
                    {data?.DeletionFile?.deleteButton}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
        }
        {!!(refDocCom || refDocSubCom) && <Button
          variant='link'
          color='blue'
          className={styles.answer}
          onClick={openComs}
        >
          {data?.Comments?.reply}
        </Button>}
      </div>
    </div>
    
    {
      com && <>
        <NewComments
          name={subCollection!}
          // @ts-ignore
          refCom={refSubCom! || refLastCom!}
        />
        {
          !!refDocCom ? <SubComments
            refSubCom={refSubCom}
            userId={userId}
            subCollection={subCollection}
            idPost={idPost}
            idComment={idComment}
          /> : !!refDocSubCom ? <LastComments
            userId={userId}
            subCollection={subCollection}
            idPost={idPost}
            idComment={idComment}
            idSubComment={idSubComment}
            refLastCom={refLastCom!}
          /> : null
        }
      </>
    }
  </>;
};