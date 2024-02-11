'use client';

import { useContext, useState } from 'react';
import { redirect, useRouter } from "next/navigation";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { IconButton, Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';

import { useI18n, useScopedI18n } from 'locales/client';

import { ResetFormType, UserFormType, UserType } from 'types/global.types';

import { backUrl } from 'constants/links';
import { initialValuesForSignInUp } from 'constants/objects';


import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './FormSignIn.module.scss';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const FormSignIn = ({ locale }: { locale: string }) => {
  const [show, setShow] = useState(false);
  const [valuesFields, setValuesFields] = useState('');

  const { push } = useRouter();

  const tNavForm = useScopedI18n('NavForm');

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    password: SchemaValidation().password,
  });

  const showPass = () => setShow(!show);

  const signIn = async ({ email, password }: UserFormType, { resetForm }: ResetFormType) => {
      const supabase = createClientComponentClient();

      const { data, error } = await supabase.auth.signInWithPassword({ email, password: password! });

      if (!!error && error.status !== 200) {
        setValuesFields(tNavForm('wrongLoginData'));
      } else {
        resetForm(initialValuesForSignInUp);
        setValuesFields(tNavForm('statusLogin'));

        const { data: dataUser, error: eUsers } = await supabase
          .from('Users')
          .select('*')
          .eq('id', data.session?.user.id);
        

        if (dataUser?.length !== 0) {
          localStorage.setItem('menu', 'true');
          push(`/${locale}/app`);
        } else {
          push(`/${locale}/new-user`);
        }
      }
  };

  return (
    <Formik initialValues={initialValuesForSignInUp} validationSchema={schemaValidation} onSubmit={signIn}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>{tNavForm('titleOfLogin')}</h2>

          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder={tNavForm('email')}
            className={touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm}
          />

          <FormError nameError="email" />

          <Stack spacing={4}>
            <InputGroup>
              <Input
                name="password"
                type={show ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                placeholder={tNavForm('password')}
                className={touched.password && !!errors.password ? styles.inputForm__error : styles.inputForm}
              />
              <InputRightElement>
                <IconButton
                  className={styles.showingPass}
                  onClick={showPass}
                  icon={show ? <ViewIcon /> : <ViewOffIcon />}
                  aria-label="show and hide password"
                />
              </InputRightElement>
            </InputGroup>
          </Stack>

          <FormError nameError="password" />

          <button type="submit" className={`button ${styles.submit__button}`} aria-label="login button">
            {tNavForm('loginSubmit')}
          </button>

          {!!valuesFields && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
