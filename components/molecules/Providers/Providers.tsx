import { auth } from '../../../firebase';

import { GithubOutlined, GoogleOutlined, YahooFilled } from '@ant-design/icons';
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";

import styles from './Providers.module.scss';

auth.useDeviceLanguage()

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, googleProvider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}

const yahooProvider = new OAuthProvider('yahoo.com');
const signInWithYahoo = () => {
  signInWithPopup(auth, yahooProvider)
  .then((result) => {
    // IdP data available in result.additionalUserInfo.profile
    // ...
    
    // Yahoo OAuth access token and ID token can be retrieved by calling:
    const credential = OAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    const idToken = credential?.idToken;
  })
  .catch((error) => {
    // Handle error.
  });
  
}

const githubProvider = new GithubAuthProvider();

const signInWithGithub = () => {
  signInWithPopup(auth, githubProvider)
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
    // ...
  });

}

export const Providers = () => {
  
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
        className={styles.apple}
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
