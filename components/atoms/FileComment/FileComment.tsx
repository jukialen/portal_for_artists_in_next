import { useContext } from 'react';
import Link from 'next/link';
import { Avatar } from '@chakra-ui/react';

import { FilesCommentsType } from 'types/global.types';

import { DCContext } from 'providers/DeleteCommentProvider';

import { NewComments } from 'components/atoms/NewComments/NewComments';
import { OptionsComments } from 'components/molecules/OptionsComments/OptionsComments';
import { SubComments } from 'components/molecules/SubComments/SubComments';

import styles from './Comment.module.scss';

export const FileComment = ({
  id,
  fileId,
  comment,
  pseudonym,
  profilePhoto,
  role,
  roleId,
  authorId,
  date,
}: FilesCommentsType) => {
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
        fileId={fileId}
        authorId={authorId}
        roleId={roleId}
        //        likes={likes}
        //        liked={liked}
        //        name={name}
      >
        <NewComments profilePhoto={profilePhoto} fileId={fileId} fileCommentId={id} />
        <SubComments fileCommentId={id} fileId={fileId} />
      </OptionsComments>
    </div>
  );
};
