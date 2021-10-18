import React, { FC, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { FormField } from 'components/molecules/FormField/FormField';
import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';

import { Button } from 'components/atoms/Button/Button';

import styles from '../NavForm.module.scss';

import { NavFormContext } from 'providers/NavFormProvider';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

type LoginType = {
  email: string;
  password: string;
};

const initialValues = {
  email: '',
  password: '',
};

export const Login: FC = () => {
  const { isLogin } = useContext(NavFormContext);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [valuesFields, setValuesFields] = useState<string>('');

  const router = useRouter();
  // @ts-ignore
  const submitAccountData = async ({ email, password }: LoginType, { resetForm }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_LOGIN_USER}`,
        {
          identifier: email,
          password,
        },
      );
      // @ts-ignore
      typeof window !== 'undefined' && localStorage.setItem('user', JSON.stringify(data.jwt));
      resetForm(initialValues);
      // @ts-ignore
      setValuesFields(`${data.user.pseudonym} zostałaś/eś zalogowana/y`);
      return router.push(`${process.env.REACT_APP_FRONT_HOST_URL}/app`);
    } catch (error) {
      setErrorMessage('Nie mogliśmy Cię zalogować');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),

        password: Yup.string()
          .min(9, 'Hasło jest za krótkie. Minimum 9 znaków')
          .matches(/^(?=.*?[A-Z])/, 'Hasło musi zawierać conajmniej jedną dużą literę')
          .matches(/(?=[0-9])+/g, 'Hasło musi mieć conajmniej 1 cyfrę.')
          .matches(
            /(?=.*?[#?!@$%^&*-]+)/,
            'Hasło musi zawierać conajmniej 1 znak specjalny: #?!@$%^&*-',
          )
          .required('Required'),
      })}
      onSubmit={submitAccountData}
    >
      <Form className={styles.login && isLogin ? styles.form__menu__active : ''}>
        <h2>Zaloguj się!</h2>

        <FormField
          titleField="E-mail:"
          nameField="email"
          typeField="email"
          placeholderField="E-mail"
        />

        <FormError nameError="email" />

        <FormField
          titleField="Hasło:"
          nameField="password"
          typeField="password"
          placeholderField="Password"
        />

        <FormError nameError="password" />

        <Button
          typeButton="submit"
          classButton={styles.button}
          ariaLabel="login button"
          title="Zaloguj się"
        />

        {!!valuesFields ? <p className={styles.success__info}>{valuesFields}.</p> : null}

        {errorMessage ? <p>{errorMessage}</p> : null}

        <p className="separator">______________________________________</p>

        <h4>Lub zaloguj się za pomocą:</h4>

        <Providers />
      </Form>
    </Formik>
  );
};
