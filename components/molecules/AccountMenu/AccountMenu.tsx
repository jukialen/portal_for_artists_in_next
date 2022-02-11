import { DataType } from 'types/global.types';

import styles from './AccountMenu.module.scss';

export const AccountMenu = ({ data }: DataType) => {
  return (
    <article className={styles.account__menu}>
      <div className={styles.div}>
        <a href='#account__data'>{data?.Account?.aMenu?.general}</a>
      </div>
      <div className={styles.div}>
        <a href='#user__gallery__in__account'>{data?.Account?.aMenu?.gallery}</a>
      </div>
      <div className={styles.div}>
        <a href='#profile'>{data?.Account?.aMenu?.profile}</a>
      </div>
    </article>
  );
};
