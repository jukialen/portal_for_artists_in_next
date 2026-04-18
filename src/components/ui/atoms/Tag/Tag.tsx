import styles from './Tag.module.css';

export const Tag = ({ value }: { value: string }) => {
  return <span className={styles.tag}>{value}</span>;
};
