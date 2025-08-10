import { useContext } from 'react';
import Link from 'next/link';
import { Avatar } from 'components/ui/avatar';
import { Tag } from 'components/ui/tag';

import { SubCommentType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { LastComments } from 'components/molecules/LastComments/LastComments';
import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './SubComment.module.scss';

export const SubComment = ({
  subCommentId,
  content,
  authorProfilePhoto,
  authorName,
  role,
  roleId,
  authorId,
  date,
  fileId,
  postId,
  profilePhoto,
  liked,
  likes,
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
              <Tag variant="subtle" colorPalette="blue">
                {role}
              </Tag>
            </p>
            <p className={styles.date}>{date}</p>
          </div>
          <h2 className={styles.text}>{content}</h2>
        </div>
      </div>

      <OptionsComments
        subCommentId={subCommentId}
        postId={postId!}
        authorId={authorId}
        userId={authorId}
        liked={liked}
        likes={likes}
        tableName='SubComments'>
        <NewComments
          profilePhoto={profilePhoto!}
          subCommentId={subCommentId}
          fileId={fileId}
          postId={postId}
          authorId={authorId}
          roleId={roleId!}
        />
        <LastComments subCommentId={subCommentId} roleId={roleId!} />
      </OptionsComments>
    </div>
  );
};
