import { AccountMenu } from 'components/molecules/AccountMenu/AccountMenu';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { GalleryAccount } from 'components/organisms/GalleryAccount/GalleryAccount';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';

import styles from './index.module.scss';

export default function Account() {
  
  return (
    <section className='workspace'>
      <h2 className={styles.account__h2}>Konto</h2>
      
      <AccountMenu />
      
      <AccountData />
      
      <GalleryAccount />
      
      <ProfileAccount />
    </section>
  );
}
