import { useRouter } from 'next/router';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';

import styles from './index.module.scss';
import form from '@chakra-ui/theme/src/components/form';
import { Article } from 'components/molecules/Article/Article';
import { AppWrapper } from 'components/atoms/AppWrapper/AppWrapper';

export default function Application() {
  const { asPath } = useRouter();
  
  const data = useHookSWR();
  
  const loading = useCurrentUser('/');
  
  return !loading ? (
    <section className='workspace'>
      <HeadCom path={asPath} content='Main site for logged in users.' />
  
      <h2 className={styles.top__among__users}>{data?.App?.topAmongUsers}</h2>
      <AppWrapper>
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
      </AppWrapper>
      <h2 className={styles.liked}>{data?.App?.liked}</h2>
      <AppWrapper>
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
        <Article imgLink='/#' />
      </AppWrapper>
    </section>
  ) : null;
};