'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { emailPasswordSignIn } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'source/shemasValidation/schemaValidation';
import { IconButton, Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';

import { useI18n, useScopedI18n } from 'source/locales/client';

import { ResetFormType, UserFormType, UserType } from 'source/types/global.types';

import { backUrl } from 'source/constants/links';
import { initialValuesForSignInUp } from 'source/constants/objects';

import { MenuContext } from 'source/providers/MenuProvider';

import { Alerts } from 'source/components/atoms/Alerts/Alerts';
import { FormError } from 'source/components/molecules/FormError/FormError';

import styles from './FormSignIn.module.scss';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export const FormSignIn = ({ locale }: { locale: string }) => {
  const [show, setShow] = useState(false);
  const [valuesFields, setValuesFields] = useState('');
  const { changeMenu } = useContext(MenuContext);

  const t = useI18n();
  const tNavForm = useScopedI18n('NavForm');

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    password: SchemaValidation().password,
  });

  const { push } = useRouter();
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
        setValuesFields(tNavForm('wrongLoginData'));
      } else {
        resetForm(initialValuesForSignInUp);
        setValuesFields(tNavForm('statusLogin'));
        
        if (res.status === "OK") {
          const _data: { data: UserType } = await axios.get(`${backUrl}/users/current/${res.user.id}`);
          
          if (!!_data.data.pseudonym) {
            changeMenu('true');
            push(`/${locale}/app`);
          } else {
            push(`/${locale}/new-user`);
          }

        }
      }
    } catch (e: any) {
      console.error(e);
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : t('error'));
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
