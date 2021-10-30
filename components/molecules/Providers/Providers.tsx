import styles from './Providers.module.scss';

import { AppleFilled, GoogleOutlined, YahooFilled } from '@ant-design/icons';

export const Providers = () => {
  
  return (
    <div className={styles.providers}>
      <button
        className={styles.google}
        type='submit'
        aria-label='google provider'
        // @ts-ignore
        // onClick={signInWithGoogle}
      >
        <GoogleOutlined className={styles.svg} />
      </button>
      
      <button
        className={styles.apple}
        type='submit'
        aria-label='apple provider'
      >
        <AppleFilled className={styles.svg} />
      </button>
      <button
        className={styles.yahoo}
        type='submit'
        aria-label='yahoo provider'
        // @ts-ignore
        // onClick={signInWithYahoo}
      >
        <YahooFilled className={styles.svg} />
      </button>
    </div>
  );
};
