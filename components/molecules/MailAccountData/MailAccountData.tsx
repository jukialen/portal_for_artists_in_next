import { Inputs } from 'components/atoms/Inputs/Inputs';

import styles from './MailAccountData.module.scss';

export const MailAccountData = () => {
  return (
    <form className={styles.form}>
      <label className={styles.title} htmlFor='mail__change'>E-mail:</label>
      
      <Inputs className={styles.input} typeInput='type' placeholderInput='Aktualny e-mail' />
      <button
        id='mail__change'
        className={`${styles.button} button`}
        type='submit'
        aria-label='E-mail adress change'
      >
        Zmień adres e-mail
      </button>
    </form>
  );
};
