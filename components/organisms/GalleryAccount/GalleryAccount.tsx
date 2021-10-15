import { FC } from 'react';

import { Photos } from 'components/atoms/Photos/Photos';

import './GalleryAccount.module.scss';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';

export const GalleryAccount: FC = () => {
  return (
    <article id="user__gallery__in__account" className="user__gallery__in__account">
      <em>Twoje zdjęcia i rysunki</em>

      <FilesUpload />

      <div className="user__photos">
        <Photos />
        <Photos />
        <Photos />
        <Photos />
        <Photos />
        <Photos />
      </div>

      <em>Polubione zdjęcia i rysunki</em>
      <div className="like__photos">
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
