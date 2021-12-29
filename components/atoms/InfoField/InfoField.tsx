import styles from './InfoField.module.scss';

type InfoType = {
  value: string
};

export const InfoField = ({ value }: InfoType) => <p className={styles.fields__info}>{value}</p>
