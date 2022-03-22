import { useRouter } from 'next/router';
import { useContext } from 'react';
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../../firebase';

import { NavFormContext } from 'providers/NavFormProvider';
import { StatusLoginContext } from 'providers/StatusLogin';

import { GithubOutlined, GoogleOutlined, YahooFilled } from '@ant-design/icons';
import styles from './Providers.module.scss';
import { doc, setDoc } from 'firebase/firestore';

export const Providers = () => {
  const { push } = useRouter();
  const { showUser } = useContext(StatusLoginContext);
  const { isLogin, isCreate, showLoginForm, showCreateForm } = useContext(NavFormContext);
  
  const googleProvider = new GoogleAuthProvider();
  const yahooProvider = new OAuthProvider('yahoo.com');
  const githubProvider = new GithubAuthProvider();
  
  const signInWithProvider = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      await push('/app');
      await showUser();
      if (isCreate) {
        await setDoc(doc(db, 'users', `${auth.currentUser?.uid}`), { pseudonym: auth.currentUser?.displayName });
        showCreateForm();
      };
      isLogin && showLoginForm();
    } catch (e) {
      console.log(e);
    }
  }
  
  return (
    <div className={styles.providers}>
      <button
        className={styles.google}
        type='submit'
        aria-label='google provider'
        onClick={() => signInWithProvider(googleProvider)}
      >
        <GoogleOutlined className={styles.svg} />
      </button>
      
      <button
        className={styles.github}
        type='submit'
        aria-label='github provider'
        onClick={() => signInWithProvider(githubProvider)}
      >
        <GithubOutlined className={styles.svg} />
      </button>
      <button
        className={styles.yahoo}
        type='submit'
        aria-label='yahoo provider'
        onClick={() => signInWithProvider(yahooProvider)}
      >
        <YahooFilled className={styles.svg} />
      </button>
    </div>
  );
};
