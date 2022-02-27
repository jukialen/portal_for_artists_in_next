import { auth } from '../../firebase';

import { useHookSWR } from 'hooks/useHookSWR';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AccountMenu } from 'components/molecules/AccountMenu/AccountMenu';
import { AccountData } from 'components/organisms/AccountData/AccountData';
import { FilesUpload } from 'components/molecules/FilesUpload/FilesUpload';
import { PhotosGallery } from 'components/organisms/PhotosGallery/PhotosGallery';
import { VideoGallery } from 'components/organisms/VideoGallery/VideoGallery';
import { ProfileAccount } from 'components/organisms/ProfileAccount/ProfileAccount';

import styles from './index.module.scss';
import { AnimatedGallery } from '../../components/organisms/AnimatedGallery/AnimatedGallery';
import { useUserData } from '../../hooks/useUserData';

export default function Account() {
  const currentUser = auth.currentUser;
  
  const data = useHookSWR();
  const loading = useCurrentUser('/');
  const { pseudonym } = useUserData();
  return !loading ? (
    <section className='workspace'>
      <HeadCom path={`/account/${pseudonym || currentUser?.displayName}`} content='Account portal site.' />
      
      <h2 className={styles.account__h2}>{data?.Nav?.account}</h2>
      
      <AccountMenu data={data} />
      
      <AccountData data={data} />
      
      <FilesUpload />
      
      <PhotosGallery data={data} />
      
      <AnimatedGallery data={data} />
      
      <VideoGallery data={data} />
      
      <ProfileAccount data={data} />
    </section>
  ) : null
};