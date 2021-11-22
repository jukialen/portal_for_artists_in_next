import { FC } from 'react';

import { Photos } from 'components/atoms/Photos/Photos';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';

import styles from './GalleryAccount.module.scss';

export const GalleryAccount: FC = ({ data }: any) => {
  return (
    <article id='user__gallery__in__account' className={styles.user__gallery__in__account}>
      <em className={styles.title}>{data?.Account?.gallery?.userFilesTitle}</em>
      
      <FilesUpload />
    
      <div className={styles.user__photos}>
        <Photos />
        <Photos />
        <Photos />
        <Photos />
        <Photos />
        <Photos />
      </div>
      
      <em className={styles.title}>{data?.Account?.gallery?.userLikedFiles}</em>
      
      <div className={styles.like__photos}>
        <Photos />
        <Photos />
        <Photos />
        <Photos />
        <Photos />
        <Photos />
      </div>
    </article>
  );
};
