'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { emailPasswordSignIn } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import Session from 'supertokens-web-js/recipe/session';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';
import { Divider, IconButton, Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';

import { ResetFormType, UserFormType, UserType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { backUrl } from 'utilites/constants';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './index.module.scss';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const initialValues = {
  email: '',
  password: '',
};

export default function Login() {
  const { push, asPath } = useRouter();
  const [show, setShow] = useState(false);
  const data = useHookSWR();

  const [valuesFields, setValuesFields] = useState('');

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    password: SchemaValidation().password,
  });

  //  if (useCurrentUser('/app')) {
  //    return push('/app');
  //  }
  const showPass = () => setShow(!show);

  const signIn = async ({ email, password }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      const res = await emailPasswordSignIn({
        formFields: [
          { id: 'email', value: email! },
          { id: 'password', value: password! },
        ],
      });

      if (res.status === 'FIELD_ERROR') {
        res.formFields.forEach((formField) => setValuesFields(formField.error));
      } else if (res.status === 'WRONG_CREDENTIALS_ERROR') {
        setValuesFields(data?.NavForm?.wrongLoginData);
      } else {
        resetForm(initialValues);
        setValuesFields(data?.NavForm?.statusLogin);
        if (await Session.doesSessionExist()) {
          const userId = await Session.getUserId();

          const data: { data: UserType } = await axios.get(`${backUrl}/users/current/${userId}`);

          if (!!data.data.pseudonym) {
            await push('/app');
          } else {
            await push('/new-user');
          }
        }
      }
    } catch (e: any) {
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : data?.error);
    }
  };

  return (
    <>
      <HeadCom path={asPath} content="Sign in site" />

      <div className={styles.login}>
        <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={signIn}>
          {({ values, handleChange, errors, touched }) => (
            <Form>
              <h2 className={styles.title}>{data?.NavForm?.titleOfLogin}</h2>

              <Input
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder={data?.NavForm?.email}
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
                    placeholder={data?.NavForm?.password}
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
                {data?.NavForm?.loginSubmit}
              </button>

              {!!valuesFields && <Alerts valueFields={valuesFields} />}
            </Form>
          )}
        </Formik>

        <Link href="/forgotten" className={styles.forgotten}>
          {data?.NavForm?.forgottenPasswordLink}
        </Link>

        <div className={styles.dividerWIthText}>
          <Divider />
          <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleLogin}</h4>
          <Divider />
        </div>

        <Providers />

        <p className={styles.changeForm}>
          {data?.NavForm?.changeToLogin}
          <Link href="/signup">{data?.Nav?.signUp}</Link>
        </p>
      </div>
    </>
  );
}
