import { useContext } from 'react';
import { useRouter } from 'next/router';

import { StatusLoginContext } from 'providers/StatusLogin';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Footer } from 'components/molecules/Footer/Footer';

import styles from './index.module.scss';

const Authors = () => {
  const { asPath } = useRouter();
  const { isUser } = useContext(StatusLoginContext);

  return (
    <>
      <HeadCom path={asPath} content="Site about project authors." />

      <div className={styles.container}>
        <h2>Tutaj będą znajdować się informacje o kontakcie.</h2>
      </div>
      {!isUser && <Footer />}
    </>
  );
};

export default Authors;
