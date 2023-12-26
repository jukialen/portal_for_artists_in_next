'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { verifyEmail, sendVerificationEmail } from 'supertokens-web-js/recipe/emailverification';
import { Button } from '@chakra-ui/react';

import { useI18n, useScopedI18n } from "locales/client";

import styles from './page.module.scss';
import success from 'public/success.png';
import error from 'public/error.png';

export default function VerifyEmail() {
  const [status, setStatus] = useState<'success' | 'error' | ''>('');
  const [valuesFields, setValuesFields] = useState('');
  
  const t = useI18n();
  const tEmailVerification = useScopedI18n('EmailVerification');

  const sendEmail = async () => {
    try {
      const response = await sendVerificationEmail();
      
      if (response.status === 'OK') {
        setValuesFields(tEmailVerification('sendedSuccess'));
      }
    } catch (e: any) {
      console.log(e);
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : t('unknownError'));
    }
  };

  const consumeVerificationCode = async () => {
    try {
      const response = await verifyEmail();
      if (response.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
        setValuesFields(tEmailVerification('expired'));
        setStatus('error');
      } else {
        setValuesFields(tEmailVerification('verified'));
        setStatus('success');
      }
    } catch (e: any) {
      console.log(e);
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : t('unknownError'));
    }
  };

  useEffect(() => {
    consumeVerificationCode();
  }, []);

  if (status === '') {
    return null;
  }

  return <div className={styles.container}>
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
  
}
