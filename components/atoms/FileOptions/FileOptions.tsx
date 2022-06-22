import styles from './FileOptions.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import { Comments } from '../Comments/Comments';

import { FileContainerType } from 'types/global.types';
import { useRouter } from 'next/router';
import { SharingButton } from '../SharingButton/SharingButton';

export const FileOptions = ({ authorName, link, tag }: FileContainerType) => {
  const [open, setOpen] = useState(false);
  
  const { locale } = useRouter();
  
  const showOpenComments = () => setOpen(!open);
  
  const titleShare = `Share ${authorName} user post from category ${tag}`;
  const linkShare = `${process.env.NEXT_PUBLIC_PAGE}/post/${authorName}/${link}/${tag}`;
  
  return (
    <div className={styles.options}>
      <div className={styles.bottomPanel}>
        <div className={styles.author__name}>
          <Link href={`${locale === 'en' ? '/' : `/${locale}/`}user/${authorName}`}>
            <a>
              {authorName}
            </a>
          </Link>
        </div>
      
        <SharingButton link={linkShare} tag={tag} authorName={authorName} titleShare={titleShare} />
      </div>
      <button className={styles.comments} onClick={showOpenComments}>Show comments</button>
      { open && <Comments /> }
    </div>

  )
}