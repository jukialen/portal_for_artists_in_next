import { auth } from '../../../firebase';
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';

auth.useDeviceLanguage()

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
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

export const signInWithYahoo = () => {
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

export const signInWithGithub = () => {
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