import { useContext } from 'react';
import { useRouter } from 'next/router';

import styles from './Providers.module.scss';

import { Button } from 'components/atoms/Button/Button';

import { AppleFilled, GoogleOutlined, YahooFilled } from '@ant-design/icons';
import { NavFormContext } from 'providers/NavFormProvider';

export const Providers = () => {
  const { isLogin } = useContext(NavFormContext);

  const router = useRouter();

  isLogin && router.push('/app');

  return (
    <div className={styles.providers}>
      <Button
        classButton={styles.google}
        typeButton="submit"
        ariaLabel="google provider"
        elementButton={<GoogleOutlined />}
        // @ts-ignore
        // onClick={signInWithGoogle}
      />
      <Button
        classButton={styles.apple}
        typeButton="submit"
        ariaLabel="apple provider"
        elementButton={<AppleFilled />}
      />
      <Button
        classButton={styles.yahoo}
        typeButton="submit"
        ariaLabel="yahoo provider"
        elementButton={<YahooFilled />}
        // @ts-ignore
        // onClick={signInWithYahoo}
      />
    </div>
  );
};
