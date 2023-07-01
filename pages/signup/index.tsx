import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { doesEmailExist, emailPasswordSignUp } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { sendVerificationEmail } from 'supertokens-web-js/recipe/emailverification';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SchemaValidation } from 'shemasValidation/schemaValidation';

import { ResetFormType, UserFormType } from 'types/global.types';

import { FormError } from 'components/molecules/FormError/FormError';
import { Providers } from 'components/molecules/Providers/Providers';
import { Alerts } from 'components/atoms/Alerts/Alerts';

import styles from './index.module.scss';

import { Divider, IconButton, Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import { useHookSWR } from 'hooks/useHookSWR';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';

export default function Registration() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valuesFields, setValuesFields] = useState<string>('');
  const [show, setShow] = useState(false);

  const { asPath } = useRouter();
  const data = useHookSWR();
  const { locale, push } = useRouter();

  const showPass = () => setShow(!show);

  const initialValues = {
    email: '',
    password: '',
  };

  const schemaValidation = Yup.object({
    email: SchemaValidation().email,
    password: SchemaValidation().password,
  });

  const registration = async ({ email, password }: UserFormType, { resetForm }: ResetFormType) => {
    try {
      setIsLoading(true);
      const exist = await doesEmailExist({ email });

      if (exist.doesExist) {
        setValuesFields(data?.NavForm?.theSameEmail);
        resetForm(initialValues);
        setIsLoading(false);
        await push('/');
        return null;
      }

      const response = await emailPasswordSignUp({
        formFields: [
          { id: 'email', value: email! },
          { id: 'password', value: password! },
        ],
      });

      if (response.status === 'FIELD_ERROR') {
        response.formFields.forEach((formField: { id: string; error: string }) => {
          setValuesFields(
            formField.error === 'This email already exists. Please sign in instead.'
              ? data?.NavForm?.theSameEmail
              : formField.error,
          );
          return null;
        });
      } else {
        const res = await sendVerificationEmail();

        if (res.status === 'EMAIL_ALREADY_VERIFIED_ERROR') {
          resetForm(initialValues);
          //          await push('/signin');
          //          setIsLoading(false);
          return null;
        } else {
          resetForm(initialValues);
          setValuesFields(data?.NavForm?.successInfoRegistration);
          setIsLoading(false);
          return null;
        }
      }
    } catch (e: any) {
      console.error(e);
      setValuesFields(e.isSuperTokensGeneralError === true ? e.message : data?.error);
      setIsLoading(!isLoading);
    }
  };

  return (
    <>
      <HeadCom path={asPath} content="Sign up site" />

      <div className={styles.create__account}>
        <Formik initialValues={initialValues} validationSchema={schemaValidation} onSubmit={registration}>
          {({ values, handleChange, errors, touched }) => (
            <Form>
              <h2 className={styles.title}>{data?.NavForm?.titleOfRegistration}</h2>

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
                {isLoading ? data?.NavForm?.loadingRegistration : data?.NavForm?.createSubmit}
              </button>

              {!!valuesFields && (
                <div className={styles.chakraAlert}>
                  <Alerts valueFields={valuesFields} />
                </div>
              )}
            </Form>
          )}
        </Formik>

        <div className={styles.dividerWIthText}>
          <Divider />
          <h4 className={styles.provider__title}>{data?.NavForm?.providerTitleRegistration}</h4>
          <Divider />
        </div>

        <Providers />
        <p className={styles.acceptInfo}>
          {data?.NavForm?.acceptInfoOne}
          <Link href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '/terms' : `/${locale}/terms`}`}>
            {data?.NavForm?.acceptInfoTwo}
          </Link>
          {data?.NavForm?.acceptInfoThree}
          <Link href={`${process.env.NEXT_PUBLIC_PAGE}${locale === 'en' ? '/privacy' : `/${locale}/privacy`}`}>
            {data?.NavForm?.acceptInfoFour}
          </Link>
          {data?.NavForm?.dot}
        </p>

        <p className={styles.changeForm}>
          {data?.NavForm?.changeToCreate}
          <Link href="/signin">{data?.Nav?.signIn}</Link>
        </p>
      </div>
    </>
  );
}
