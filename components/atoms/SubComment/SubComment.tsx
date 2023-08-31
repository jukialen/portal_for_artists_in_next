import { useContext } from 'react';
import Link from 'next/link';
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
  pseudonym,
  profilePhoto,
  role,
  roleId,
  groupRole,
  authorId,
  fileCommentId,
  date,
  fileId,
  postId,
}: SubCommentType) => {
  const { del } = useContext(DCContext);

  return (
    <div className={del ? styles.container__deleted : styles.container}>
      <div className={styles.comment}>
        <Avatar src={profilePhoto} className={styles.avatar} />
        <div className={styles.rightSideComment}>
          <div className={styles.topPartComment}>
            <p className={styles.pseudonym}>
              <Link href={`/user/${pseudonym}`}>{pseudonym}</Link>
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
        groupRole={groupRole}
        authorId={authorId}>
        <NewComments
          profilePhoto={profilePhoto}
          subCommentId={subCommentId}
          fileCommentId={fileCommentId}
          fileId={fileId}
          postId={postId}
        />
        <LastComments subCommentId={subCommentId} fileId={fileId} postId={postId} />
      </OptionsComments>
    </div>
  );
};
