import { useEffect, useState } from 'react';
import Image from 'next/image';
import { verifyEmail, sendVerificationEmail } from 'supertokens-web-js/recipe/emailverification';
import { Button } from '@chakra-ui/react';

<<<<<<<< Updated upstream:pages/verify-email/index.tsx
import { useHookSWR } from 'hooks/useHookSWR';

import styles from './index.module.scss';
import success from '../../../../public/success.png';
import error from '../../../../public/error.png';
========
import { useI18n, useScopedI18n } from "src/locales/client";

import styles from './page.module.scss';
import success from 'source/public/success.png';
import error from 'source/public/error.png';
>>>>>>>> Stashed changes:source/app/[locale]/verify-email/page.tsx

export default function VerifyEmail() {
  const [status, setStatus] = useState<'success' | 'error' | ''>('');
  const [valuesFields, setValuesFields] = useState('');

  const data = useHookSWR();

  const sendEmail = async () => {
    try {
      const response = await sendVerificationEmail();
      if (response.status === 'OK') {
        setValuesFields(data?.EmailVerification?.sendedSuccess);
      }
    } catch (e: any) {
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : data?.unknownError);
    }
  };

  const consumeVerificationCode = async () => {
    try {
      const response = await verifyEmail();
      if (response.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
        setValuesFields(data?.EmailVerification?.expired);
        setStatus('error');
      } else {
        setValuesFields(data?.EmailVerification?.verified);
        setStatus('success');
      }
    } catch (e: any) {
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : data?.unknownError);
    }
  };

  useEffect(() => {
    consumeVerificationCode();
  }, []);

  if (status === '') {
    return null;
  }

  return (
    <>
      <div className={styles.container}>
        <Image
          src={status === 'success' ? success : error}
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          width="200"
          height="200"
          alt={`${status === 'success' ? 'success' : 'error'} icon`}
          priority
        />
        {status === 'success' ? (
          <>
            <h2>Congratulations!</h2>
            <p>{valuesFields}</p>
          </>
        ) : (
          <>
            <p>{valuesFields}</p>
            <Button colorScheme="blue" borderColor="transparent" onClick={sendEmail}>
              Continue
            </Button>
          </>
        )}
      </div>
    </>
  );
}
