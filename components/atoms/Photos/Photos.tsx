import Image from 'next/image';
import styles from './Photos.module.scss';

type PhotosType = {
  link: string;
  description: string | undefined;
  unopt?: boolean;
};

export const Photos = ({ link, description, unopt }: PhotosType) => {
  return <div className={styles.photos}>
    <Image src={link} layout='fill' priority alt={description} unoptimized={unopt}/>
    <button className={styles.comments}>Show comments</button>
  </div>;
};
