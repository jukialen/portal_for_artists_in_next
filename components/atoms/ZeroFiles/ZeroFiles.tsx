import styles from './ZeroFiles.module.scss';

type TextType = {
  text: string
};

export const ZeroFiles = ({ text }: TextType) => <div className={styles.zero__files}>{text}</div>
