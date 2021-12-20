import { auth } from '../../firebase';

import { useHookSWR } from '../../hooks/useHookSWR';
import { useCurrentUser } from '../../hooks/useCurrentUser';

import { HeadCom } from 'components/atoms/HeadCom';
import { AccountMenu } from 'components/molecules/AccountMenu/AccountMenu';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { GalleryAccount } from 'components/organisms/GalleryAccount/GalleryAccount';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';

import styles from './index.module.scss';

export default function Account() {
  const currentUser = auth.currentUser;
  
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  
  return !loading ? (
    <section className='workspace'>
      <HeadCom path={`/account/${currentUser?.displayName}`} content='Account portal site.' />
      
      <h2 className={styles.account__h2}>{data?.Nav?.account} {currentUser?.displayName}</h2>
      
      <AccountMenu data={data} />
      
      <AccountData data={data} />
      
      <GalleryAccount data={data} />
      
      <ProfileAccount data={data} />
    </section>
  ) : null
};