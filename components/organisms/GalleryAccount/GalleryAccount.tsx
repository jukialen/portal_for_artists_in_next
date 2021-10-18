import { FC } from 'react';

import { Photos } from 'components/atoms/Photos/Photos';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';

import styles from './GalleryAccount.module.scss';

export const GalleryAccount: FC = () => {
  return (
    <article id="user__gallery__in__account" className={styles.user__gallery__in__account}>
      <em>Twoje zdjęcia i rysunki</em>

      <FilesUpload />

      <div className={styles.user__photos}>
        <Photos />
        <Photos />
        <Photos />
        <Photos />
        <Photos />
        <Photos />
      </div>

      <em>Polubione zdjęcia i rysunki</em>
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
