import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FileContainerType } from 'types/global.types';

import { addingFilesComment, filesComments } from 'config/referencesFirebase';

import { Comments } from 'components/molecules/Comments/Comments';
import { SharingButton } from 'components/atoms/SharingButton/SharingButton';
import { NewComments } from 'components/atoms/NewComments/NewComments';

import styles from './FileOptions.module.scss';
import { useHookSWR } from 'hooks/useHookSWR';

export const FileOptions = ({
  uid,
  idPost,
  authorName,
  tag,
  subCollection,
  description,
}: FileContainerType) => {
  const [open, setOpen] = useState(false);
  const { locale } = useRouter();

  const data = useHookSWR();

  const showOpenComments = () => setOpen(!open);

  const titleShare = `Share ${authorName} user post from category ${tag}`;
  const linkShare = `${process.env.NEXT_PUBLIC_PAGE}/post/${authorName}/${description}/${uid}/${subCollection}/${idPost}/${tag}`;

  return (
    <div className={styles.options}>
      <div className={styles.bottomPanel}>
        <div className={styles.author__name}>
          <Link href={`${locale === 'en' ? '/' : `/${locale}/`}user/${authorName}`}>
            <a>{authorName}</a>
          </Link>
        </div>

        <SharingButton link={linkShare} tag={tag} authorName={authorName} titleShare={titleShare} />
      </div>
      <button className={styles.comments} onClick={showOpenComments}>
        {data?.Comments?.comments}
      </button>
      {open && (
        <>
          <NewComments
            name={subCollection!}
            refCom={addingFilesComment(uid!, subCollection!, idPost!)}
          />
          <Comments
            refCom={filesComments(uid!, subCollection!, idPost!)}
            userId={uid}
            subCollection={subCollection}
            idPost={idPost}
          />
        </>
      )}
    </div>
  );
};
