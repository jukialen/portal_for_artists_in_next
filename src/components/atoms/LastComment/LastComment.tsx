import { useContext } from 'react';
import Link from 'next/link'
import { Avatar } from 'components/ui/avatar';

import { LastCommentType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

export const LastComment = ({
  lastCommentId,
  lastComment,
  authorProfilePhoto,
  authorName,
  roleId,
  groupRole,
  authorId,
  subCommentId,
  date,
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
            </p>
            <p className={styles.date}>{date}</p>
          </div>
          <h2 className={styles.text}>{lastComment}</h2>
        </div>
      </div>
      
      <OptionsComments lastCommentId={lastCommentId} roleId={roleId} authorId={authorId} userId={authorId} role={groupRole}>
        <NewComments
          profilePhoto={authorProfilePhoto!}
          subCommentId={subCommentId}
          authorId={authorId}
        />
      </OptionsComments>
    </div>
  );
};
import { NewComments } from 'components/atoms/NewComments/NewComments';

import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';

import styles from './LastComment.module.scss';
