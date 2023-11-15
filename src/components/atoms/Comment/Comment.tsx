import { useContext } from 'react';
import Link from 'next/link';
import { Avatar } from '@chakra-ui/react';

import { CommentType } from 'src/types/global.types';

import { DCContext } from 'src/providers/DeleteCommentProvider';

import { NewComments } from 'src/components/atoms/NewComments/NewComments';
import { SubComments } from 'src/components/molecules/SubComments/SubComments';
import { OptionsComments } from 'src/components/molecules/OptionsComments/OptionsComments';

import styles from './Comment.module.scss';

export const Comment = ({
  commentId,
  comment,
  pseudonym,
  profilePhoto,
  role,
  roleId,
  authorId,
  groupRole,
  postId,
  date,
}: CommentType) => {
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
          <h2 className={styles.text}>{comment}</h2>
        </div>
      </div>
      <OptionsComments
        commentId={commentId}
        roleId={roleId}
        groupRole={groupRole}
        authorId={authorId}
        //        likes={likes}
        //        liked={liked}
        //        name={name}
      >
        <NewComments profilePhoto={profilePhoto} commentId={commentId} postId={postId} />
        <SubComments commentId={commentId} postId={postId} />
      </OptionsComments>
    </div>
  );
};
