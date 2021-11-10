import { Inputs } from 'components/atoms/Inputs/Inputs';

import styles from './PasswordAccountData.module.scss';

export const PasswordAccountData = () => {
  return (
    <form className={styles.form}>
      <label className={styles.title} htmlFor='password'>Hasło:</label>
      
      <Inputs
        idInputs='password'
        className={styles.input}
        typeInput='password'
        placeholderInput='Wpisz aktualne hasło'
        // @ts-ignore
        required='required'
      />
      <Inputs
        className={styles.input}
        typeInput='password'
        placeholderInput='Wpisz nowe hasło'
        // @ts-ignore
        required='required'
      />
      <Inputs
        className={styles.input}
        typeInput='password'
        placeholderInput='Powtórz nowe hasło'
        // @ts-ignore
        required='required'
      />
      
      <button className={`${styles.button} button`} type='submit' aria-label='Submit new password'>
        Zmień hasło
      </button>
    </form>
  );
};
