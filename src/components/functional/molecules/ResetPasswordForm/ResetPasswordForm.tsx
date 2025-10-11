'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from '../../../../shemasValidation/schemaValidation';

import { createClient } from 'utils/supabase/clientCSR';

import { backUrl } from 'constants/links';
import { LangType } from 'types/global.types';

import { FormError } from 'components/ui/atoms/FormError/FormError';
import { Alerts } from 'components/ui/atoms/Alerts/Alerts';
import { Separator } from 'components/ui/atoms/Separator/Separator';

import styles from './ResetPasswordForm.module.scss';

type ResetPasswordType = {
  newPassword: string;
  repeatPassword: string;
};

type ResetPassTrType = {
  reset: {
    wrongValues: string;
    failed: string;
    success: string;
    unknownError: string;
    title: string;
    subtitle: string;
    newPassword: string;
    againNewPassword: string;
    buttonAria: string;
    changePassword: string;
  };
  locale: LangType;
};

export const ResetPasswordForm = ({ reset, locale }: ResetPassTrType) => {
  const [valuesFields, setValuesFields] = useState<string>('');

  const { push } = useRouter();

  const initialValues = {
    newPassword: '',
    repeatPassword: '',
  };

  const schemaValidation = Yup.object({
    newPassword: SchemaValidation().password,
    repeatPassword: SchemaValidation().password,
  });

  const supabase = createClient();

  const newPasswordEntered = async ({ newPassword, repeatPassword }: ResetPasswordType) => {
    try {
      if (newPassword !== repeatPassword) {
        setValuesFields(reset.wrongValues);
        return null;
      } else {
        const { error } = await supabase.auth.updateUser(
          {
            password: newPassword,
          },
          { emailRedirectTo: `${backUrl}/${locale}/signin` },
        );

        if (error?.status !== 200) {
          console.log(error?.message!);
          setValuesFields(reset.failed);
        } else {
          setValuesFields(reset.success);
          setTimeout(() => push(`${locale}/`), 1000);
        }
      }
    } catch (e: any) {
      console.error(e);
      setValuesFields(reset.unknownError);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={newPasswordEntered}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.reset}>
          <div className={styles.borderContainer}>
            <h2 className={styles.title}>{reset.title}</h2>
            <Separator />
            <h3 className={styles.subtitle}>{reset.subtitle}</h3>
            <input
              name="newPassword"
              type="password"
              value={values.newPassword}
              onChange={handleChange}
              className={touched.newPassword && !!errors.newPassword ? styles.inputForm__error : styles.inputForm}
              placeholder={reset.newPassword}
            />

            <FormError nameError="newPassword" />

            <input
              name="repeatPassword"
              type="password"
              value={values.repeatPassword}
              onChange={handleChange}
              className={touched.repeatPassword && !!errors.repeatPassword ? styles.inputForm__error : styles.inputForm}
              placeholder={reset.againNewPassword}
            />

            <FormError nameError="repeatPassword" />

            <button type="submit" className={`button ${styles.submit__button}`} aria-label={reset.buttonAria}>
              {reset.changePassword}
            </button>

            {!!valuesFields && <Alerts valueFields={valuesFields} />}
          </div>
        </Form>
      )}
    </Formik>
  );
};
