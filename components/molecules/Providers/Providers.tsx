import { Button } from 'components/atoms/Button/Button';

import './Providers.module.scss';
import { AppleFilled, GoogleOutlined, YahooFilled } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { NavFormContext } from 'providers/NavFormProvider';
import { useContext } from 'react';

export const Providers = () => {
  const { isLogin } = useContext(NavFormContext);

  const router = useRouter();

  isLogin && router.push('/app');

  return (
    <div className="providers">
      <Button
        classButton="google"
        typeButton="submit"
        ariaLabel="google provider"
        elementButton={<GoogleOutlined />}
        // @ts-ignore
        // onClick={signInWithGoogle}
      />
      <Button
        classButton="apple"
        typeButton="submit"
        ariaLabel="apple provider"
        elementButton={<AppleFilled />}
      />
      <Button
        classButton="yahoo"
        typeButton="submit"
        ariaLabel="yahoo provider"
        elementButton={<YahooFilled />}
        // @ts-ignore
        // onClick={signInWithYahoo}
      />
    </div>
  );
};
