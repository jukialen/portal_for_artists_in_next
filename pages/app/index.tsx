import { useRouter } from 'next/router';
import { auth } from '../../firebase';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import { HeadCom } from 'components/atoms/HeadCom';
import { Wrapper } from 'components/organisms/Wrapper/Wrapper';

import styles from './index.module.scss';

export default function Application() {
  const { asPath } = useRouter();
  
  const currentUser = auth.currentUser;
  const data = useHookSWR();
  
  const loading = useCurrentUser('/');
  
  // @ts-ignore
  return !loading ? (
    <section className='workspace'>
      <HeadCom path={`${asPath}`} content='Main site for logged in users.' />
  
      <h2 className={styles.top__among__users}>{data?.App?.topAmongUsers}</h2>
      <Wrapper idWrapper='carouselTop' />
      <h2 className={styles.liked}>{data?.App?.liked}</h2>
      <Wrapper idWrapper='carouselLiked' />
    </section>
  ) : null;
};