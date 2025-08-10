'use client';

import { useState } from 'react';
import { createClient } from 'utils/supabase/clientCSR';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Separator, Input } from '@chakra-ui/react';

import { backUrl } from 'constants/links';
import { LangType, ResetFormType, UserFormType } from 'types/global.types';

import { useI18n } from 'locales/client';

import { FormError } from 'components/atoms/FormError/FormError';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './FormForgotten.module.scss';

export const FormForgotten = ({ locale }: { locale: LangType }) => {
  const [valuesFields, setValuesFields] = useState('');

  const t = useI18n();

  const supabase = createClient();

  const initialValues = {
    email: '',
  };

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
  });

  const reset__password = async ({ email }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${backUrl}/${locale}/new-password`,
      });

      if (error?.status === 200) {
        setValuesFields(error?.message!);
        return;
      }
      resetForm(initialValues);
      setValuesFields(t('Forgotten.success'));
    } catch (e) {
      console.error(e);
      setValuesFields(t('unknownError'));
      setValuesFields(t('error'));
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={reset__password}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.forgotten}>
          <div className={styles.borderContainer}>
            <h2 className={styles.title}>{t('Forgotten.title')}</h2>
            <Separator />
            <h3 className={styles.subtitle}>{t('Forgotten.subtitle')}</h3>
            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              className={touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm}
              placeholder={t('NavForm.email')}
            />

            <FormError nameError="email" />

            <button type="submit" className={`button `} aria-label={t('Forgotten.buttonAria')}>
              {t('AnotherForm.send')}
            </button>

            {!!valuesFields && <Alerts valueFields={valuesFields} />}
          </div>
        </Form>
      )}
    </Formik>
  );
};
