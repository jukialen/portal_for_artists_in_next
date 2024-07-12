import { useContext } from 'react';
import { Link } from '@chakra-ui/next-js';
import { Avatar, Badge } from '@chakra-ui/react';

import { CommentType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { SubComments } from 'components/molecules/SubComments/SubComments';
import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './Comment.module.scss';

export const Comment = ({
  commentId,
  comment,
  authorName,
  authorProfilePhoto,
  role,
  roleId,
  authorId,
  postId,
  date,
}: CommentType) => {
  const { del } = useContext(DCContext);

  return (
    <div className={del ? styles.container__deleted : styles.container}>
      <div className={styles.comment}>
        <Avatar src={authorProfilePhoto} className={styles.avatar} />
        <Badge ml="1" fontSize=".8rem" colorScheme="blue">
          role
        </Badge>
        <div className={styles.rightSideComment}>
          <div className={styles.topPartComment}>
            <p className={styles.pseudonym}>
              <Link href={`/user/${authorName}`}>{authorName}</Link>
            </p>
            <p className={styles.date}>{date}</p>
          </div>
          <h2 className={styles.text}>{comment}</h2>
        </div>
      </div>
      <OptionsComments
        commentId={commentId}
        roleId={roleId}
        authorId={authorId}
        role={role}
       userId={authorId}
      >
        <NewComments
          profilePhoto={authorProfilePhoto}
          commentId={commentId}
          postId={postId}
          authorId={authorId}
          author={pseudonym === authorName}
          adModRoleId={adModRoleId}
        />
        <SubComments commentId={commentId} postId={postId} />
      </OptionsComments>
    </div>
  );
};
