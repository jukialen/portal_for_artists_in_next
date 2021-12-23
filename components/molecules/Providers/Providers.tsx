import { GithubOutlined, GoogleOutlined, YahooFilled } from '@ant-design/icons';

import styles from './Providers.module.scss';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../firebase';
import { NavFormContext } from 'providers/NavFormProvider';

export const Providers = () => {
  const { push } = useRouter();
  const { isLogin, isCreate, showLoginForm, showCreateForm } = useContext(NavFormContext);
  
  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      await localStorage.getItem('fD') === `${process.env.NEXT_APP_LSTORAGE}` ? await push('/app'): await push('/new-user');
      if (isCreate) {
        showCreateForm()
      } else if (isLogin) {
        showLoginForm()
      }
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }
  
  const signInWithYahoo = () => {
    const yahooProvider = new OAuthProvider('yahoo.com');
    signInWithPopup(auth, yahooProvider)
    .then(async (result) => {
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      const idToken = credential?.idToken;
      await localStorage.getItem('fD') === `${process.env.NEXT_APP_LSTORAGE}` ? await push('/app'): await push('/new-user');
      if (isCreate) {
        showCreateForm()
      } else if (isLogin) {
        showLoginForm()
      }
    })
    .catch((error) => {
    });
  }
  
  const signInWithGithub = () => {
    const githubProvider = new GithubAuthProvider();
    signInWithPopup(auth, githubProvider)
    .then(async (result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      await localStorage.getItem('fD') === `${process.env.NEXT_APP_LSTORAGE}` ? await push('/app'): await push('/new-user');
      if (isCreate) {
        showCreateForm()
      } else if (isLogin) {
        showLoginForm()
      }
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GithubAuthProvider.credentialFromError(error);
    });
  }
  
  return (
    <div className={styles.providers}>
      <button
        className={styles.google}
        type='submit'
        aria-label='google provider'
        onClick={signInWithGoogle}
      >
        <GoogleOutlined className={styles.svg} />
      </button>
      
      <button
        className={styles.github}
        type='submit'
        aria-label='github provider'
        onClick={signInWithGithub}
      >
        <GithubOutlined className={styles.svg} />
      </button>
      <button
        className={styles.yahoo}
        type='submit'
        aria-label='yahoo provider'
        onClick={signInWithYahoo}
      >
        <YahooFilled className={styles.svg} />
      </button>
    </div>
  );
};
