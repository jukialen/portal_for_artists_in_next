import { useContext } from 'react';
import { Link } from '@chakra-ui/next-js';
import { Avatar } from '@chakra-ui/react';

import { SubCommentType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { LastComments } from 'components/molecules/LastComments/LastComments';
import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './SubComment.module.scss';

export const SubComment = ({
  subCommentId,
  commentId,
  subComment,
  authorProfilePhoto,
  authorName,
  roleId,
  groupRole,
  authorId,
  fileCommentId,
  date,
  fileId,
  postId,
  pseudonym,
  profilePhoto,
}: SubCommentType) => {
  const { del } = useContext(DCContext);

  return (
    <div className={del ? styles.container__deleted : styles.container}>
      <div className={styles.comment}>
        <Avatar src={authorProfilePhoto} className={styles.avatar} />
        <div className={styles.rightSideComment}>
          <div className={styles.topPartComment}>
            <p className={styles.pseudonym}>
              <Link href={`/user/${authorName}`}>{authorName}</Link>
            </p>
            <p className={styles.date}>{date}</p>
          </div>
          <h2 className={styles.text}>{subComment}</h2>
        </div>
      </div>

      <OptionsComments
        subCommentId={subCommentId}
        commentId={commentId!}
        roleId={roleId}
        postId={postId!}
        authorId={authorId}
      >
        <NewComments
          profilePhoto={profilePhoto!}
          subCommentId={subCommentId}
          fileCommentId={fileCommentId}
          fileId={fileId}
          postId={postId}
          authorId={authorId}
          author={authorName === pseudonym}
        />
        <LastComments subCommentId={subCommentId} fileId={fileId} postId={postId} />
      </OptionsComments>
    </div>
  );
};
