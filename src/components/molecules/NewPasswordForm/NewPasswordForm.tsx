'use client';

import { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { createClient } from 'utils/supabase/clientCSR';

import { ResetFormType } from 'types/global.types';

import { FormError } from 'components/atoms/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';
import { Separator } from 'components/ui/Separator/Separator';

import styles from '../FormForgotten/FormForgotten.module.scss';

type TranslateType = {
  success: string;
  unknownError: string;
  error: string;
  title: string;
  subtitle: string;
  password: string;
  buttonAria: string;
  send: string;
};
export const NewPasswordForm = ({ translate }: { translate: TranslateType }) => {
  const [valuesFields, setValuesFields] = useState('');

  const supabase = createClient();

  const initialValues = {
    password: '',
  };

  const schemaValidation = Yup.object({
    password: SchemaValidation().password,
  });

  const updatePassword = async ({ password }: { password: string }, { resetForm }: ResetFormType) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      console.log('Reset data', data, '\n', 'error', error);
      if (error?.status !== 200) {
        setValuesFields(error?.message!);
      }
      resetForm(initialValues);
      setValuesFields(translate.success);
    } catch (e: any) {
      console.error(e);
      setValuesFields(translate.unknownError);
      setValuesFields(translate.error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={updatePassword}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.forgotten}>
          <div className={styles.borderContainer}>
            <h2 className={styles.title}>{translate.title}</h2>
            <Separator />
            <h3 className={styles.subtitle}>{translate.subtitle}</h3>
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              className={touched.password && !!errors.password ? styles.inputForm__error : styles.inputForm}
              placeholder={translate.password}
            />

            <FormError nameError="password" />

            <button type="submit" className={`button `} aria-label={translate.buttonAria}>
              {translate.send}
            </button>

            {!!valuesFields && <Alerts valueFields={valuesFields} />}
          </div>
        </Form>
      )}
    </Formik>
  );
};
