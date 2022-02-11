import { DataType } from 'types/global.types';

import { SubscriptiomAccountData } from 'components/molecules/SubscriptiomAccountData/SubscriptiomAccountData';
import { MailAccountData } from 'components/molecules/MailAccountData/MailAccountData';
import { PasswordAccountData } from 'components/molecules/PasswordAccountData/PasswordAccountData';

import styles from './AccountData.module.scss';

export const AccountData = ({ data }: DataType) => {
  return (
    <article id='account__data' className={styles.account__data}>
      <SubscriptiomAccountData data={data} />
      
      <MailAccountData data={data} />
      
      <PasswordAccountData data={data} />
    </article>
  );
};
