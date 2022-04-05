import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../firebase';

import { DataType, FileType } from 'types/global.types';

import styles from './index.module.scss';
import defaultAvatar from 'public/defaultAvatar.png';

export const ProfileUser = ({ data, pseudonym, description, fileUrl }: FileType | DataType) => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  
  const fileRef = ref(storage, `profilePhotos/${fileUrl}/${fileUrl}`);
  
  const profilePhoto = async () => {
    try {
      setPhotoUrl(await getDownloadURL(fileRef));
    } catch (e) {
      console.log(e)
    }
  };
  
  useEffect(() => {
    profilePhoto()
  }, []);
  
  return (
    <article className={styles.profile}>
      <div className={styles.photo__profile}>
        <Image
          layout='fill'
          src={photoUrl ? photoUrl : defaultAvatar}
          alt={photoUrl ? data?.userAvatar : data?.defaultAvatar}
          aria-label={fileUrl ? data?.userAvatar : data?.defaultAvatar}
          priority
        />
      </div>
      <div className={styles.pseudonym__name}>
        <label className={styles.title} htmlFor='pseudonym__user'>{data?.AnotherForm?.pseudonym}</label>
        <div id='pseudonym__user' className={styles.input}>{pseudonym}</div>
      </div>
      <div className={styles.about__me}>
        <label className={styles.title} htmlFor='about__user'>{data?.Account?.profile?.aboutMe}</label>
        <div id='about__user' className={styles.description}>{description}</div>
      </div>
    </article>
  )
}