import { signInWithGoogle, signInWithGithub, signInWithYahoo } from 'pages/api/providersAuth/providersAuth'

import { GithubOutlined, GoogleOutlined, YahooFilled } from '@ant-design/icons';

import styles from './Providers.module.scss';

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
