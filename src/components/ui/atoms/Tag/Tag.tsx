import styles from './Tag.module.css';

export const Tag = ({ value }: { value: string }) => {
  return (
    <span
      className={
        value === 'ADMIN'
          ? styles.admin
          : value === 'MODERATOR'
            ? styles.moderator
            : value === 'AUTHOR'
              ? styles.author
              : styles.tag
      }>
      {value}
    </span>
  );
};
