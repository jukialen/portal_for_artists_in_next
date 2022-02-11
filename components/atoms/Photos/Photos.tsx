import styles from './Photos.module.scss';
import Image from 'next/image';

type PhotosType = {
  link: string;
  description: string | undefined
};

export const Photos = ({ link, description }: PhotosType) => {
  return <div className={styles.photos}>
    <Image src={link} layout='fill' priority alt={description} />
    <button className={styles.comments}>Show comments</button>
  </div>;
};
