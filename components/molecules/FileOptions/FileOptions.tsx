import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FileType } from 'types/global.types';

import { Comments } from 'components/molecules/Comments/Comments';
import { SharingButton } from 'components/atoms/SharingButton/SharingButton';
import { NewComments } from 'components/atoms/NewComments/NewComments';

import styles from './FileOptions.module.scss';
import { useHookSWR } from 'hooks/useHookSWR';

export const FileOptions = ({ name, authorName, tags, time }: FileType) => {
  const [open, setOpen] = useState(false);
  const { locale } = useRouter();

  const data = useHookSWR();

  const showOpenComments = () => setOpen(!open);

  const linkShare = `${process.env.NEXT_PUBLIC_PAGE}/post/${authorName}/${tags}/${name}`;

  return (
    <div className={styles.options}>
      <div className={styles.bottomPanel}>
        <div className={styles.author__name}>
          <Link href={`${locale === 'en' ? '/' : `/${locale}/`}user/${authorName}`}>
            <a>{authorName}</a>
          </Link>
        </div>

        <SharingButton name={name} fileUrl={linkShare} authorName={authorName} tags={tags} time={time} />
      </div>
      <button className={styles.comments} onClick={showOpenComments}>
        {data?.Comments?.comments}
      </button>
      {open && (
        <>
          <NewComments name={name} />
          <Comments userId={''} />
        </>
      )}
    </div>
  );
};
