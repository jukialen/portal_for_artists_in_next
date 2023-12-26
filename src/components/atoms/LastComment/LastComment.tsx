import { useContext } from 'react';
import { Link } from '@chakra-ui/next-js';
import { Avatar } from '@chakra-ui/react';

import { LastCommentType } from 'src/types/global.types';

import { DCContext } from 'src/providers/DeleteCommentProvider';

import { NewComments } from 'src/components/atoms/NewComments/NewComments';
import { OptionsComments } from 'src/components/molecules/OptionsComments/OptionsComments';

import styles from './LastComment.module.scss';

export const LastComment = ({
  lastCommentId,
  lastComment,
  pseudonym,
  profilePhoto,
  role,
  roleId,
  groupRole,
  authorId,
  subCommentId,
  fileId,
  postId,
  date,
}: LastCommentType) => {
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
          <h2 className={styles.text}>{lastComment}</h2>
        </div>
      </div>

      <OptionsComments lastCommentId={lastCommentId} roleId={roleId} groupRole={groupRole} authorId={authorId}>
        <NewComments profilePhoto={profilePhoto} subCommentId={subCommentId} fileId={fileId} postId={postId} />
      </OptionsComments>
    </div>
  );
};
