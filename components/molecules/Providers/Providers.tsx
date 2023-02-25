import { useRouter } from 'next/router';
import { useContext } from 'react';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { thirdPartySignInAndUp } from "supertokens-web-js/recipe/thirdpartyemailpassword";

import { NavFormContext } from 'providers/NavFormProvider';
import { StatusLoginContext } from 'providers/StatusLogin';

import { GithubOutlined, GoogleOutlined, YahooFilled } from '@ant-design/icons';
import styles from './Providers.module.scss';
import axios from 'axios';

export const Providers = () => {
  const { push } = useRouter();
  const { showUser } = useContext(StatusLoginContext);
  const { isLogin, isCreate, showLoginForm, showCreateForm } = useContext(NavFormContext);

  const googleProvider = new GoogleAuthProvider();
  const yahooProvider = new OAuthProvider('yahoo.com');
  const githubProvider = new GithubAuthProvider();

  const signInWithProvider = async (provider: string) => {
    // try {
    //   await signInWithPopup(auth, provider);
    //   await push('/app');
    //   await showUser();
    //   if (isCreate) {
    //     await setDoc(doc(db, 'users', `${auth.currentUser?.uid}`), {
    //       pseudonym: auth.currentUser?.displayName,
    //     });
    //     showCreateForm();
    //   }
    //   isLogin && showLoginForm();
    // } catch (e) {
    //   console.log(e);
    // }

    try {
      const response = await thirdPartySignInAndUp(provider);

      if (response.status === "OK") {
        console.log(response.user)
        if (response.createdNewUser) {
          // sign up successful
          // axios.post(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users`, )
          showCreateForm();
        } else {
          // sign in successful
          await push('/app');
          await showUser();
        await showLoginForm()
        }
        window.location.assign("/home");
      } else {
        // SuperTokens requires that the third party provider
        // gives an email for the user. If that's not the case, sign up / in
        // will fail.

        // As a hack to solve this, you can override the backend functions to create a fake email for the user.

        window.alert("No email provided by social login. Please use another form of login");
        window.location.assign("/"); // redirect back to login page
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        window.alert(err.message);
      } else {
        console.log(err);
        window.alert("Oops! Something went wrong.");
      }
    }
  };

  return (
    <div className={styles.providers}>
      <button
        className={styles.google}
        type="submit"
        aria-label="google provider"
        onClick={() => signInWithProvider('google')}>
        <GoogleOutlined className={styles.svg} />
      </button>

      <button
        className={styles.github}
        type="submit"
        aria-label="github provider"
        onClick={() => signInWithProvider('spotify')}>
        <GithubOutlined className={styles.svg} />
      </button>
      <button
        className={styles.yahoo}
        type="submit"
        aria-label="yahoo provider"
        onClick={() => signInWithProvider('discord')}>
        <YahooFilled className={styles.svg} />
      </button>
    </div>
  );
};
