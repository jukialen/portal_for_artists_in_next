import styles from './Photos.module.scss';

export const Photos = (...props: any[] ) => {
  return <div className={styles.photos} {...props} />;
};
