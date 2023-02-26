import { useEffect, useState } from 'react';
import Image from 'next/image';
import { verifyEmail, sendVerificationEmail } from 'supertokens-web-js/recipe/emailverification';
import { Button } from '@chakra-ui/react';

import { Footer } from 'components/molecules/Footer/Footer';

import styles from './index.module.scss';
import success from 'public/success.png';
import error from 'public/error.png';

export default function VerifyEmail() {
  const [status, setStatus] = useState<'success' | 'error' | ''>('');
  const [valuesFields, setValuesFields] = useState<string>('');

  const sendEmail = async () => {
    try {
      const response = await sendVerificationEmail();
      if (response.status === 'OK') {
        setValuesFields('Please check your email and click the link in it');
      }
    } catch (e: any) {
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message :'Oops! Something went wrong.');      
    }
  };

  const consumeVerificationCode = async () => {
    try {
      const response = await verifyEmail();
      if (response.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
        setValuesFields('The verification code is expired or invalid. Please click the button to send new email verification link again.');
        setStatus('error');
      } else {
        setValuesFields('You verified your e-mail.');
        setStatus('success');
      }
    } catch (e: any) {
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message :'Oops! Something went wrong.');      
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
          objectFit="contain"
          objectPosition="center"
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
      <Footer />
    </>
  );
}
