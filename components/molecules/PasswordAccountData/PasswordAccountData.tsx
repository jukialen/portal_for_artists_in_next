import { Inputs } from 'components/atoms/Inputs/Inputs';

import styles from './PasswordAccountData.module.scss';

export const PasswordAccountData = ({ data }: any) => {
  return (
    <form className={styles.form}>
      <label className={styles.title} htmlFor='password'>{`${data?.Nav?.account}:`}</label>
      
      <Inputs
        idInputs='password'
        className={styles.input}
        typeInput='password'
        placeholderInput={data?.Account?.aData?.currentPassword}
        // @ts-ignore
        required='required'
      />
      <Inputs
        className={styles.input}
        typeInput='password'
        placeholderInput={data?.Account?.aData?.newPassword}
        // @ts-ignore
        required='required'
      />
      <Inputs
        className={styles.input}
        typeInput='password'
        placeholderInput={data?.Account?.aData?.againNewPassword}
        // @ts-ignore
        required='required'
      />
      
      <button className={`${styles.button} button`} type='submit' aria-label='Submit new password'>
        {data?.Account?.aData?.changePassword}
      </button>
    </form>
  );
};
