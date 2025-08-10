import { useContext } from 'react';
import Link from 'next/link';
import { Avatar } from 'components/ui/avatar';
import { Tag } from 'components/ui/tag';

import { LastCommentType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';
import { NewComments } from 'components/atoms/NewComments/NewComments';

import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './LastComment.module.scss';

export const LastComment = ({
  lastCommentId,
  content,
  authorProfilePhoto,
  authorName,
  role,
  roleId,
  authorId,
  subCommentId,
  date,
  liked,
  likes,
}: LastCommentType) => {
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
        lastCommentId={lastCommentId}
        authorId={authorId}
        userId={authorId}
        liked={liked}
        likes={likes}
        tableName="LastComments">
        <NewComments
          profilePhoto={authorProfilePhoto!}
          subCommentId={subCommentId}
          authorId={authorId}
          roleId={roleId!}
        />
      </OptionsComments>
    </div>
  );
};
