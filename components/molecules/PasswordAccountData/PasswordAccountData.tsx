import { DataType } from 'types/global.types';

import { Inputs } from 'components/atoms/Inputs/Inputs';

import styles from './PasswordAccountData.module.scss';

export const PasswordAccountData = ({ data }: DataType) => {
  return (
    <form className={styles.form}>
      <label className={styles.title} htmlFor='password'>{`${data?.Nav?.account}:`}</label>
      
      <Inputs
        idInputs='password'
        className={styles.input}
        typeInput='password'
        placeholderInput={data?.Account?.aData?.currentPassword}
        required={true}
      />
      <Inputs
        className={styles.input}
        typeInput='password'
        placeholderInput={data?.Account?.aData?.newPassword}
        required={true}
      />
      <Inputs
        className={styles.input}
        typeInput='password'
        placeholderInput={data?.Account?.aData?.againNewPassword}
        required={true}
      />
      
      <button className={`${styles.button} button`} type='submit' aria-label='Submit new password'>
        {data?.Account?.aData?.changePassword}
      </button>
    </form>
  );
};
