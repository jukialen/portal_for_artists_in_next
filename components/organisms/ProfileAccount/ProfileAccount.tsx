import { DataType } from 'types/global.types';

import { useUserData } from 'hooks/useUserData';

import styles from './ProfileAccount.module.scss';

export const ProfileAccount = ({ data }: DataType) => {
  const { description } = useUserData();

  return (
    <article id="profile" className={styles.profile}>
      <h2 className={styles.title}>{data?.Account?.profile?.aboutMe}</h2>
      <div className={styles.publicContainer}>
        <div className={styles.description}>{description}</div>
      </div>
    </article>
  );
};
