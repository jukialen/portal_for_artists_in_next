import styles from './Tag.module.scss';

export const Tag = ({ value }: { value: string }) => {
  return <span className={styles.tag}>{value}</span>;
};
