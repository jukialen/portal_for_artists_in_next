'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from 'utils/supabase/clientCSR';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { IconButton, Input, Stack, StackSeparator } from '@chakra-ui/react';
import { InputGroup } from 'components/ui/input-group';

import { LangType, ResetFormType, UserFormType } from 'types/global.types';

import { initialValuesForSignInUp } from 'constants/objects';

import { Alerts } from 'components/atoms/Alerts/Alerts';
import { FormError } from 'components/atoms/FormError/FormError';

import styles from './FormSignIn.module.scss';
import { GrFormView, GrFormViewHide } from 'react-icons/gr';

export const FormSignIn = ({
  locale,
  translated,
}: {
  locale: LangType;
  translated: {
    statusLogin: string;
    wrongLoginData: string;
    titleOfLogin: string;
    email: string;
    password: string;
    loginSubmit: string;
  };
}) => {
  const [show, setShow] = useState(false);
  const [valuesFields, setValuesFields] = useState('');

  const { push, refresh } = useRouter();

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    password: SchemaValidation().password,
  });
  const showPass = () => setShow(!show);

  const signIn = async ({ email, password }: UserFormType, { resetForm }: ResetFormType) => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: password! });

    if (!!error && error.status !== 200) {
      setValuesFields(translated.wrongLoginData);
    } else {
      resetForm(initialValuesForSignInUp);
      setValuesFields(translated.statusLogin);

      const { data: dataUser } = await supabase
        .from('Users')
        .select('*')
        .eq('id', data.session?.user.id!);

      if (dataUser?.length !== 0) {
        localStorage.setItem('menu', 'true');
        localStorage.getItem('menu') === 'true' && refresh();
      } else {
        push(`/${locale}/new-user`);
      }
    }
  };

  return (
    <Formik initialValues={initialValuesForSignInUp} validationSchema={schemaValidation} onSubmit={signIn}>
      {({ values, handleChange, errors, touched }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>{translated.titleOfLogin}</h2>

          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder={translated.email}
            className={touched.email && !!errors.email ? styles.inputForm__error : styles.inputForm}
          />

          <FormError nameError="email" />

          <Stack separator={<StackSeparator />}>
            <InputGroup
              flex="1"
              className={styles.inputGroup}
              endElement={
                <IconButton className={styles.showingPass} onClick={showPass} aria-label="show and hide password">
                  {show ? <GrFormView /> : <GrFormViewHide />}
                </IconButton>
              }>
              <Input
                name="password"
                type={show ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                placeholder={translated.password}
                className={touched.password && !!errors.password ? styles.inputForm__error : styles.inputForm}
              />
            </InputGroup>
          </Stack>

          <FormError nameError="password" />

          <button type="submit" className={`button ${styles.submit__button}`} aria-label="login button">
            {translated.loginSubmit}
          </button>

          {!!valuesFields && <Alerts valueFields={valuesFields} />}
        </Form>
      )}
    </Formik>
  );
};
