import { useRouter } from 'next/router';

import { useCurrentUser } from 'hooks/useCurrentUser';

import { Wrapper } from 'components/organisms/Wrapper/Wrapper';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';

export default function Drawings() {
  const { asPath } = useRouter();
  const loading = useCurrentUser('/');
  
  return !loading ? (
    <div className='workspace'>
      <HeadCom path={`/${asPath}`} content='Sites with drawings and photos.' />
      <h1>podstrona z rysunkami</h1>
      <Wrapper idWrapper='drawingsWrapper' />
    </div>
  ) : null;
};